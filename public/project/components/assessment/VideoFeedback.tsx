"use client";

import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { loadFaceModels, analyzeFaceExpressions } from '@/lib/analysis/face';
import { Card } from '@/components/ui/card';

interface VideoFeedbackProps {
  onAnalysis: (data: any) => void;
}

export default function VideoFeedback({ onAnalysis }: VideoFeedbackProps) {
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const initializeAnalysis = async () => {
      await loadFaceModels();
      startAnalysis();
    };

    initializeAnalysis();
  }, []);

  const startAnalysis = () => {
    const interval = setInterval(async () => {
      if (webcamRef.current?.video) {
        const expressions = await analyzeFaceExpressions(webcamRef.current.video);
        if (expressions) {
          onAnalysis(expressions);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <Card className="overflow-hidden">
      <Webcam
        ref={webcamRef}
        audio={true}
        className="w-full rounded-lg"
      />
    </Card>
  );
}