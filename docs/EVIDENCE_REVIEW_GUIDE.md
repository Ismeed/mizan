# Evidence Review & Governance Guide (Phase 4)

## Multi-Gate Review Workflow

The MIZAN Evidence Lifecycle defines four mandatory review gates before production deployment:

1. **Draft Stage (`DRAFT`)**:
   - Initial entry or import of evidence records.
   - Requires complete source metadata, provenance details, and initial checksum calculation.

2. **Academic Review (`ACADEMIC_REVIEW`)**:
   - Verifies transcription correctness, book title, author, edition, page numbers, and translation attribution.

3. **Sharia Review (`SHARIA_REVIEW`)**:
   - Verifies interpretive relevance, Madhhab compatibility, rule relationship appropriateness, Hadith grading attribution, and explanation boundaries.

4. **Technical Validation (`TECHNICAL_VALIDATION`)**:
   - Validates JSON Schema compliance, permanent ID format, content/source checksums, licence status, and AI safety context suitability.

5. **Approval & Production (`APPROVED` / `PRODUCTION`)**:
   - Seal the record version as immutable. New edits create a new semantic version.
