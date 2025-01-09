export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface Interview {
  id: string;
  title: string;
  description: string;
  company: string;
  difficulty: string;
  duration: number;
  questions: Question[];
}

export interface Question {
  id: string;
  content: string;
  type: string;
}

export interface Assessment {
  id: string;
  userId: string;
  interviewId: string;
  status: string;
  score: number | null;
  feedback: string | null;
  faceAnalysis: any;
  voiceAnalysis: any;
  createdAt: Date;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  assessmentId: string;
  questionId: string;
  answer: string | null;
  score: number | null;
  feedback: string | null;
}