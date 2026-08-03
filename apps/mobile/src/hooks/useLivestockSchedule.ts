/**
 * MIZAN Mobile — Livestock Schedule Hook (Phase 9)
 *
 * Provides livestock species, required facts, preview calculations,
 * and AI context generation for the mobile UI.
 */

import { useState, useCallback } from 'react';
import type { CanonicalLivestockFacts, LivestockAssetResult } from '@mizan/shared';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export function useLivestockSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewSchedule = useCallback(async (facts: CanonicalLivestockFacts, madhhab: string = 'HANAFI'): Promise<LivestockAssetResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/zakat/livestock/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facts, madhhab }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to preview livestock schedule');
      return json.data.result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { previewSchedule, loading, error };
}
