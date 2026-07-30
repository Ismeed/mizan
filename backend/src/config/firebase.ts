import * as admin from 'firebase-admin';
import { logger } from './logger';

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
  logger.info('Firebase Admin initialized');
} catch (error) {
  logger.error('Firebase Admin initialization failed', error);
}

export const firebaseAdmin = admin;
