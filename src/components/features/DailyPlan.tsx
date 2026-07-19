import { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/services/api/apiClient';
import { ApiResponse } from '@/types/api';

interface PlanItem {
  type: 'reviews' | 'lesson' | 'drill';
  title: string;
  description: string;
  minutes: number;
  href: string;
}

interface DailyPlanData {
  level: string;
  dailyGoal: number;
  dueReviews: number;
  streakDays: number;
  streakAtRisk: boolean;
  weakestArea: string | null;
  items: PlanItem[];
}

const ITEM_ICONS: Record<PlanItem['type'], string> = {
  reviews: '🔁',
  lesson: '📖',
  drill: '🎯'
};

export default function DailyPlan() {
  const [plan, setPlan] = useState<DailyPlanData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await apiClient.get<ApiResponse<DailyPlanData>>('/learning/daily-plan');
        if (response.data?.success && response.data.data) {
          setPlan(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching daily plan:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (isLoading || !plan || plan.items.length === 0) return null;

  const totalMinutes = plan.items.reduce((sum, item) => sum + item.minutes, 0);

  return (
    <div className="p-6 mb-8 bg-white border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Today&apos;s plan</h2>
          <p className="text-sm text-gray-500">
            {totalMinutes} min · level {plan.level}
            {plan.streakDays > 0 && ` · ${plan.streakDays}-day streak`}
          </p>
        </div>
        {plan.streakAtRisk && (
          <span className="px-3 py-1 text-xs font-bold text-orange-800 bg-orange-100 rounded-full">
            🔥 Practice today to keep your streak!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {plan.items.map((item) => (
          <Link
            key={`${item.type}-${item.href}`}
            href={item.href}
            className="flex items-start p-4 transition-colors border border-gray-100 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200"
          >
            <span className="mr-3 text-2xl">{ITEM_ICONS[item.type]}</span>
            <span>
              <span className="block font-medium text-gray-800">{item.title}</span>
              <span className="block text-sm text-gray-500">{item.description}</span>
              <span className="block mt-1 text-xs font-medium text-indigo-600">~{item.minutes} min</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
