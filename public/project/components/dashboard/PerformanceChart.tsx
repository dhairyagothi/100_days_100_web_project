"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface PerformanceData {
  date: string;
  score: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}