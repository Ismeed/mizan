import { IslamicRAGEngine, RAGDocument } from './islamic-rag.engine';
import { ApplicationRAGEngine, AppDoc, RouteSuggestion } from './application-rag.engine';

export interface DualRAGResult {
  islamicDocs: RAGDocument[];
  appDocs: AppDoc[];
  primaryContextType: 'ISLAMIC_FIQH' | 'APP_NAVIGATION' | 'HYBRID';
  overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedRoute: RouteSuggestion | null;
  fallbackNotice?: string;
}

export class DualRAGRetriever {
  /**
   * Performs dual retrieval across Islamic Fiqh Knowledge Base & App Knowledge Base.
   * Classifies query intent, ranks passages, and suggests UI navigation routes.
   */
  static retrieve(query: string): DualRAGResult {
    const islamicDocs = IslamicRAGEngine.retrieve(query, 4);
    const appResult = ApplicationRAGEngine.retrieve(query, 3);
    const appDocs = appResult.docs;

    const q = query.toLowerCase();

    // Intent Classification Signals
    const isAppQuery = (
      q.includes('where') || q.includes('how to') || q.includes('how do i') ||
      q.includes('find') || q.includes('navigate') || q.includes('profile') ||
      q.includes('setting') || q.includes('history') || q.includes('currency') ||
      q.includes('download') || q.includes('pdf') || q.includes('button') ||
      q.includes('screen') || q.includes('premium') || q.includes('subscribe') ||
      q.includes('forgot') || q.includes('change') || q.includes('export')
    );

    const isIslamicQuery = (
      q.includes('quran') || q.includes('surah') || q.includes('hadith') ||
      q.includes('bukhari') || q.includes('muslim') || q.includes('hanafi') ||
      q.includes('maliki') || q.includes('shafi') || q.includes('hanbali') ||
      q.includes('jafari') || q.includes('fiqh') || q.includes('fatwa') ||
      q.includes('dalil') || q.includes('evidence')
    );

    let primaryContextType: 'ISLAMIC_FIQH' | 'APP_NAVIGATION' | 'HYBRID' = 'HYBRID';
    if (isAppQuery && !isIslamicQuery) {
      primaryContextType = 'APP_NAVIGATION';
    } else if (isIslamicQuery && !isAppQuery) {
      primaryContextType = 'ISLAMIC_FIQH';
    }

    // Overall Confidence Scoring
    const topIslamicScore = islamicDocs[0]?.relevanceScore || 0;
    const topAppScore = appDocs[0]?.relevanceScore || 0;
    const maxScore = Math.max(topIslamicScore, topAppScore);

    let overallConfidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (maxScore >= 0.7) overallConfidence = 'HIGH';
    else if (maxScore >= 0.4) overallConfidence = 'MEDIUM';

    let fallbackNotice: string | undefined;
    if (isAppQuery && appDocs.length === 0) {
      fallbackNotice = "I couldn't find this feature in the current version of MIZAN.";
    }

    return {
      islamicDocs,
      appDocs,
      primaryContextType,
      overallConfidence,
      suggestedRoute: appResult.suggestedRoute,
      fallbackNotice,
    };
  }
}
