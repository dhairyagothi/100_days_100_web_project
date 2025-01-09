"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import VideoFeedback from '@/components/assessment/VideoFeedback';
import QuestionCard from '@/components/assessment/QuestionCard';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function AssessmentPage() {
  const { id } = useParams();
  const { assessment, loading, error, updateAssessment } = useAssessment(id as string);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [emotions, setEmotions] = useState<any>([]);

  const handleAnalysis = (analysisData: any) => {
    setEmotions(prev => [...prev, analysisData]);
  };

  const handleNext = async () => {
    if (!assessment) return;

    await updateAssessment(assessment.questions[currentQuestion].id, {
      emotions,
      // Add other analysis data
    });

    setCurrentQuestion(prev => prev + 1);
    setEmotions([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!assessment) {
    return <div>Assessment not found</div>;
  }

  const progress = (currentQuestion / assessment.questions.length) * 100;

  return (
    <div className="container mx-auto p-6">
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <VideoFeedback onAnalysis={handleAnalysis} />
            <Progress value={progress} className="mt-4" />
          </div>
          <div>
            {currentQuestion < assessment.questions.length ? (
              <QuestionCard
                question={assessment.questions[currentQuestion].question}
                currentNumber={currentQuestion + 1}
                total={assessment.questions.length}
                onNext={handleNext}
              />
            ) : (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Interview Complete!</h2>
                <p>Your results are being analyzed...</p>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}