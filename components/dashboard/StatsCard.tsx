'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  change?: number; // Percentage change
  changeLabel?: string;
  loading?: boolean;
}

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
  red: 'bg-red-50 text-red-600',
};

export default function StatsCard({
  title,
  value,
  icon,
  color = 'blue',
  change,
  changeLabel,
  loading = false,
}: StatsCardProps) {
  const colorClass = colorVariants[color];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>

            {/* Change indicator */}
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {change >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {Math.abs(change)}%
                </span>
                {changeLabel && (
                  <span className="text-sm text-gray-500">{changeLabel}</span>
                )}
              </div>
            )}
          </div>

          {/* Icon */}
          <div className={cn('p-3 rounded-lg', colorClass)}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
