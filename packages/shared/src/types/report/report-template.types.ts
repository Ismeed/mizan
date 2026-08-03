/**
 * MIZAN — Report Template Definition & Registry Contract (Phase 14)
 */

import type { ReportType } from './report-type.registry';
import type { ReportSectionId } from './report-section.types';

export type TemplateStatus = 'DRAFT' | 'CONTENT_REVIEW' | 'SHARIA_REVIEW' | 'ACCESSIBILITY_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'DEPRECATED';

export interface ReportTemplateDefinition {
  reportTemplateId: string;
  version: string;
  name: string;
  description: string;
  supportedModules: Array<'MIRATH' | 'ZAKAT'>;
  supportedReportTypes: ReportType[];
  sectionSequence: ReportSectionId[];
  layoutPolicyId: string;
  typographyPolicyId: string;
  citationPolicyId: string;
  pagePolicyId: string;
  governance: {
    status: TemplateStatus;
    approvedBy?: string;
    approvedAt?: string;
  };
  integrity: {
    contentChecksum: string;
  };
}
