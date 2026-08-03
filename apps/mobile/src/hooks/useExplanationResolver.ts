import { useState, useEffect } from 'react';
import { RenderedExplanation } from '@mizan/shared';
import { useSettingsStore } from '../stores/settings.store';

export interface UseExplanationResolverInput {
  explanationId: string;
  explanationVersion?: string;
  structuredResult: Record<string, any>;
}

export interface UseExplanationResolverReturn {
  explanation: RenderedExplanation | null;
  loading: boolean;
  error: string | null;
  fallbackUsed: boolean;
}

export const useExplanationResolver = (
  input: UseExplanationResolverInput
): UseExplanationResolverReturn => {
  const { explanationId, explanationVersion = '1.0.0', structuredResult } = input;
  const language = useSettingsStore((s) => s.language) || 'en';
  const madhhab = useSettingsStore((s) => s.madhhab) || 'HANAFI';

  const [explanation, setExplanation] = useState<RenderedExplanation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Dynamic resolution via API call or offline fallback
    fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'}/explanations/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        explanationId,
        version: explanationVersion,
        languageTag: language,
        selectedMadhhab: madhhab,
        structuredResult,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data.success && data.data) {
            setExplanation(data.data);
          } else {
            setError(data.message || 'Failed to resolve explanation');
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [explanationId, explanationVersion, language, madhhab, JSON.stringify(structuredResult)]);

  return {
    explanation,
    loading,
    error,
    fallbackUsed: explanation?.language.fallbackUsed ?? false,
  };
};
