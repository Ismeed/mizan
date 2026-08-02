import {
  BaseEvidence,
  EvidenceType,
  validateEvidenceId,
  BaseEvidenceSchema,
  QuranEvidenceSchema,
  HadithEvidenceSchema,
} from '@mizan/shared';
import { EvidenceChecksumService } from './evidence-checksum.service';

export interface EvidenceValidationError {
  code: string;
  field: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface EvidenceValidationReport {
  evidenceId: string;
  version: string;
  isValid: boolean;
  errors: EvidenceValidationError[];
  warnings: EvidenceValidationError[];
}

export class EvidenceValidatorService {
  /**
   * Performs complete validation on an Evidence record.
   */
  static validate(evidence: BaseEvidence): EvidenceValidationReport {
    const errors: EvidenceValidationError[] = [];
    const warnings: EvidenceValidationError[] = [];

    // 1. Permanent Evidence ID check
    if (!validateEvidenceId(evidence.evidenceId)) {
      errors.push({
        code: 'INVALID_EVIDENCE_ID',
        field: 'evidenceId',
        message: `Evidence ID '${evidence.evidenceId}' does not match standard pattern (e.g. QURAN-004-011-011 or HADITH-BUKHARI-001454)`,
        severity: 'ERROR',
      });
    }

    // 2. Base Schema validation
    const baseResult = BaseEvidenceSchema.safeParse(evidence);
    if (!baseResult.success) {
      baseResult.error.errors.forEach((err) => {
        errors.push({
          code: 'SCHEMA_VALIDATION_ERROR',
          field: err.path.join('.'),
          message: err.message,
          severity: 'ERROR',
        });
      });
    }

    // 3. Evidence Type specific checks
    if (evidence.evidenceType === EvidenceType.QURAN) {
      const quranResult = QuranEvidenceSchema.safeParse(evidence);
      if (!quranResult.success) {
        quranResult.error.errors.forEach((err) => {
          errors.push({
            code: 'QURAN_SCHEMA_ERROR',
            field: err.path.join('.'),
            message: err.message,
            severity: 'ERROR',
          });
        });
      }
      const ref = (evidence as any).reference;
      if (ref) {
        if (ref.surahNumber < 1 || ref.surahNumber > 114) {
          errors.push({
            code: 'INVALID_SURAH_NUMBER',
            field: 'reference.surahNumber',
            message: `Surah number ${ref.surahNumber} is invalid (must be 1-114)`,
            severity: 'ERROR',
          });
        }
        if (ref.ayahEnd < ref.ayahStart) {
          errors.push({
            code: 'INVALID_AYAH_RANGE',
            field: 'reference.ayahEnd',
            message: `Ayah end (${ref.ayahEnd}) cannot be less than ayah start (${ref.ayahStart})`,
            severity: 'ERROR',
          });
        }
      }
    }

    if (evidence.evidenceType === EvidenceType.HADITH) {
      const hadithResult = HadithEvidenceSchema.safeParse(evidence);
      if (!hadithResult.success) {
        hadithResult.error.errors.forEach((err) => {
          errors.push({
            code: 'HADITH_SCHEMA_ERROR',
            field: err.path.join('.'),
            message: err.message,
            severity: 'ERROR',
          });
        });
      }
      const grading = (evidence as any).grading;
      if (grading && grading.primaryGrade) {
        if (!grading.primaryGrade.gradingSourceId) {
          errors.push({
            code: 'MISSING_GRADING_SOURCE',
            field: 'grading.primaryGrade.gradingSourceId',
            message: 'Hadith grading record must include an attributed gradingSourceId',
            severity: 'ERROR',
          });
        }
      }
    }

    // 4. Licensing check
    if (!evidence.licensing || evidence.licensing.licenceStatus === 'UNKNOWN') {
      if (evidence.governance?.status === 'PRODUCTION') {
        errors.push({
          code: 'LICENCE_UNKNOWN_PRODUCTION_BLOCK',
          field: 'licensing.licenceStatus',
          message: 'Evidence with UNKNOWN licence status cannot be placed in PRODUCTION',
          severity: 'ERROR',
        });
      } else {
        warnings.push({
          code: 'LICENCE_UNKNOWN_WARNING',
          field: 'licensing.licenceStatus',
          message: 'Licence status is UNKNOWN — must be clarified before production publication',
          severity: 'WARNING',
        });
      }
    }

    // 5. Checksum integrity check
    if (evidence.integrity?.contentChecksum) {
      const expectedChecksum = EvidenceChecksumService.generateContentChecksum(evidence.content);
      if (evidence.integrity.contentChecksum !== expectedChecksum) {
        errors.push({
          code: 'CONTENT_CHECKSUM_MISMATCH',
          field: 'integrity.contentChecksum',
          message: 'Content checksum mismatch — content may have been modified without updating checksum',
          severity: 'ERROR',
        });
      }
    }

    // 6. Test fixture safety rule
    if (evidence.isTestFixture && evidence.governance?.status === 'PRODUCTION') {
      errors.push({
        code: 'TEST_FIXTURE_PRODUCTION_BLOCKED',
        field: 'governance.status',
        message: 'Synthetic test fixtures tagged with isTestFixture cannot have PRODUCTION status',
        severity: 'ERROR',
      });
    }

    return {
      evidenceId: evidence.evidenceId,
      version: evidence.version,
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
