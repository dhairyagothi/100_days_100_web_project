"use client";

import { useState, useEffect } from 'react';
import { Assessment } from '@/types';

export function useAssessment(assessmentId: string) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${assessmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch assessment');
        }
        const data = await response.json();
        setAssessment(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  const updateAssessment = async (questionId: string, analysisData: any) => {
    try {
      const response = await fetch(
        `/api/assessments/${assessmentId}/questions/${questionId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update assessment');
      }

      const updatedData = await response.json();
      setAssessment(updatedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    assessment,
    loading,
    error,
    updateAssessment,
  };
}