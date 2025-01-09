import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: {
    content: string;
    type: string;
  };
  currentNumber: number;
  total: number;
  onNext: () => void;
}

export default function QuestionCard({
  question,
  currentNumber,
  total,
  onNext,
}: QuestionCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {currentNumber} of {total}
        </span>
      </div>
      <h3 className="text-xl font-semibold mb-4">{question.content}</h3>
      <p className="text-gray-600 mb-4">Type: {question.type}</p>
      <Button onClick={onNext} className="w-full">
        Next Question
      </Button>
    </Card>
  );
}