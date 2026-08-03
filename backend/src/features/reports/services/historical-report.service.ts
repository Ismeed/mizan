/**
 * MIZAN — Historical Report Service (Phase 14)
 * Retrieves original completed calculation result envelopes and verifies immutable report snapshots.
 * NEVER recalculates or updates exchange rates.
 */

import type { CalculationResultEnvelope, StandardReportEnvelope } from '@mizan/shared';
import { ReportAssemblyService } from './report-assembly.service';

export class HistoricalReportService {
  static getHistoricalReport(envelope: CalculationResultEnvelope): StandardReportEnvelope {
    return ReportAssemblyService.assembleReport({
      envelope,
      reportType: 'HISTORICAL_REPORT',
      renderingContext: {
        historicalRendering: true,
      },
    });
  }
}
