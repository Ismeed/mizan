/**
 * MIZAN — Calculation Results Controller (Phase 13)
 * Implements REST endpoints for standard calculation result envelopes.
 */

import { Request, Response } from 'express';
import { CalculationResultRepository } from './services/calculation-result-repository.service';
import { ResultRenderingService } from './services/result-rendering.service';
import { ResultExportService } from './services/result-export.service';
import { AIResultContextService } from './services/ai-result-context.service';

export class ResultsController {
  static async getResult(req: Request, res: Response): Promise<void> {
    try {
      const { resultId } = req.params;
      const envelope = await CalculationResultRepository.getByResultId(resultId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND', message: `Calculation result ${resultId} not found` });
        return;
      }

      res.status(200).json(envelope);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }

  static async getResultByCalculationId(req: Request, res: Response): Promise<void> {
    try {
      const { calculationId } = req.params;
      const envelope = await CalculationResultRepository.getByCalculationId(calculationId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND', message: `Result for calculation ${calculationId} not found` });
        return;
      }

      res.status(200).json(envelope);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }

  static async getResultItems(req: Request, res: Response): Promise<void> {
    try {
      const { resultId } = req.params;
      const envelope = await CalculationResultRepository.getByResultId(resultId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND' });
        return;
      }

      res.status(200).json({ resultId: envelope.resultId, items: envelope.resultItems });
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }

  static async getResultItemById(req: Request, res: Response): Promise<void> {
    try {
      const { resultId, resultItemId } = req.params;
      const envelope = await CalculationResultRepository.getByResultId(resultId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND' });
        return;
      }

      const item = envelope.resultItems.find((i) => i.resultItemId === resultItemId);
      if (!item) {
        res.status(404).json({ error: 'RESULT_ITEM_NOT_FOUND' });
        return;
      }

      res.status(200).json(item);
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }

  static async renderResult(req: Request, res: Response): Promise<void> {
    try {
      const { resultId } = req.params;
      const { languageTag, locale, direction } = req.body;
      const envelope = await CalculationResultRepository.getByResultId(resultId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND' });
        return;
      }

      const rendered = ResultRenderingService.renderResult(
        envelope,
        languageTag || 'en',
        locale || 'en-US',
        direction || 'LTR'
      );

      res.status(200).json(rendered);
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }

  static async exportResult(req: Request, res: Response): Promise<void> {
    try {
      const { resultId } = req.params;
      const { format, languageTag } = req.query;
      const envelope = await CalculationResultRepository.getByResultId(resultId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND' });
        return;
      }

      if (format === 'json') {
        res.status(200).type('json').send(ResultExportService.exportToJson(envelope));
      } else {
        const reportData = ResultExportService.exportToReportData(envelope, (languageTag as string) || 'en');
        res.status(200).json(reportData);
      }
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }

  static async getAIContext(req: Request, res: Response): Promise<void> {
    try {
      const { resultId } = req.params;
      const { resultItemId } = req.query;
      const envelope = await CalculationResultRepository.getByResultId(resultId);

      if (!envelope) {
        res.status(404).json({ error: 'RESULT_NOT_FOUND' });
        return;
      }

      const aiContext = AIResultContextService.packageResultContext(
        envelope,
        resultItemId as string | undefined
      );

      res.status(200).json(aiContext);
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }
}
