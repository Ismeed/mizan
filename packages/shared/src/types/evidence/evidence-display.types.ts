/**
 * Unified Evidence Display Contract across UI cards, PDFs, and AI context (Phase 4)
 */

import { EvidenceCitationDisplay } from './evidence-citation.types';

export interface EvidenceDisplayObject extends EvidenceCitationDisplay {
  moduleScope: string[];
  licenceStatus: string;
  isTestFixture?: boolean;
}
