/**
 * Explanations Controller
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { Request, Response } from 'express';
import { ExplanationRegistryService } from './services/explanation-registry.service';
import { ExplanationResolverService } from './services/explanation-resolver.service';
import { LanguageRegistryService } from './services/language-registry.service';
import { TerminologyRegistryService } from './services/terminology-registry.service';
import { AIExplanationContextService } from './services/ai-explanation-context.service';
import { TranslationCoverageService } from './services/translation-coverage.service';
import { ExplanationSnapshotService } from './services/explanation-snapshot.service';
import { sendSuccess, sendError } from '../../shared/utils/response.utils';

export class ExplanationsController {
  public static async getLanguages(req: Request, res: Response): Promise<void> {
    try {
      const languages = [
        LanguageRegistryService.getLanguage('en'),
        LanguageRegistryService.getLanguage('ar'),
        LanguageRegistryService.getLanguage('ha'),
      ].filter(Boolean);
      return sendSuccess(res, languages, 'Languages fetched successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  public static async getLocales(req: Request, res: Response): Promise<void> {
    try {
      const locales = [
        LanguageRegistryService.getLocale('en-NG'),
        LanguageRegistryService.getLocale('en-GB'),
        LanguageRegistryService.getLocale('en-US'),
        LanguageRegistryService.getLocale('ar-SA'),
        LanguageRegistryService.getLocale('ha-NG'),
      ].filter(Boolean);
      return sendSuccess(res, locales, 'Locales fetched successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  public static async getTerminology(req: Request, res: Response): Promise<void> {
    try {
      const { termId } = req.params;
      const term = TerminologyRegistryService.getTerm(termId);
      if (!term) {
        return sendError(res, 'Term not found', 404);
      }
      return sendSuccess(res, term, 'Terminology record fetched successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  public static async getExplanationById(req: Request, res: Response): Promise<void> {
    try {
      const { explanationId } = req.params;
      const version = (req.query.version as string) || '1.0.0';
      const record = ExplanationRegistryService.getExplanation(explanationId, version);
      if (!record) {
        return sendError(res, 'Explanation record not found', 404);
      }
      return sendSuccess(res, record, 'Explanation record fetched successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  public static async renderExplanation(req: Request, res: Response): Promise<void> {
    try {
      const { explanationId, version, languageTag, locale, selectedMadhhab, structuredResult } = req.body;
      if (!explanationId || !structuredResult) {
        return sendError(res, 'explanationId and structuredResult are required', 400);
      }

      const rendered = ExplanationResolverService.resolveExplanation({
        explanationId,
        explanationVersion: version || '1.0.0',
        requestedLanguageTag: languageTag || 'en',
        requestedLocale: locale || 'en-NG',
        selectedMadhhab: selectedMadhhab || 'HANAFI',
        structuredResult,
      });

      return sendSuccess(res, rendered, 'Explanation rendered successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  public static async getAIExplanationContext(req: Request, res: Response): Promise<void> {
    try {
      const { calculationId, explanationId, structuredResult, selectedMadhhab, languageTag } = req.body;
      if (!calculationId || !explanationId || !structuredResult) {
        return sendError(res, 'calculationId, explanationId, and structuredResult are required', 400);
      }

      const rendered = ExplanationResolverService.resolveExplanation({
        explanationId,
        requestedLanguageTag: languageTag || 'en',
        selectedMadhhab: selectedMadhhab || 'HANAFI',
        structuredResult,
      });

      const aiPackage = AIExplanationContextService.buildAIContextPackage(
        calculationId,
        rendered,
        structuredResult
      );

      return sendSuccess(res, aiPackage, 'AI explanation context package built successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }

  public static async getCoverageReport(req: Request, res: Response): Promise<void> {
    try {
      const languageTag = (req.query.languageTag as string) || 'ha';
      const coverage = TranslationCoverageService.computeCoverage(
        languageTag,
        ['MIRATH-EXPLANATION-SPOUSE-SHARE-001', 'ZAKAT-EXPLANATION-NISAB-RESULT-001'],
        [],
        ['MIRATH-EXPLANATION-SPOUSE-SHARE-001']
      );
      return sendSuccess(res, coverage, 'Coverage report generated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  }
}
