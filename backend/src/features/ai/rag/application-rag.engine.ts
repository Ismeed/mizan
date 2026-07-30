import fs from 'fs';
import path from 'path';

export interface AppDoc {
  id: string;
  title: string;
  screenPath: string;
  deepLink: string;
  description: string;
  navigationSteps: string[];
  features: string[];
  category: string;
  relevanceScore: number;
  content: string;
  keywords: string[];
}

export interface RouteSuggestion {
  screenName: string;
  route: string;
  deepLink: string;
  navigationSteps: string[];
}

export interface AppRAGResult {
  docs: AppDoc[];
  suggestedRoute: RouteSuggestion | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  fallbackNotice?: string;
}

export class ApplicationRAGEngine {
  private static docsCache: AppDoc[] | null = null;
  private static docsDir = path.join(process.cwd(), 'src', 'knowledge', 'app_docs');

  /**
   * Initializes and loads all application documentation files and JSON databases.
   */
  private static loadDocs(): AppDoc[] {
    if (this.docsCache) return this.docsCache;

    const loadedDocs: AppDoc[] = [];

    try {
      // 1. Ingest JSON databases if available
      const metadataPath = path.join(this.docsDir, 'screen_metadata.json');
      if (fs.existsSync(metadataPath)) {
        const metadataJson = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        if (metadataJson.screens) {
          metadataJson.screens.forEach((s: any) => {
            loadedDocs.push({
              id: s.id,
              title: s.screen_name,
              screenPath: s.route,
              deepLink: s.deep_link || `mizan://${s.route.replace(/^\//, '')}`,
              description: s.purpose,
              navigationSteps: [s.purpose, `Access route: ${s.route}`],
              features: s.keywords || [],
              category: 'SCREEN_METADATA',
              relevanceScore: 0.0,
              content: `${s.screen_name} - ${s.purpose}. Route: ${s.route}. Keywords: ${s.keywords.join(', ')}`,
              keywords: s.keywords || []
            });
          });
        }
      }

      // 2. Ingest Markdown Documentation files
      if (fs.existsSync(this.docsDir)) {
        const files = fs.readdirSync(this.docsDir).filter(f => f.endsWith('.md'));
        files.forEach(file => {
          const content = fs.readFileSync(path.join(this.docsDir, file), 'utf8');
          const id = file.replace('.md', '');
          const titleLine = content.split('\n')[0]?.replace(/^#\s*/, '').trim() || id;

          const routeMatch = content.match(/route\s*`([^`]+)`/i);
          const route = routeMatch ? routeMatch[1] : `/${id}`;

          loadedDocs.push({
            id: `doc_${id}`,
            title: titleLine,
            screenPath: route,
            deepLink: `mizan://${id}`,
            description: content.substring(0, 300),
            navigationSteps: [`Navigate to ${titleLine} at ${route}`],
            features: [id, titleLine],
            category: 'APP_DOC',
            relevanceScore: 0.0,
            content,
            keywords: [id, titleLine.toLowerCase(), route.toLowerCase()]
          });
        });
      }
    } catch (err) {
      console.warn('[ApplicationRAGEngine] Failed to read app_docs directory, using fallback index:', err);
    }

    if (loadedDocs.length === 0) {
      loadedDocs.push(
        {
          id: 'app_home',
          title: 'Dashboard Home Screen',
          screenPath: '/(tabs)/index',
          deepLink: 'mizan://dashboard',
          description: 'The central dashboard displaying live Nisab rates, recent calculations summary, and quick action launch cards.',
          navigationSteps: ['Tap Home tab on bottom navigation bar or navigate to /'],
          features: ['Live Nisab Rates', 'Inheritance Launcher', 'Zakat Launcher'],
          category: 'CORE',
          relevanceScore: 0.0,
          content: 'Dashboard overview showing net wealth, Nisab rates, recent calculations',
          keywords: ['home', 'dashboard', 'overview', 'main']
        },
        {
          id: 'app_inheritance',
          title: 'Inheritance (Mirath) Calculator',
          screenPath: '/inheritance',
          deepLink: 'mizan://inheritance',
          description: 'A 4-step wizard for computing Quranic estate distributions according to Hanafi, Maliki, Shafi\'i, Hanbali, or Ja\'fari madhhabs.',
          navigationSteps: ['Tap Inheritance card on Dashboard or navigate to /inheritance'],
          features: ['Faraid Fractions', 'Awl Proportional Reduction', 'Radd Surplus Return', 'PDF Export'],
          category: 'CALCULATOR',
          relevanceScore: 0.0,
          content: 'Calculate Islamic inheritance Faraid shares according to 5 Madhhabs',
          keywords: ['inheritance', 'mirath', 'faraid', 'heirs', 'estate', 'will', 'wasiyyah']
        },
        {
          id: 'app_zakat',
          title: 'Zakat Calculator',
          screenPath: '/zakat',
          deepLink: 'mizan://zakat',
          description: 'A 3-step wizard for computing 2.5% Zakat across Cash, Gold, Silver, Stocks, Business Inventory, and Agriculture.',
          navigationSteps: ['Tap Zakat card on Dashboard or navigate to /zakat'],
          features: ['Nisab Threshold Comparison', 'Debt Deductions', 'PDF Report'],
          category: 'CALCULATOR',
          relevanceScore: 0.0,
          content: 'Calculate Zakat obligation against gold and silver Nisab thresholds',
          keywords: ['zakat', 'nisab', 'gold', 'silver', 'wealth', 'assets', 'hawl']
        }
      );
    }

    this.docsCache = loadedDocs;
    return loadedDocs;
  }

  /**
   * Retrieves relevant Application navigation documents for a user query.
   */
  static retrieve(query: string, limit = 3): AppRAGResult {
    const docs = this.loadDocs();
    const q = query.toLowerCase();

    const scored = docs.map(doc => {
      let score = 0;
      const contentLower = doc.content.toLowerCase();
      const titleLower = doc.title.toLowerCase();

      // Direct term matching
      if (titleLower.includes(q)) score += 0.6;
      if (doc.keywords.some(k => q.includes(k.toLowerCase()))) score += 0.4;
      if (contentLower.includes(q)) score += 0.2;

      // Explicit Intent pattern boosts
      if ((q.includes('inherit') || q.includes('faraid')) && doc.id.includes('inheritance')) score += 0.8;
      if ((q.includes('zakat') || q.includes('nisab') || q.includes('gold')) && doc.id.includes('zakat')) score += 0.8;
      if ((q.includes('madhhab') || q.includes('school') || q.includes('setting') || q.includes('currency')) && (doc.id.includes('settings') || doc.id.includes('profile'))) score += 1.5;
      if ((q.includes('pdf') || q.includes('report') || q.includes('download')) && (doc.id.includes('pdf') || doc.id.includes('report'))) score += 0.8;
      if ((q.includes('premium') || q.includes('upgrade') || q.includes('subscribe')) && (doc.id.includes('premium') || doc.id.includes('subscription'))) score += 0.8;

      return { ...doc, relevanceScore: Math.min(1.0, score) };
    });

    const sortedDocs = scored
      .filter(d => d.relevanceScore > 0.1)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);

    const topDoc = sortedDocs[0];
    const topScore = topDoc ? topDoc.relevanceScore : 0;

    let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
    if (topScore >= 0.7) confidence = 'HIGH';
    else if (topScore >= 0.4) confidence = 'MEDIUM';

    let suggestedRoute: RouteSuggestion | null = null;
    if (topDoc && topScore >= 0.4) {
      suggestedRoute = {
        screenName: topDoc.title,
        route: topDoc.screenPath,
        deepLink: topDoc.deepLink,
        navigationSteps: topDoc.navigationSteps
      };
    }

    let fallbackNotice: string | undefined;
    if (sortedDocs.length === 0 || topScore < 0.3) {
      fallbackNotice = "I couldn't find this feature in the current version of MIZAN.";
    }

    return {
      docs: sortedDocs,
      suggestedRoute,
      confidence,
      fallbackNotice
    };
  }
}
