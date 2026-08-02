# Fiqh Reference Standard (Phase 4)

## Specification

Classical fiqh reference evidence records are identified by `FIQH-<MADHHAB>-<SOURCE_CODE>-<SEQUENCE>` (e.g. `FIQH-MALIKI-MUDAWWANAH-0001`).

## Scoping & Provenance

- Must record exact book, author, editor, volume, chapter, pageStart, and pageEnd.
- `madhhabScope` is explicitly defined (`mode: "SINGLE_MADHHAB"`, `appliesTo: ["MALIKI"]`).
- Classical references from one madhhab cannot govern another madhhab without an approved comparative relationship.
