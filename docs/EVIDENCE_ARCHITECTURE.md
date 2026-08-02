# MIZAN Evidence Architecture (Phase 4)

## Overview

The MIZAN Evidence Infrastructure establishes a canonical, permanent, scholar-reviewed, and version-controlled evidence repository for Islamic financial learning and decision support.

## Key Principles

1. **Permanent Identifiers**: Immutable ID patterns (`QURAN-004-011-011`, `HADITH-BUKHARI-001454`, `FIQH-MALIKI-MUDAWWANAH-0001`, `SCHOLARLY-AAOIFI-0001`).
2. **Strict Governance Lifecycle**: `DRAFT` → `ACADEMIC_REVIEW` → `SHARIA_REVIEW` → `TECHNICAL_VALIDATION` → `APPROVED` → `INDEXED` → `PRODUCTION`.
3. **Madhhab Scoping**: Explicit Madhhab compatibility (`SHARED`, `SINGLE_MADHHAB`, `SELECTIVE`, `COMPARATIVE`).
4. **Exact Attribution & Licensing**: Prohibits public deployment of evidence with `UNKNOWN` licence status or missing attribution.
5. **AI Safety Restrictions**: Mandates 8 explicit non-negotiable `mustNot*` restrictions whenever evidence is passed to AI Assistant.

## Evidence Types

- `QURAN`: Verses & ranges with Uthmani, Plain Arabic, and governed translations.
- `HADITH`: Prophetic traditions with canonical/edition-specific numbering and scholar gradings.
- `FIQH_REFERENCE`: Recognized classical jurisprudence works.
- `SCHOLARLY_REFERENCE`: Contemporary academic & institutional financial fiqh.
- `LEGAL_MAXIM`: Jurisprudential maxims (*Al-Qawaid al-Fiqhiyyah*).
- `INSTITUTIONAL_SHARIA_DECISION`: Formal Sharia board rulings (AAOIFI, OIC Fiqh Academy).
- `APPROVED_EXPLANATORY_NOTE`: Editorial educational notes approved by MIZAN Sharia board.
