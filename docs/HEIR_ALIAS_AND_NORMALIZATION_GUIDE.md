# MIZAN — Heir Alias & Normalization Guide

## Normalization Pipeline

1. User enters text / selects option / inputs legacy key
2. `HeirNormalizationService` looks up alias in registry
3. Exact approved aliases resolve directly to Canonical Heir IDs
4. Ambiguous terms (e.g. `"Grandfather"`) return `status: 'AMBIGUOUS'` and require explicit user confirmation
5. Unrecognized terms return `status: 'UNSUPPORTED'`
6. AI is NEVER permitted to authoritatively resolve ambiguous terms silently.
