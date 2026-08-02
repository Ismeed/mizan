/**
 * Hadith Grading Governance Standard (Phase 4)
 */

export type HadithGradeValue =
  | 'SAHIH'
  | 'HASAN'
  | 'DAIF'
  | 'MAWDU'
  | 'MUTAWATIR'
  | 'AHAD'
  | 'SCHOLAR_DISAGREEMENT';

export type HadithDisplayPolicy =
  | 'SHOW_APPROVED_PRIMARY'
  | 'SHOW_APPROVED_PRIMARY_WITH_ADDITIONAL_RECORDS'
  | 'SHOW_ALL_ATTRIBUTED_GRADES';

export interface HadithGradingRecord {
  grade: HadithGradeValue;
  gradingSystem?: string;
  grader: string;           // e.g. "Imam al-Bukhari", "Imam Muslim", "Al-Albani"
  gradingSourceId: string;
  sourceEdition?: string;
  notes?: string;
  reviewStatus: 'DRAFT' | 'APPROVED' | 'REJECTED';
}
