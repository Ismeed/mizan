# MIZAN — Hijab Resolution Guide

## Resolution Pipeline

The `HijabResolverService` executes a deterministic 6-step pipeline for every calculation:

```
Step 1: Load PRODUCTION HijabRule records for selected madhhab
        (HijabRuleRegistryService.loadRulesForMadhhab)

Step 2: Determine structural applicability for each rule
        (HijabApplicabilityService.determineApplicableRules)

Step 3: Build resolution trace — all evaluated rules recorded
        (includes wasApplied: true/false for every rule)

Step 4: Apply applicable rules to produce per-heir HijabStatus
        • HIRMAN rules applied first — complete exclusion
        • NUQSAN rules applied second — partial reduction
        • HIRMAN always takes precedence over NUQSAN for same heir

Step 5: Determine output status:
        • RESOLVED — applicable rules found and applied
        • NO_BLOCKING_RULES_APPLICABLE — no rules matched
        • PARTIAL_RESOLUTION — only NUQSAN reductions, no HIRMAN

Step 6: Write immutable HijabResolutionAudit record
        (HijabAuditService.writeAudit)
```

---

## Resolution Output

```typescript
interface HijabResolutionOutput {
  status: 'RESOLVED' | 'NO_BLOCKING_RULES_APPLICABLE' | 'PARTIAL_RESOLUTION';
  heirStatuses: HeirHijabStatus[];      // Per-heir blocking decisions
  resolutionTrace: HijabResolutionTrace[]; // Full audit trace
  madhhab: MadhhabCode;
  resolvedAt: string;                   // ISO timestamp
  warnings?: string[];
}
```

---

## Per-Heir Status

```typescript
interface HeirHijabStatus {
  heirKey: string;
  isEligible: boolean;           // false if HIRMAN applied
  isCompletelyExcluded: boolean; // true if HIRMAN applied
  isReduced: boolean;            // true if NUQSAN applied
  blockedBy?: string;            // The blocking heir or 'ATTRIBUTE'
  reducedFraction?: { numerator, denominator }; // Only for NUQSAN
  appliedHijabRuleId?: string;   // The canonical rule ID applied
  madhhab: MadhhabCode;
  effectType?: 'HIRMAN' | 'NUQSAN';
  evidenceRefs?: HijabEvidenceRef[];
}
```

---

## Applicability Rules

### HAJB_BIL_SHAKHSY (Person-based)
A rule is applicable when:
1. The blocked heir (`blockedHeirKey`) is present with count > 0
2. The blocking heir (`blockingCause`) is present with count > 0

### HAJB_BIL_WASF (Attribute-based)
A rule is applicable when:
1. The blocked heir is present with count > 0
2. The heir has the relevant attribute in `heirAttributes`

---

## Integration Example

```typescript
const output = await HijabResolverService.resolve({
  madhhab: 'HANAFI',
  presentHeirs: {
    husband: 1,
    sons: 2,
    fullBrothers: 1,
    mother: 1,
  },
  calculationId: 'calc-abc-123',
  profileId: 'profile-xyz-456',
});

// Check blocking for fullBrothers
const brotherStatus = output.heirStatuses.find(s => s.heirKey === 'fullBrothers');
if (brotherStatus?.isCompletelyExcluded) {
  // fullBrothers receives nothing — HIRMAN applied
}
```

---

## API Endpoint

```
POST /api/hijab/resolve
Authorization: Bearer <token>

Body:
{
  "madhhab": "HANAFI",
  "presentHeirs": { "sons": 2, "fullBrothers": 1, "mother": 1 },
  "calculationId": "optional-for-audit",
  "profileId": "optional-for-correlation"
}
```
