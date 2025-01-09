import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Brain, Users, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Master Your Interview Skills with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice interviews with our AI-powered platform and get instant feedback
            on your performance
          </p>
          <Link href="/interviews">
            <Button size="lg" className="gap-2">
              Start Practicing <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-600">
              Get detailed feedback on your facial expressions, voice tone, and body language
            </p>
          </Card>

          <Card className="p-6">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real Questions</h3>
            <p className="text-gray-600">
              Practice with questions from top companies across various industries
            </p>
          </Card>

          <Card className="p-6">
            <Trophy className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Monitor your improvement over time with detailed performance analytics
            </p>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Excel?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of candidates who have improved their interview skills
          </p>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}