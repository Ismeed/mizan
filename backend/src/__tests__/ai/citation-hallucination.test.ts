import { CitationEngine } from '../../features/ai/citation/citation.engine';

describe('Enterprise AI Test Suite - Citation Validation & Hallucination Detection', () => {
  test('Verifies stored Quranic & Hadith metadata in structured citations', () => {
    const mockRAGDocs = [
      { source: 'Quran', reference: 'Surah An-Nisa (4:11)', arabicText: 'يُوصِيكُمُ اللَّهُ', relevanceScore: 0.98 },
      { source: 'Sahih al-Bukhari', reference: 'Hadith 1454', relevanceScore: 0.95 },
    ];

    const citations = CitationEngine.generateStructuredCitations('Sample AI Response', mockRAGDocs, 'HANAFI');

    expect(citations.sources.length).toBe(2);
    expect(citations.sources[0].reference).toBe('Surah An-Nisa (4:11)');
    expect(citations.sources[0].arabicText).toBe('يُوصِيكُمُ اللَّهُ');
    expect(citations.sources[1].reference).toBe('Hadith 1454');
    expect(citations.confidence).toBe('HIGH');
  });

  test('Correctly attributes 5 Madhhab positions without conflation', () => {
    const citations = CitationEngine.generateStructuredCitations('Test Response', [], 'MALIKI');
    const positions = citations.madhhabPositions;

    expect(positions.hanafi?.toLowerCase()).toContain('silver nisab');
    expect(positions.maliki?.toLowerCase()).toContain('customary daily gold ornaments');
    expect(positions.shafii?.toLowerCase()).toContain('bayt al-mal');
    expect(positions.hanbali?.toLowerCase()).toContain('paternal grandfather blocks brothers');
    expect(positions.jafari).toContain('Wives inherit value of building');
  });

  test('Assigns appropriate confidence ratings to retrieved passages', () => {
    const highDoc = [{ source: 'Quran', reference: 'Surah At-Tawbah (9:60)', relevanceScore: 0.99 }];
    const highCitation = CitationEngine.generateStructuredCitations('Answer', highDoc);
    expect(highCitation.sources[0].confidence).toBe('HIGH');

    const medDoc = [{ source: 'General', reference: 'Ref 101', relevanceScore: 0.70 }];
    const medCitation = CitationEngine.generateStructuredCitations('Answer', medDoc);
    expect(medCitation.sources[0].confidence).toBe('MEDIUM');
  });
});
