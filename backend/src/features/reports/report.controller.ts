/**
 * MIZAN — Report Controller (Phase 14)
 * Generates Standard Report Envelopes exclusively from Phase 13 CalculationResultEnvelope.
 * NEVER recalculates Islamic logic.
 */

import { Request, Response } from 'express';
import { CalculationResultRepositoryService } from '../results/services/calculation-result-repository.service';
import { ReportRenderingService } from './services/report-rendering.service';
import { ReportAssemblyService } from './services/report-assembly.service';
import { AIReportContextService } from './services/ai-report-context.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';
import { Readable } from 'stream';

export class ReportController {
  async getInheritanceReport(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const envelope = await CalculationResultRepositoryService.getByCalculationId(calculationId);

      if (!envelope) {
        return sendError(res, 'Calculation result envelope not found', 404);
      }

      const { report, renderedOutput } = await ReportRenderingService.generateReport({
        envelope,
        reportType: (req.query.reportType as any) ?? 'DETAILED_REPORT',
        format: 'PDF',
        languageTag: (req.query.lang as string) ?? envelope.profile.language.languageTag,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="mizan-inheritance-report-${report.reportId}.pdf"`);
      res.setHeader('Content-Length', renderedOutput.length);

      const stream = new Readable();
      stream.push(renderedOutput);
      stream.push(null);
      stream.pipe(res);
    } catch (error: any) {
      console.error('[Report Error]', error);
      return sendError(res, error.message || 'Failed to generate inheritance report', error.statusCode || 500);
    }
  }

  async getZakatReport(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const envelope = await CalculationResultRepositoryService.getByCalculationId(calculationId);

      if (!envelope) {
        return sendError(res, 'Calculation result envelope not found', 404);
      }

      const { report, renderedOutput } = await ReportRenderingService.generateReport({
        envelope,
        reportType: (req.query.reportType as any) ?? 'DETAILED_REPORT',
        format: 'PDF',
        languageTag: (req.query.lang as string) ?? envelope.profile.language.languageTag,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="mizan-zakat-report-${report.reportId}.pdf"`);
      res.setHeader('Content-Length', renderedOutput.length);

      const stream = new Readable();
      stream.push(renderedOutput);
      stream.push(null);
      stream.pipe(res);
    } catch (error: any) {
      console.error('[Report Error]', error);
      return sendError(res, error.message || 'Failed to generate zakat report', error.statusCode || 500);
    }
  }

  async getReportEnvelope(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const envelope = await CalculationResultRepositoryService.getByCalculationId(calculationId);

      if (!envelope) {
        return sendError(res, 'Calculation result envelope not found', 404);
      }

      const report = ReportAssemblyService.assembleReport({
        envelope,
        reportType: (req.query.reportType as any) ?? 'DETAILED_REPORT',
      });

      return sendSuccess(res, report, 'Standard report envelope assembled successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to assemble report envelope', 500);
    }
  }

  async getAIReportContext(req: Request, res: Response) {
    try {
      const calculationId = req.params.calculationId;
      const envelope = await CalculationResultRepositoryService.getByCalculationId(calculationId);

      if (!envelope) {
        return sendError(res, 'Calculation result envelope not found', 404);
      }

      const report = ReportAssemblyService.assembleReport({ envelope });
      const aiContext = AIReportContextService.buildReportAIContext(report);

      return sendSuccess(res, aiContext, 'Report AI context packaged successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to package AI report context', 500);
    }
  }
}
