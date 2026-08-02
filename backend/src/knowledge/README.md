# MIZAN Digital Islamic Financial Knowledge Repository

> Canonical repository architecture for MIZAN's structured, scholar-approved, version-controlled, and auditable Islamic financial knowledge.

## Overview

The MIZAN Knowledge Repository provides a machine-readable, deterministic foundation for Islamic Inheritance (Mirath), Zakat, and financial jurisprudence.

It strictly separates:
1. **Original Sources** (`knowledge/sources/`)
2. **Structured Rules** (`knowledge/rules/`)
3. **Evidence Records** (`knowledge/evidence/`)
4. **Explanations** (`knowledge/explanations/`)
5. **Entity Definitions** (`knowledge/entities/`)
6. **Report Schemas** (`knowledge/reports/`)
7. **Governance & Audit Trails** (`knowledge/governance/`)
8. **Indexing Pipelines** (`knowledge/indexing/`)
9. **Validation Engines** (`knowledge/validation/`)

## Architecture Principles

- **No Invented Rules**: All rulings require academic and scholar sign-off.
- **Deterministic Rule Engine Isolation**: RAG passages never perform financial calculations directly.
- **Finite-State Lifecycle**: `DRAFT` → `ACADEMIC_REVIEW` → `SHARIA_REVIEW` → `TECHNICAL_VALIDATION` → `APPROVED` → `INDEXED` → `PRODUCTION`.
- **SHA-256 Checksum Protection**: Detects unauthorized modifications or data drift.
- **Role-Based Access Control**: Strict separation of duties between creators, reviewers, scholars, and publication admins.
