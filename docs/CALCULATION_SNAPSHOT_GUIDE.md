# MIZAN Calculation Snapshot & Immutability Guide

## Overview

When a Mirath or Zakat calculation executes, the system resolves a `CalculationProfile` and creates a frozen snapshot in the `CalculationProfileSnapshot` table.

## Checksum Protection

Every frozen snapshot contains a deterministic 64-character SHA-256 checksum calculated over all rule-influencing, currency, language, and version fields.

Before generating PDF reports or retrieving calculation context:
1. Reconstruct profile fields.
2. Re-calculate SHA-256 checksum.
3. Compare against stored `checksum`.
4. If mismatch occurs, raise a security integrity alert.

## Recalculation Workflow

Snapshots are immutable (`frozen_at` is set, `profile_status = 'FROZEN'`). To alter settings for an existing calculation:
1. Original calculation record remains untouched.
2. User initiates a recalculation.
3. System creates a new calculation record and resolves a new snapshot.
