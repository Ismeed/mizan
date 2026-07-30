import { DualRAGRetriever } from '../../features/ai/rag/dual-rag.retriever';
import { PromptBuilder } from '../../features/ai/prompt/prompt.builder';

describe('Enterprise AI Test Suite - Performance Benchmarks', () => {
  test('Retrieval Latency Benchmark: Dual-RAG completes under 50ms', () => {
    const start = performance.now();

    for (let i = 0; i < 20; i++) {
      DualRAGRetriever.retrieve('Where do I calculate zakat for gold and silver?');
    }

    const elapsed = (performance.now() - start) / 20;
    expect(elapsed).toBeLessThan(50); // Average under 50ms per retrieval
  });

  test('Prompt Generation Latency Benchmark: PromptBuilder completes under 10ms', () => {
    const ragResult = DualRAGRetriever.retrieve('What is mother share?');
    const start = performance.now();

    for (let i = 0; i < 20; i++) {
      PromptBuilder.buildPrompt(
        'What is mother share?',
        ragResult,
        { type: 'NONE' },
        { madhhab: 'HANAFI', currency: 'NGN', language: 'English' }
      );
    }

    const elapsed = (performance.now() - start) / 20;
    expect(elapsed).toBeLessThan(10); // Average under 10ms per prompt build
  });
});
