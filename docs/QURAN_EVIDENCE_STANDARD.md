# Qur'an Evidence Standard (Phase 4)

## Structural Specification

Qur'an evidence records are identified by permanent IDs in the format `QURAN-<SURAH>-<AYAH_START>-<AYAH_END>` (e.g. `QURAN-004-011-011`).

## Required Fields

- `surahNumber`: Integer between 1 and 114.
- `surahNames`: Multilingual map (`en`, `ha`, `ar`).
- `ayahStart` & `ayahEnd`: Positive integers where `ayahEnd >= ayahStart`.
- `content.arabicText`: Verified Uthmani script.
- `content.plainArabicText`: Plain script for search & alignment.
- `content.verseSequenceVerified`: Boolean flag confirming verse order integrity.

## Governance Rules

1. Qur'anic text must match approved sources (e.g. King Fahd Complex).
2. Original Arabic text must never be overwritten or modified.
3. AI models are strictly prohibited from generating or modifying Qur'anic text.
