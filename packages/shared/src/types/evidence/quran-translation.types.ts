/**
 * Qur'an Translation Governance Standard (Phase 4)
 */

import { LicenceStatus } from './evidence-licensing.types';

export interface QuranTranslation {
  languageTag: string;
  locale: string;
  text: string;
  translationSourceId: string;
  translator: string;
  publisher?: string;
  edition?: string;
  publicationYear?: string;
  licenceStatus: LicenceStatus;
  attributionText?: string;
  reviewStatus: 'DRAFT' | 'ACADEMIC_REVIEW' | 'SHARIA_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string[];
  reviewedAt?: string | null;
  checksum: string;
  isApplicationDefault?: boolean;
}
