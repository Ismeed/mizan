import { DualRAGRetriever } from '../features/ai/rag/dual-rag.retriever';

describe('Live AI Accuracy Audit - Application RAG', () => {
  const queries = [
    { q: "Where do I calculate inheritance?", expectedRoute: "inheritance" },
    { q: "How do I calculate Zakat on cash and gold?", expectedRoute: "zakat" },
    { q: "How do I change my default Madhhab?", expectedRoute: "estate" },
    { q: "Where can I download my PDF report?", expectedRoute: "reports" },
    { q: "What is MIZAN Premium and how do I upgrade?", expectedRoute: "premium" },
    { q: "How do I scan a quantum matrix bar code?", expectedFallback: true }
  ];

  queries.forEach((item, index) => {
    test(`Query #${index + 1}: "${item.q}"`, () => {
      const res = DualRAGRetriever.retrieve(item.q);
      console.log(`\n[Test Query]: "${item.q}"`);
      console.log(` -> Context Type: ${res.primaryContextType}`);
      console.log(` -> Overall Confidence: ${res.overallConfidence}`);
      if (res.suggestedRoute) {
        console.log(` -> Suggested Screen: ${res.suggestedRoute.screenName}`);
        console.log(` -> Route: ${res.suggestedRoute.route}`);
        console.log(` -> Deep Link: ${res.suggestedRoute.deepLink}`);
      }
      if (res.fallbackNotice) {
        console.log(` -> Anti-Hallucination Notice: "${res.fallbackNotice}"`);
      }

      if (item.expectedRoute) {
        expect(res.suggestedRoute?.route).toContain(item.expectedRoute);
      }
      if (item.expectedFallback) {
        expect(res.fallbackNotice).toBeDefined();
      }
    });
  });
});
