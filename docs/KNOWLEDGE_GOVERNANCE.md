# MIZAN Knowledge Governance & Quality Assurance Framework

## 1. Governance Objectives
MIZAN enforces enterprise-grade governance over all Islamic financial content. Every knowledge item is machine-readable, scholar-reviewed, version-controlled, and cryptographically verified.

## 2. Governance Roles & Separation of Duties
- **RESEARCH_ASSISTANT**: Creates initial draft records and source metadata.
- **DATA_EDITOR**: Formats entity records and translations.
- **ACADEMIC_REVIEWER**: Verifies book titles, authors, page numbers, and transcriptions.
- **SHARIA_REVIEWER**: Qualified scholar verifying jurisprudential accuracy, Madhhab attributions, and evidence.
- **TECHNICAL_REVIEWER**: Verifies schema compliance, deterministic compatibility, and test coverage.
- **KNOWLEDGE_ADMIN**: Manages workflow assignments and deprecations.
- **INDEXING_SERVICE**: Prepares APPROVED records for vector indexing.
- **PUBLICATION_ADMIN**: Authorizes production releases after 10-point gate verification.
- **AUDITOR**: Inspects append-only audit logs (read-only).

## 3. Finite-State Governance Lifecycle
```
DRAFT ──► ACADEMIC_REVIEW ──► SHARIA_REVIEW ──► TECHNICAL_VALIDATION ──► APPROVED ──► INDEXED ──► PRODUCTION
  ▲              │                  │                      │
  └──────────────┴──────────────────┴──────────────────────┘ (via CHANGES_REQUESTED)
```

## 4. Immutable Audit Logs
All status changes generate append-only audit events storing actor ID, role, timestamp, old status, new status, version, and SHA-256 checksums.
