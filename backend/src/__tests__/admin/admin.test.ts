import { KnowledgeManagementService } from '../../features/admin/knowledge/knowledge.service';

describe('Admin System & Knowledge Management Test Suite', () => {

  test('1. Knowledge Base Document Listing & Structuring', async () => {
    const docs = await KnowledgeManagementService.getDocuments();
    expect(docs).toBeDefined();
    expect(docs.length).toBeGreaterThan(0);
    expect(docs[0].id).toBeDefined();
    expect(docs[0].title).toBeDefined();
    expect(docs[0].version).toBeDefined();
  });

  test('2. Knowledge Base Document Upload & Versioning', async () => {
    const newDocPayload = {
      sourceName: 'Fatawa Al-Lajnah Al-Da\'imah',
      category: 'FATWA' as const,
      title: 'Zakat on Commercial Real Estate Investments',
      content: 'Official Fatwa regarding calculation of Zakat on commercial property portfolios.',
      madhhab: 'ALL' as const,
      version: '1.0.0',
      isApproved: true,
    };

    const createdDoc = await KnowledgeManagementService.uploadDocument(newDocPayload);

    expect(createdDoc.id).toMatch(/^doc_/);
    expect(createdDoc.title).toBe(newDocPayload.title);
    expect(createdDoc.isApproved).toBe(true);

    const docs = await KnowledgeManagementService.getDocuments();
    const found = docs.find(d => d.id === createdDoc.id);
    expect(found).toBeDefined();
  });

  test('3. Document Approval Workflow', async () => {
    const doc = await KnowledgeManagementService.uploadDocument({
      sourceName: 'Al-Mughni',
      category: 'FIQH_BOOK',
      title: 'Hanbali Rules on Heir Exclusion',
      content: 'Exclusion rules according to Imam Ibn Qudamah.',
      madhhab: 'HANBALI',
      version: '1.1.0',
      isApproved: false,
    });

    const approvedSuccess = await KnowledgeManagementService.approveDocument(doc.id);
    expect(approvedSuccess).toBe(true);
  });

  test('4. RAG Retrieval Metrics & Health Monitoring', async () => {
    const metrics = await KnowledgeManagementService.getRetrievalMetrics();

    expect(metrics.totalQueriesProcessed).toBeGreaterThan(0);
    expect(metrics.islamicRAGHitRate).toBeDefined();
    expect(metrics.appRAGHitRate).toBeDefined();
    expect(metrics.hallucinationRate).toBeDefined();
    expect(metrics.vectorIndexStatus).toContain('HEALTHY');
  });

});
