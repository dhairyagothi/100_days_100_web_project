"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import StatCard from '@/components/dashboard/StatCard';
import { Activity, Award, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    improvement: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    setAssessments(data.assessments);
    setStats(data.stats);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Interview Performance Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Total Interviews"
          value={stats.totalInterviews}
          icon={Activity}
        />
        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          icon={Award}
          trend={{ value: stats.improvement, isPositive: stats.improvement > 0 }}
        />
        <StatCard
          title="Practice Time"
          value={`${stats.totalInterviews * 30} mins`}
          icon={Clock}
        />
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="feedback">Interview Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <PerformanceChart data={assessments} />
        </TabsContent>

        <TabsContent value="feedback">
          <Card className="p-6">
            <div className="space-y-6">
              {assessments.map((assessment: any) => (
                <div key={assessment.id} className="border-b pb-4">
                  <h3 className="font-medium">{assessment.interview.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{assessment.feedback}</p>
                  <div className="mt-2 flex gap-2">
                    {assessment.tags?.map((tag: string) => (
                      <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}