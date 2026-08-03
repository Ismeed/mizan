/**
 * MIZAN Mobile — Agriculture Zakat Hook (Phase 10)
 */

import { useState, useCallback } from 'react';
import type { CanonicalAgricultureFacts, AgricultureAssetResult } from '@mizan/shared';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export function useAgricultureSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewAgriculture = useCallback(async (
    facts: CanonicalAgricultureFacts,
    madhhab: string = 'HANAFI'
  ): Promise<AgricultureAssetResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/zakat/agriculture/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facts, madhhab }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to calculate Agriculture Zakat preview');
      }
      return data.data.result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { previewAgriculture, loading, error };
}
