/**
 * Explanation Resolver Service (Main Orchestrator)
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import crypto from 'crypto';
import {
  RenderedExplanation,
  ExplanationRecord,
  ExplanationTranslationRecord,
  RenderedVariableValue,
  ExplanationResolutionTrace,
  ExplanationResolutionStep,
} from '@mizan/shared';

import { ExplanationRegistryService } from './explanation-registry.service';
import { LanguageRegistryService } from './language-registry.service';
import { TranslationFallbackService } from './translation-fallback.service';
import { ExplanationVariableService } from './explanation-variable.service';
import { ExplanationTemplateService } from './explanation-template.service';

export interface ResolveExplanationInput {
  explanationId: string;
  explanationVersion?: string;
  requestedLanguageTag?: string;
  requestedLocale?: string;
  selectedMadhhab?: string;
  structuredResult: Record<string, any>;
  ruleId?: string;
  ruleVersion?: string;
  knowledgeReleaseVersion?: string;
}

export class ExplanationResolverService {
  private static mockTranslationsStore: Map<string, ExplanationTranslationRecord> = new Map();

  public static registerTranslation(translation: ExplanationTranslationRecord): void {
    const key = `${translation.explanationId}:${translation.explanationVersion}:${translation.languageTag}`;
    this.mockTranslationsStore.set(key, translation);
  }

  public static resolveExplanation(input: ResolveExplanationInput): RenderedExplanation {
    const traceSteps: ExplanationResolutionStep[] = [];
    const traceId = `TRACE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const {
      explanationId,
      explanationVersion = '1.0.0',
      requestedLanguageTag = 'en',
      requestedLocale = 'en-NG',
      selectedMadhhab = 'HANAFI',
      structuredResult,
      ruleId = 'PERMANENT-RULE-001',
      ruleVersion = '1.0.0',
      knowledgeReleaseVersion = '1.0.0',
    } = input;

    // Step 1: Load explanation record
    traceSteps.push({ sequence: 1, action: 'LOAD_EXPLANATION', explanationId, version: explanationVersion });
    const record = ExplanationRegistryService.getExplanation(explanationId, explanationVersion);

    if (!record) {
      return this.buildUnavailableResult(explanationId, explanationVersion, requestedLanguageTag, requestedLocale, selectedMadhhab, 'EXPLANATION_NOT_FOUND');
    }

    // Step 2: Validate Madhhab scope
    traceSteps.push({ sequence: 2, action: 'VALIDATE_MADHHAB_SCOPE', selectedMadhhab, mode: record.madhhabScope.mode });
    if (record.madhhabScope.mode === 'SINGLE_MADHHAB' && !record.madhhabScope.appliesTo.includes(selectedMadhhab)) {
      return this.buildUnavailableResult(explanationId, explanationVersion, requestedLanguageTag, requestedLocale, selectedMadhhab, 'MADHHAB_SCOPE_MISMATCH');
    }

    // Step 3: Resolve Language & Fallback Policy
    const availableLangs = Array.from(this.mockTranslationsStore.keys())
      .filter((k) => k.startsWith(`${explanationId}:${explanationVersion}:`))
      .map((k) => k.split(':')[2]);

    if (record.content && record.content.translations) {
      for (const langKey of Object.keys(record.content.translations)) {
        if (!availableLangs.includes(langKey)) {
          availableLangs.push(langKey);
        }
      }
    }

    // Include default language from record
    if (!availableLangs.includes(record.content.defaultLanguageTag)) {
      availableLangs.push(record.content.defaultLanguageTag);
    }


    const fallbackRes = TranslationFallbackService.resolveLanguage(requestedLanguageTag, availableLangs);
    traceSteps.push({ sequence: 3, action: 'RESOLVE_LANGUAGE', requested: requestedLanguageTag, resolved: fallbackRes.resolvedLanguageTag, fallbackUsed: fallbackRes.fallbackUsed });

    // Step 4: Resolve Translation Content
    let translationRecord = this.mockTranslationsStore.get(`${explanationId}:${explanationVersion}:${fallbackRes.resolvedLanguageTag}`);

    // Default English fallback if record content has inline fallback text
    let rawTitle = translationRecord?.content.title || `Explanation: ${record.identity.topic}`;
    let rawShort = translationRecord?.content.short || record.content.translations[fallbackRes.resolvedLanguageTag] || record.content.translations['en'] || 'Explanation details.';
    let rawFull = translationRecord?.content.full || rawShort;
    let rawEdu = translationRecord?.content.educational || null;

    // Step 5: Resolve Variables
    traceSteps.push({ sequence: 4, action: 'RESOLVE_VARIABLES', variablesCount: record.variables.length });
    const renderedVars: RenderedVariableValue[] = [];
    for (const varId of record.variables) {
      const resolvedVar = ExplanationVariableService.resolveVariable(varId, structuredResult, fallbackRes.resolvedLanguageTag, requestedLocale);
      if (resolvedVar) {
        renderedVars.push(resolvedVar);
      }
    }

    // Inject SELECTED_MADHHAB variable if present in structuredResult or default
    if (!renderedVars.find((v) => v.variableId === 'SELECTED_MADHHAB')) {
      const resolvedMadhhabVar = ExplanationVariableService.resolveVariable('SELECTED_MADHHAB', { selectedMadhhab }, fallbackRes.resolvedLanguageTag, requestedLocale);
      if (resolvedMadhhabVar) renderedVars.push(resolvedMadhhabVar);
    }

    // Step 6: Render Templates Safely
    traceSteps.push({ sequence: 5, action: 'RENDER_TEMPLATES' });
    const title = ExplanationTemplateService.interpolateTemplate(rawTitle, renderedVars);
    const shortText = ExplanationTemplateService.interpolateTemplate(rawShort, renderedVars);
    const fullText = ExplanationTemplateService.interpolateTemplate(rawFull, renderedVars);
    const eduText = rawEdu ? ExplanationTemplateService.interpolateTemplate(rawEdu, renderedVars) : null;

    // Compute checksum
    const contentString = `${title}|${shortText}|${fullText}`;
    const renderedChecksum = crypto.createHash('sha256').update(contentString).digest('hex');

    const direction = LanguageRegistryService.getDirection(fallbackRes.resolvedLanguageTag);

    return {
      renderedExplanationId: `RENDER-${Date.now()}`,
      explanationId,
      explanationVersion,
      status: fallbackRes.fallbackUsed ? 'FALLBACK_USED' : 'RESOLVED',
      language: {
        requestedLanguageTag,
        resolvedLanguageTag: fallbackRes.resolvedLanguageTag,
        locale: requestedLocale,
        direction,
        fallbackUsed: fallbackRes.fallbackUsed,
        fallbackReason: fallbackRes.fallbackReason,
      },
      madhhab: {
        madhhabId: selectedMadhhab,
        scopeValidated: true,
      },
      content: {
        title,
        short: shortText,
        full: fullText,
        educational: eduText,
      },
      variables: renderedVars,
      evidence: record.references.evidenceIds.map((id) => ({
        evidenceId: id,
        evidenceVersion: '1.0.0',
        shortCitation: `Ref: ${id}`,
      })),
      source: {
        ruleId,
        ruleVersion,
        knowledgeReleaseVersion,
      },
      integrity: {
        renderedChecksum,
      },
    };
  }

  private static buildUnavailableResult(
    explanationId: string,
    version: string,
    requestedLanguageTag: string,
    locale: string,
    madhhabId: string,
    reason: string
  ): RenderedExplanation {
    return {
      renderedExplanationId: `RENDER-UNAVAIL-${Date.now()}`,
      explanationId,
      explanationVersion: version,
      status: 'UNAVAILABLE',
      language: {
        requestedLanguageTag,
        resolvedLanguageTag: requestedLanguageTag,
        locale,
        direction: 'LTR',
        fallbackUsed: false,
        fallbackReason: reason,
      },
      madhhab: {
        madhhabId,
        scopeValidated: false,
      },
      content: {
        title: 'Explanation Unavailable',
        short: 'The explanation for this decision is currently unavailable.',
        full: 'The explanation for this decision is currently unavailable.',
        educational: null,
      },
      variables: [],
      evidence: [],
      source: {
        ruleId: 'UNKNOWN',
        ruleVersion: '1.0.0',
        knowledgeReleaseVersion: '1.0.0',
      },
      integrity: {
        renderedChecksum: '0000000000000000000000000000000000000000000000000000000000000000',
      },
    };
  }

  public static clear(): void {
    this.mockTranslationsStore.clear();
  }
}
