# MIZAN Rule Versioning Guide

## Write-Once Immutability

Every rule version (`ruleId` + `ruleVersion`) is strictly **write-once**. Once a rule version enters `APPROVED` or `PRODUCTION` status, it can NEVER be edited in place. Any modification requires publishing a new semver version (e.g. `1.0.1` or `1.1.0`) with an explicit `supersedes` reference.

---

## Checksum Guarantee

Each rule record contains a SHA-256 `contentChecksum`:

```typescript
import { RuleChecksumService } from './services/rule-checksum.service';

const checksum = RuleChecksumService.generateRuleChecksum(rule);
const isValid = RuleChecksumService.verifyRuleChecksum(rule);
```

The `RuleRegistryService` verifies this checksum on every load. If any tampering or corruption occurs, the record is rejected and excluded from calculation context.
