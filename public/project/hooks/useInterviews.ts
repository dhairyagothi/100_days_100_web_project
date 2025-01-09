"use client";

import { useState, useEffect } from 'react';
import { Interview } from '@/types';

export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch('/api/interviews');
        if (!response.ok) {
          throw new Error('Failed to fetch interviews');
        }
        const data = await response.json();
        setInterviews(data.interviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  return {
    interviews,
    loading,
    error,
  };
}