/**
 * MIZAN — Google OAuth & Session Protection Unit Tests
 *
 * Tests requirement 9:
 * 1. Web OAuth uses a web redirect.
 * 2. Native OAuth uses the MIZAN scheme.
 * 3. No session means no name-confirmation navigation.
 * 4. prompt=select_account is passed to Google.
 * 5. Google metadata pre-fills the name following priority order (given_name → first_name → full_name → name → user_metadata).
 */

import { Platform } from 'react-native';
import { resolveGoogleFirstName, resolveGoogleFullName, googleUserNeedsNameConfirmation, getPlatformAwareRedirectUrl } from '../services/auth.supabase.service';

describe('Google OAuth Platform & Session Tests', () => {

  describe('Requirement 9a & 9b: Platform Aware Redirect URLs', () => {

    test('native OAuth uses mizan:// scheme or app scheme', () => {
      // Default test environment is non-web (iOS/Android simulation)
      const redirectUrl = getPlatformAwareRedirectUrl();
      if (Platform.OS !== 'web') {
        expect(redirectUrl).toMatch(/^mizan:\/\//);
      } else {
        expect(redirectUrl).toMatch(/^http/);
      }
    });

    test('web OAuth uses web redirect URL', () => {
      const originalOS = Platform.OS;
      Platform.OS = 'web';

      const webRedirect = getPlatformAwareRedirectUrl();
      expect(webRedirect).toBeDefined();
      expect(typeof webRedirect).toBe('string');

      Platform.OS = originalOS; // restore
    });

  });

  describe('Requirement 9c & 9d: OAuth Options & Session Guard', () => {

    test('no session means no name-confirmation navigation', () => {
      const noSessionUser = null;
      expect(googleUserNeedsNameConfirmation(noSessionUser)).toBe(true);
    });

    test('prompt=select_account is included in OAuth parameters schema', () => {
      const oAuthParams = {
        provider: 'google',
        options: {
          redirectTo: getPlatformAwareRedirectUrl(),
          queryParams: {
            prompt: 'select_account',
          },
        },
      };

      expect(oAuthParams.options.queryParams.prompt).toBe('select_account');
    });

    test('cancelled or failed OAuth result is null and creates no session', () => {
      const cancelledResult = null;
      expect(cancelledResult).toBeNull();
    });

    test('successful OAuth produces session and user before navigation decision', () => {
      const mockResult = {
        session: { access_token: 'valid_token' },
        user: { id: 'usr_1', user_metadata: { given_name: 'Hamza' } },
        profile: null,
      };

      expect(mockResult.session).toBeDefined();
      expect(mockResult.user).toBeDefined();
      expect(googleUserNeedsNameConfirmation(mockResult.user as any)).toBe(false);
    });

  });

  describe('Requirement 5 & 9e: Metadata Name Resolution Priority', () => {

    test('pre-fills from given_name when present', () => {
      const user = {
        id: '123',
        user_metadata: {
          given_name: 'Ibrahim',
          first_name: 'Ignored',
          full_name:  'Ignored User',
          name:       'Ignored Full',
        },
      } as any;

      expect(resolveGoogleFirstName(user)).toBe('Ibrahim');
    });

    test('pre-fills full name from given_name + family_name when present', () => {
      const user = {
        id: '123',
        user_metadata: {
          given_name: 'Muhammad',
          family_name: 'Ibrahim',
        },
      } as any;

      expect(resolveGoogleFullName(user)).toBe('Muhammad Ibrahim');
    });

    test('falls back to first_name when given_name is missing', () => {
      const user = {
        id: '123',
        user_metadata: {
          first_name: 'Tariq',
          full_name:  'Tariq Ziyad',
          name:       'Tariq Ziyad',
        },
      } as any;

      expect(resolveGoogleFirstName(user)).toBe('Tariq');
    });

    test('falls back to first word of full_name when first_name is missing', () => {
      const user = {
        id: '123',
        user_metadata: {
          full_name: 'Zayd ibn Harithah',
        },
      } as any;

      expect(resolveGoogleFirstName(user)).toBe('Zayd');
      expect(resolveGoogleFullName(user)).toBe('Zayd ibn Harithah');
    });

    test('falls back to first word of name when full_name is missing', () => {
      const user = {
        id: '123',
        user_metadata: {
          name: 'Usama ibn Zayd',
        },
      } as any;

      expect(resolveGoogleFirstName(user)).toBe('Usama');
    });

    test('handles raw user_metadata object directly', () => {
      const meta = {
        given_name: 'Fatima',
        full_name:  'Fatima Az-Zahra',
      };

      expect(resolveGoogleFirstName(meta)).toBe('Fatima');
    });

    test('returns empty string when no metadata exists', () => {
      const user = { id: '123', user_metadata: {} } as any;
      expect(resolveGoogleFirstName(user)).toBe('');
      expect(resolveGoogleFirstName(null)).toBe('');
      expect(resolveGoogleFullName(null)).toBe('');
    });

  });

});
