import { IslamicRAGEngine } from '../../features/ai/rag/islamic-rag.engine';

describe('Enterprise AI Test Suite - Islamic RAG Engine', () => {
  test('Retrieves relevant Quranic passages with Arabic text and translation', () => {
    const results = IslamicRAGEngine.retrieve('What is the Quranic share for mother in inheritance?', 3);
    expect(results.length).toBeGreaterThan(0);
    const quranDoc = results.find(d => d.source === 'QURAN');
    expect(quranDoc).toBeDefined();
    expect(quranDoc?.reference).toContain('Surah An-Nisa');
    expect(quranDoc?.arabicText).toBeDefined();
    expect(quranDoc?.translationText).toContain('mother');
    expect(quranDoc?.relevanceScore).toBeGreaterThanOrEqual(0.8);
  });

  test('Retrieves authentic Hadith references for Zakat and Wasiyyah', () => {
    const zakatResults = IslamicRAGEngine.retrieve('Hadith on Zakat Hawl and Nisab rate', 3);
    const zakatHadith = zakatResults.find(d => d.source === 'HADITH');
    expect(zakatHadith).toBeDefined();
    expect(zakatHadith?.reference).toMatch(/(Bukhari|Muslim|Nasa'i|Dawud)/);

    const wasiyyahResults = IslamicRAGEngine.retrieve('Hadith on maximum Wasiyyah limit one third', 3);
    const wasiyyahHadith = wasiyyahResults.find(d => d.source === 'HADITH');
    expect(wasiyyahHadith?.translationText).toContain('one-third');
  });

  test('Retrieves Madhhab-specific positions (Hanafi, Maliki, Shafi\'i, Hanbali, Ja\'fari)', () => {
    const madhhabs = ['HANAFI', 'MALIKI', 'SHAFII', 'HANBALI', 'JAFARI'];
    madhhabs.forEach(m => {
      const results = IslamicRAGEngine.retrieve(`Rules according to ${m} school of Fiqh`, 6);
      const matched = results.find(d => d.source === m);
      expect(matched).toBeDefined();
      expect(matched?.reference).toBeDefined();
    });
  });

  test('Calculates accurate relevance and confidence scores', () => {
    const results = IslamicRAGEngine.retrieve('Riba interest prohibition in Quran', 2);
    expect(results[0].relevanceScore).toBeGreaterThanOrEqual(0.85);
    expect(results[0].category).toBe('RIBA');
  });
});
