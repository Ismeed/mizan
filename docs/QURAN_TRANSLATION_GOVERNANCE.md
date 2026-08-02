# Qur'an Translation Governance (Phase 4)

## Translation Metadata

Every approved Qur'an translation is stored as an independent content object containing:

- `languageTag` (e.g. `en`, `ha`, `ar`)
- `locale` (e.g. `en-US`, `ha-NG`)
- `text`: Approved translation wording
- `translationSourceId`: Permanent source ID (e.g. `SAHIH_INTERNATIONAL`)
- `translator`: Name of translator or translation board
- `licenceStatus`: Licence classification (`PUBLIC_DOMAIN`, `PERMITTED`, etc.)
- `attributionText`: Required public attribution string
- `checksum`: SHA-256 hash of `languageTag:text`

## Fallback & AI Policy

- Unreviewed or AI-generated translations are never marked as `APPROVED`.
- Language fallbacks follow governed rules (`ha` → `en`).
- Generated reports and PDF documents record the exact translation source ID and version used.
