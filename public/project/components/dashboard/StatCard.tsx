import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span
            className={`text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
    </Card>
  );
}