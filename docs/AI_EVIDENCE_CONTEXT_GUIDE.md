# AI Evidence Context Guide (Phase 4)

## AI Safety Restrictions (8 Non-Negotiables)

Whenever the AI Assistant explains evidence, the context package includes `restrictions`:

1. `mustNotRecalculate`: true
2. `mustNotChangeDecision`: true
3. `mustNotInventEvidence`: true
4. `mustNotInventTranslation`: true
5. `mustNotInventHadithNumber`: true
6. `mustNotSwitchMadhhab`: true
7. `mustUseProvidedContext`: true
8. `mustDiscloseInsufficientEvidence`: true

The AI Assistant receives permanent IDs and immutable calculation profiles to prevent hallucinated rulings or silent madhhab switching.
