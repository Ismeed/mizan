# MIZAN Verified AI Evidence Context Architecture (Phase 16)

## Fundamental Principle
**DO NOT SEND ONLY THE EVIDENCE ID TO GEMINI.**

Before invoking Gemini or any approved language model, the MIZAN server constructs a complete, verified, immutable, checksum-protected **Evidence Context Package**.

---

## High-Level Execution Pipeline

```
Structured Navigation Payload (Phase 15)
       ↓
Authentication & Authorization Gates
       ↓
VerifiedAIEvidenceContextService (20 Assembly Gates)
       ↓
AIEvidenceContextSnapshot (Immutable DB Record)
       ↓
AIEvidencePromptGuardService (Section Delimitation & Injection Filtering)
       ↓
AIEvidenceQuestionValidationService (User Intent Classification)
       ↓
GeminiEvidenceProviderAdapter (Structured Output Request)
       ↓
AIEvidenceResponse (Schema & Grounding Validation)
       ↓
AIEvidenceResponseSnapshot (Immutable DB Record)
       ↓
Clearly Labelled AI Clarification
```

---

## Key Security & Governance Rules
1. **Rule Engine Isolation**: The AI Assistant never calculates Mirath fractions, Zakat dues, Nisab thresholds, or livestock schedules.
2. **Context Integrity**: Server-side hydration resolves authoritative text, translations, and rule relationships using permanent IDs. Client-submitted display text is ignored.
3. **Prompt Injection Defense**: System instructions, task templates, verified context data, and user questions are strictly delimited into distinct sections.
4. **Exact Value Validation**: All numbers, fractions, rates, and madhhab claims in the response are compared against the authoritative Decision Context. Responses with conflicting values are blocked.
