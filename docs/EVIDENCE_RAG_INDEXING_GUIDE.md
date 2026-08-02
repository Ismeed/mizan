# Evidence RAG Indexing Guide (Phase 4)

## RAG Indexing Safeguards

Only evidence records meeting the following criteria are eligible for vector store indexing:

- `governance.status === "PRODUCTION"` or `"INDEXED"`
- `licensing.licenceStatus !== "UNKNOWN"` and `!== "RESTRICTED"`
- `isTestFixture !== true`
- Validated by `EvidenceValidatorService` with zero errors

Unverified OCR, draft evidence, private review notes, and superseded translations are strictly excluded from indexing.
