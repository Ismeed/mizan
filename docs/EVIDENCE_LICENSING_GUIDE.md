# Evidence Licensing Guide (Phase 4)

## Licence Status Standards

Supported values: `PUBLIC_DOMAIN`, `LICENSED`, `PERMISSION_GRANTED`, `ATTRIBUTION_REQUIRED`, `INTERNAL_USE_ONLY`, `RESTRICTED`, `UNKNOWN`.

## Enforcement Rules

- Evidence records with `UNKNOWN` licence status are strictly blocked from `PRODUCTION` status.
- RAG indexing is blocked if `licenceStatus` is `UNKNOWN` or `RESTRICTED`.
- Public presentation must automatically append `attributionText` when `attributionRequired: true`.
