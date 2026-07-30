/**
 * Push Notification Service — MIZAN
 *
 * Uses Firebase Cloud Messaging (FCM) via the firebase-admin SDK.
 * Handles device token registration and sending push notifications.
 */
import * as admin from 'firebase-admin';
import { prisma } from '../../config/database';

/** Initialize Firebase Admin if credentials are set */
let firebaseInitialized = false;

function getFirebaseApp(): admin.app.App | null {
  if (firebaseInitialized) return admin.apps[0] ?? null;

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.warn('[Push] FIREBASE_SERVICE_ACCOUNT_JSON not set — push notifications disabled');
    return null;
  }

  try {
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    firebaseInitialized = true;
    return admin.apps[0] ?? null;
  } catch (err) {
    console.error('[Push] Failed to initialize Firebase:', err);
    return null;
  }
}

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export class PushNotificationService {
  private app = getFirebaseApp();

  /**
   * Register or refresh a device FCM token for a user.
   */
  async registerToken(userId: string, fcmToken: string, platform: 'ios' | 'android'): Promise<void> {
    // Upsert: if token already exists, update the user ID; if not, create
    await prisma.deviceToken.upsert({
      where: { fcm_token: fcmToken },
      update: { user_id: userId, platform, updated_at: new Date() },
      create: { user_id: userId, fcm_token: fcmToken, platform },
    }).catch(async () => {
      // Fall back to create-or-update by user+platform
      await prisma.deviceToken.deleteMany({ where: { user_id: userId, platform } });
      await prisma.deviceToken.create({ data: { user_id: userId, fcm_token: fcmToken, platform } });
    });
  }

  /**
   * Send a push notification to a single user (all their registered devices).
   */
  async sendToUser(userId: string, payload: PushPayload): Promise<void> {
    if (!this.app) return;

    const tokens = await prisma.deviceToken.findMany({
      where: { user_id: userId },
      select: { fcm_token: true },
    });

    if (tokens.length === 0) return;

    const tokenList = tokens.map(t => t.fcm_token);
    await this.sendToTokens(tokenList, payload);

    // Persist in-app notification
    await prisma.notification.create({
      data: {
        user_id:   userId,
        title:     payload.title,
        body:      payload.body,
        type:      (payload.data?.type ?? 'GENERAL') as any,
        data:      payload.data ? JSON.stringify(payload.data) : null,
        is_read:   false,
      },
    }).catch(() => {});
  }

  /**
   * Broadcast to ALL users (e.g. Ramadan reminders).
   * Processes in batches of 500 to respect FCM limits.
   */
  async broadcast(payload: PushPayload): Promise<{ sent: number; failed: number }> {
    if (!this.app) return { sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;
    let skip = 0;
    const BATCH = 500;

    while (true) {
      const tokens = await prisma.deviceToken.findMany({
        skip,
        take: BATCH,
        select: { fcm_token: true },
      });

      if (tokens.length === 0) break;

      const result = await this.sendToTokens(tokens.map(t => t.fcm_token), payload);
      sent   += result.successCount;
      failed += result.failureCount;
      skip   += BATCH;
    }

    return { sent, failed };
  }

  /**
   * Send to a list of FCM tokens. Handles token cleanup on failure.
   */
  private async sendToTokens(tokens: string[], payload: PushPayload): Promise<admin.messaging.BatchResponse> {
    const messaging = this.app!.messaging();

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body:  payload.body,
        imageUrl: payload.imageUrl,
      },
      data: payload.data ?? {},
      android: {
        notification: {
          channelId: 'mizan_default',
          priority:  'high',
          color:     '#1A4731',
        },
        priority: 'high',
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await messaging.sendEachForMulticast(message);

      // Remove invalid/expired tokens
      const invalidTokens: string[] = [];
      response.responses.forEach((r, idx) => {
        if (!r.success && (
          r.error?.code === 'messaging/invalid-registration-token' ||
          r.error?.code === 'messaging/registration-token-not-registered'
        )) {
          invalidTokens.push(tokens[idx]);
        }
      });

      if (invalidTokens.length > 0) {
        await prisma.deviceToken.deleteMany({
          where: { fcm_token: { in: invalidTokens } },
        }).catch(() => {});
      }

      return response;
    } catch (err) {
      console.error('[Push] Failed to send FCM message:', err);
      return { successCount: 0, failureCount: tokens.length, responses: [] };
    }
  }
}
