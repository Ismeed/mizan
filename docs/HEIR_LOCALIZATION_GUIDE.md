# MIZAN — Heir Localization Guide

## Overview

Localization records store user-facing singular, plural, report labels, and descriptions for canonical heir IDs across supported languages (`en`, `ar`, `ha`, `fr`, `sw`).

---

## Separation of Concerns

- **Rule Engine**: Operates exclusively on permanent Canonical Heir IDs (`FULL_BROTHER`).
- **UI & Reports**: Display localized labels resolved via `HeirLocalizationService`.
- **Language Changes**: Updating language updates UI text only. Facts and calculation results remain unchanged.
