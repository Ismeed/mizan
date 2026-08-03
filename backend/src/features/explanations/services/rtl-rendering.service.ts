/**
 * RTL Rendering Service
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

import { LanguageRegistryService } from './language-registry.service';

export class RTLRenderingService {
  public static isRTL(languageTag: string): boolean {
    return LanguageRegistryService.getDirection(languageTag) === 'RTL';
  }

  public static wrapBidi(text: string, direction: 'LTR' | 'RTL'): string {
    if (direction === 'RTL') {
      return `\u200F${text}\u200E`; // RLM and LRM bidi controls
    }
    return text;
  }
}
