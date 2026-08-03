/**
 * MIZAN — Report Template Registry Service (Phase 14)
 * Manages versioned report template definitions.
 */

import type { ReportTemplateDefinition } from '@mizan/shared';
import { ResultIntegrityService } from '../../results/services/result-integrity.service';

export class ReportTemplateRegistryService {
  private static defaultTemplate: ReportTemplateDefinition = {
    reportTemplateId: 'STANDARD-MIZAN-REPORT-001',
    version: '1.0.0',
    name: 'MIZAN Standard Calculation Report Template',
    description: 'Universal 12-section Islamic financial calculation report template for Mirath & Zakat',
    supportedModules: ['MIRATH', 'ZAKAT'],
    supportedReportTypes: [
      'SUMMARY_REPORT',
      'DETAILED_REPORT',
      'SCHOLAR_REVIEW_REPORT',
      'TECHNICAL_AUDIT_REPORT',
      'HISTORICAL_REPORT',
      'TRANSLATED_HISTORICAL_REPORT',
      'ALTERNATIVE_CURRENCY_REPORT',
    ],
    sectionSequence: [
      'REPORT_IDENTITY',
      'CALCULATION_PROFILE',
      'INPUT_SUMMARY',
      'VALIDATION_AND_SCOPE',
      'RESULT_SUMMARY',
      'DETAILED_BREAKDOWN',
      'EXCLUDED_AND_REVIEW_ITEMS',
      'EVIDENCE_AND_EXPLANATIONS',
      'TOTALS_AND_RECONCILIATION',
      'WARNINGS_AND_ACTIONS',
      'TECHNICAL_AND_AUDIT_DETAILS',
      'DECLARATION_AND_CLOSING',
    ],
    layoutPolicyId: 'LAYOUT-A4-STANDARD-001',
    typographyPolicyId: 'TYPO-MIZAN-EMERALD-GOLD-001',
    citationPolicyId: 'CITATION-STANDARD-001',
    pagePolicyId: 'PAGE-BREAK-SAFE-001',
    governance: {
      status: 'APPROVED',
      approvedBy: 'SHARIA_BOARD_AND_LEAD_ARCHITECT',
      approvedAt: '2026-08-03T00:00:00Z',
    },
    integrity: {
      contentChecksum: ResultIntegrityService.generateChecksum({
        id: 'STANDARD-MIZAN-REPORT-001',
        version: '1.0.0',
        sections: 12,
      }),
    },
  };

  static getTemplate(templateId = 'STANDARD-MIZAN-REPORT-001'): ReportTemplateDefinition {
    if (templateId === 'STANDARD-MIZAN-REPORT-001') {
      return this.defaultTemplate;
    }
    throw new Error(`TEMPLATE_NOT_FOUND: Report template ${templateId} does not exist`);
  }
}
