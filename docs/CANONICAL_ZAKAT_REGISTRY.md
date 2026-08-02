# MIZAN Canonical Zakat Category Registry

**Phase 8 — Zakat Category Identifier and Asset Registry**

> [!IMPORTANT]
> This document describes the Phase 8 canonical Zakat category identifier system.
> All Zakat wealth categories, asset entries, eligibility decisions, nisab decisions,
> aggregation decisions, rate decisions, and AI contexts MUST use permanent canonical IDs.

---

## Purpose

The MIZAN Canonical Zakat Category Registry establishes:

1. **Permanent machine-readable identifiers** for every Zakat wealth category
2. **Classification metadata** describing domain, value type, nisab base, and hawl requirement
3. **Per-madhhab input support status** for each category
4. **Localization i18n keys** mapping canonical IDs to multilingual display labels
5. **Alias and normalization maps** for legacy key and user input resolution
6. **Group definitions** for UI organisation and aggregation rule references

---

## Critical Constraints

| Constraint | Description |
|---|---|
| **No translated terms as IDs** | Canonical IDs are UPPERCASE_SNAKE_CASE English technical terms only |
| **No madhhab names in IDs** | `HANAFI_GOLD` is invalid; `GOLD` is correct |
| **Registry inclusion ≠ zakatable** | Whether a category is zakatable is determined by the Rule Engine only |
| **No rate decisions in registry** | 2.5%, 5%, 10% etc. are determined by the Rule Engine only |
| **No nisab values in registry** | Threshold values are determined by the Rule Engine and market feeds |
| **Aggregation rules are external** | Which categories combine for nisab is determined by the Rule Engine |
| **IDs are permanent** | Once published to PRODUCTION, a canonical ID cannot be renamed or deleted |
| **Language changes don't change IDs** | Adding Arabic or Hausa labels must not change any canonical ID |

---

## Canonical Category Identifier List (22 identifiers)

### Monetary & Liquid Assets (3)
| ID | Canonical Name | Domain |
|---|---|---|
| `CASH_AND_BANK` | Cash and Bank Accounts | MONETARY |
| `FOREIGN_CURRENCY` | Foreign Currency Holdings | MONETARY |
| `DIGITAL_CURRENCY` | Digital Currency and Cryptocurrency | MONETARY |

### Precious Metals (2)
| ID | Canonical Name | Nisab Base |
|---|---|---|
| `GOLD` | Gold | GOLD_85_GRAMS |
| `SILVER` | Silver | SILVER_595_GRAMS |

### Trade & Business Assets (3)
| ID | Canonical Name | Domain |
|---|---|---|
| `BUSINESS_INVENTORY` | Business Inventory and Trading Stock | TRADE |
| `BUSINESS_RECEIVABLES` | Business Receivables | TRADE |
| `BUSINESS_INVESTMENTS` | Business Equity and Investments | TRADE |

### Financial Investments (4)
| ID | Canonical Name | Support Status |
|---|---|---|
| `QUOTED_INVESTMENTS` | Quoted Investments (Listed Stocks and Funds) | SUPPORTED |
| `UNQUOTED_INVESTMENTS` | Unquoted Investments (Private Equity) | NOT_YET_MODELLED |
| `PENSION_FUNDS` | Pension and Retirement Fund Value | REVIEW_REQUIRED |
| `BONDS_AND_SUKUK` | Bonds and Sukuk | SUPPORTED |

### Receivables & Loans (2)
| ID | Canonical Name | Domain |
|---|---|---|
| `PERSONAL_RECEIVABLES` | Personal Receivables | RECEIVABLES |
| `LOAN_GIVEN` | Loans Given (Recoverable) | RECEIVABLES |

### Agricultural Produce (1)
| ID | Canonical Name | Hawl Required |
|---|---|---|
| `AGRICULTURAL_PRODUCE` | Agricultural Produce (Crops and Harvests) | NOT_REQUIRED |

### Livestock (3)
| ID | Canonical Name | Nisab Base |
|---|---|---|
| `LIVESTOCK_CAMELS` | Livestock — Camels (Ibil) | CAMEL_COUNT |
| `LIVESTOCK_CATTLE` | Livestock — Cattle and Buffalo (Baqar) | CATTLE_COUNT |
| `LIVESTOCK_SHEEP_GOATS` | Livestock — Sheep and Goats (Ghanam) | SHEEP_GOAT_COUNT |

### Income & Savings (2)
| ID | Canonical Name | Domain |
|---|---|---|
| `RENTAL_INCOME` | Net Rental Income from Investment Property | INCOME |
| `SAVINGS_DEPOSITS` | Fixed-Term Savings and Bank Deposits | INCOME |

### Liabilities (2)
| ID | Canonical Name | Is Liability |
|---|---|---|
| `CURRENT_LIABILITIES` | Current Liabilities (Debts Currently Due) | ✓ |
| `DEFERRED_LIABILITIES` | Deferred Liabilities (Longer-Term Debts) | ✓ |

---

## Canonical Group Identifiers (11 groups)

| Group ID | Description | Display Order |
|---|---|---|
| `MONETARY_ASSETS` | Monetary and Liquid Assets | 0 |
| `PRECIOUS_METALS` | Precious Metals | 1 |
| `TRADE_ASSETS` | Trade and Business Assets | 2 |
| `FINANCIAL_INVESTMENTS` | Financial Investments | 3 |
| `RECEIVABLES` | Receivables and Loans | 4 |
| `AGRICULTURAL` | Agricultural Produce | 5 |
| `LIVESTOCK` | Livestock | 6 |
| `INCOME_AND_SAVINGS` | Income and Savings | 7 |
| `LIABILITIES` | Liabilities (Deductible) | 8 |
| `ALL_ZAKATABLE_ASSETS` | All Potentially Zakatable Assets (meta-group) | 99 |
| `ALL_DEDUCTIBLE_LIABILITIES` | All Deductible Liabilities (meta-group) | 98 |

---

## Legacy Migration Map

| Legacy Key | Canonical ID | Migration Status |
|---|---|---|
| `CASH` / `cash` / `Cash & Bank` | `CASH_AND_BANK` | VERIFIED |
| `GOLD` / `goldValue` | `GOLD` | VERIFIED |
| `SILVER` / `silverValue` | `SILVER` | VERIFIED |
| `BUSINESS_INVENTORY` / `businessInventory` | `BUSINESS_INVENTORY` | VERIFIED |
| `AGRICULTURAL` / `agriculture` | `AGRICULTURAL_PRODUCE` | VERIFIED |
| `LIVESTOCK` / `livestock` | `LIVESTOCK_SHEEP_GOATS` | **REVIEW_REQUIRED** — must specify animal type |
| `INVESTMENTS` / `investments` | `QUOTED_INVESTMENTS` | **REVIEW_REQUIRED** — may include unquoted/pension |
| `RECEIVABLES` / `receivables` | `PERSONAL_RECEIVABLES` | **REVIEW_REQUIRED** — may be personal or business |

> [!WARNING]
> Four legacy keys are marked REVIEW_REQUIRED because the old single-key mapped to
> what is now multiple specialised categories. A scholar must confirm the correct
> canonical ID before automatic production migration.

---

## File Locations

### Shared Package (`@mizan/shared`)
| File | Purpose |
|---|---|
| `types/zakat/canonical-zakat-category.types.ts` | Core types and `CanonicalZakatCategoryId` union |
| `types/zakat/zakat-nisab.types.ts` | Nisab threshold and hawl tracking types |
| `types/zakat/zakat-localization.types.ts` | Multilingual label types |
| `types/zakat/zakat-alias.types.ts` | Alias and normalization result types |
| `types/zakat/zakat-group.types.ts` | Group identifier and record types |
| `types/zakat/zakat-asset-instance.types.ts` | Per-calculation asset entry types |
| `types/zakat/zakat-eligibility.types.ts` | Eligibility decision output types |
| `schemas/zod/zakat/canonical-zakat-category.schema.ts` | Zod validation schemas |
| `registry/canonical-zakat-categories.registry.ts` | Baseline 22 category records |
| `registry/canonical-zakat-groups.registry.ts` | Baseline 11 group records |
| `registry/zakat-legacy-alias.registry.ts` | Legacy migration alias map |

### Backend Services (`backend/src/features/zakat/`)
| File | Purpose |
|---|---|
| `services/zakat-category-registry.service.ts` | Load and query category entities |
| `services/zakat-normalization.service.ts` | Alias resolution and legacy migration |
| `services/zakat-localization.service.ts` | Localized labels for categories |
| `services/zakat-category-availability.service.ts` | Input availability per madhhab |
| `services/zakat-display.service.ts` | Ordered, localized UI form sections |
| `zakat-categories.controller.ts` | HTTP handlers for registry endpoints |
| `zakat-categories.routes.ts` | Express routes for registry API |

### API Routes
| Endpoint | Method | Description |
|---|---|---|
| `/api/zakat/categories` | GET | List all categories for a madhhab |
| `/api/zakat/categories/form-sections` | GET | Ordered UI form sections |
| `/api/zakat/categories/:categoryId` | GET | Single category entity |
| `/api/zakat/categories/:categoryId/availability` | GET | Input availability for madhhab |
| `/api/zakat/categories/normalize` | POST | Normalize raw input to canonical ID |
| `/api/zakat/categories/migrate-legacy` | POST | Migrate legacy AssetType value |

### Database Models (`backend/prisma/schema.prisma`)
| Model | Purpose |
|---|---|
| `ZakatCategoryEntity` | Canonical category entity records |
| `ZakatCategoryLocalization` | Per-language label records |
| `ZakatCategoryAlias` | Alias-to-canonical-ID mappings |
| `ZakatCategoryMadhhabSupport` | Per-madhhab support status |
| `ZakatCategoryGroup` | Group definition records |
| `ZakatCategoryGroupMembership` | Category-to-group membership entries |
| `ZakatAssetInstance` | Per-calculation canonical asset entries |
| `ZakatCategoryNormalizationRecord` | Normalization audit log |
| `ZakatCategoryAuditEvent` | Governance lifecycle audit events |

---

## Non-Negotiable Constraints

1. No screen label may be used as a Rule Engine Zakat category identifier
2. No translated term may become a canonical Zakat category ID
3. No madhhab name may appear inside a canonical category ID
4. Registry inclusion does NOT imply zakatable status
5. No nisab value may be hardcoded in the registry
6. No Zakat rate (2.5%, 5%, 10%) may be hardcoded in the registry
7. Aggregation rules (which categories combine for nisab) must not be in the registry
8. Language changes must not change calculation facts or canonical IDs
9. Approved entity versions are immutable once marked PRODUCTION
10. Historical calculations must retain their original category version at time of calculation
