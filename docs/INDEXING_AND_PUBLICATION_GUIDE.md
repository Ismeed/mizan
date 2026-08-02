# MIZAN Indexing & Production Publication Guide

## 10-Point Publication Gate

Before any knowledge item is released to Production, the automated publication pipeline enforces 10 mandatory checks:

1. **Status Gate**: Must be `APPROVED` or `INDEXED`.
2. **Checksum Gate**: Current SHA-256 payload checksum must match stored approval checksum.
3. **Provenance Gate**: Complete Quran/Hadith/Fiqh source attribution must be present and valid.
4. **Evidence Link Gate**: All referenced evidence IDs must resolve to existing records.
5. **Schema Gate**: Payload must validate against the official JSON schema.
6. **Madhhab Scope Gate**: Must explicitly declare applicable Madhhab(s).
7. **Language Scope Gate**: Must declare supported languages.
8. **No Pending Changes Gate**: No unresolved change requests or rejections.
9. **Rule Compatibility Gate**: Deterministic rule logic must pass unit tests.
10. **Production Boundary Gate**: Production records cannot depend on `DRAFT` or unapproved records.

## CLI Publication Workflow

```bash
# Run integrity checks
npm run knowledge:validate

# Verify checksums
npm run knowledge:check-checksums

# Index approved records
npm run knowledge:index-approved

# Publish to production
npm run knowledge:publish
```
