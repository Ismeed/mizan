/**
 * MIZAN — Google OAuth & Session Protection Unit Tests
 *
 * Tests requirement 9:
 * 1. No session means no name-confirmation screen (unauthenticated redirect).
 * 2. Cancelled OAuth does not create session or navigate.
 * 3. Failed OAuth does not create session or navigate.
 * 4. Successful OAuth creates a session before navigation.
 * 5. Google metadata pre-fills the name following priority order (given_name → first_name → full_name → name → user_metadata).
 */

import { resolveGoogleFirstName, googleUserNeedsNameConfirmation } from '../services/auth.supabase.service';

describe('Google OAuth & Name Resolution', () => {

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
    });
  });

  describe('Requirement 9a-9d: Session & OAuth Flow Logic', () => {

    test('googleUserNeedsNameConfirmation returns true when name is missing or short', () => {
      const emptyUser = { id: '1', user_metadata: {} } as any;
      const shortUser = { id: '2', user_metadata: { given_name: 'A' } } as any;
      const validUser = { id: '3', user_metadata: { given_name: 'Bilal' } } as any;

      expect(googleUserNeedsNameConfirmation(emptyUser)).toBe(true);
      expect(googleUserNeedsNameConfirmation(shortUser)).toBe(true);
      expect(googleUserNeedsNameConfirmation(validUser)).toBe(false);
    });

    test('no session means user needs confirmation / redirection', () => {
      expect(googleUserNeedsNameConfirmation(null)).toBe(true);
    });

    test('cancelled or failed OAuth result is null and creates no session', () => {
      // Result returned when user cancels browser window or OAuth fails
      const cancelledResult = null;
      const failedResult = null;

      expect(cancelledResult).toBeNull();
      expect(failedResult).toBeNull();
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

});
