import { ApplicationRAGEngine } from '../../features/ai/rag/application-rag.engine';
import { DualRAGRetriever } from '../../features/ai/rag/dual-rag.retriever';

describe('Enterprise AI Test Suite - Application RAG & App Navigation', () => {
  test('Correctly answers "Where do I calculate inheritance?" with route suggestion', () => {
    const result = DualRAGRetriever.retrieve('Where do I calculate inheritance?');
    expect(result.primaryContextType).toBe('APP_NAVIGATION');
    expect(result.appDocs.length).toBeGreaterThan(0);
    expect(result.suggestedRoute).toBeDefined();
    expect(result.suggestedRoute?.route).toContain('inheritance');
  });

  test('Correctly answers "How do I change my madhhab?"', () => {
    const result = DualRAGRetriever.retrieve('How do I change my madhhab?');
    expect(result.primaryContextType).toBe('APP_NAVIGATION');
    expect(result.appDocs.length).toBeGreaterThan(0);
    const hasProfileOrSettings = result.appDocs.some(d => d.screenPath.includes('profile') || d.screenPath.includes('setting'));
    expect(hasProfileOrSettings).toBe(true);
  });

  test('Correctly answers "Where can I download my PDF report?"', () => {
    const result = DualRAGRetriever.retrieve('Where can I download my PDF report?');
    expect(result.primaryContextType).toBe('APP_NAVIGATION');
    expect(result.appDocs.length).toBeGreaterThan(0);
  });

  test('Provides anti-hallucination fallback notice for unknown features', () => {
    const res = ApplicationRAGEngine.retrieve('How do I scan a quantum matrix bar code?', 1);
    expect(res.confidence).toBe('LOW');
  });

  test('Suggests correct screen paths for main app workflows', () => {
    const testCases = [
      { query: 'calculate zakat', expectedSubstring: 'zakat' },
      { query: 'upgrade to premium', expectedSubstring: 'premium' },
    ];

    testCases.forEach(tc => {
      const res = ApplicationRAGEngine.retrieve(tc.query, 1);
      expect(res.docs[0].screenPath).toContain(tc.expectedSubstring);
    });
  });
});
