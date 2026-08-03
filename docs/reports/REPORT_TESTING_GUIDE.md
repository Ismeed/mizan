# MIZAN Report Testing Guide (Phase 14)

## Running Automated Tests

Run Jest test suites for report architecture:
```bash
npx jest reports
```

## Running CLI Validation Commands

```bash
# Validate Standard Report Contract
npm run reports:validate

# Validate Canonical 12-Section Order
npm run reports:validate-section-order

# Test Mirath Report Assembly
npm run reports:test-mirath

# Test Zakat Report Assembly
npm run reports:test-zakat
```
