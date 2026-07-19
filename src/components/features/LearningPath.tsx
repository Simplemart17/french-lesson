import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import apiClient from '@/services/api/apiClient';
import { ApiResponse } from '@/types/api';

interface PathLesson {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  topics: string[];
  orderIndex: number;
  isCheckpoint: boolean;
  completed: boolean;
  score: number | null;
}

interface LearningPathData {
  level: string;
  nextLevel: string | null;
  lessons: PathLesson[];
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  nextLesson: PathLesson | null;
  checkpointPassed: boolean;
  canAdvance: boolean;
}

export default function LearningPath() {
  const [path, setPath] = useState<LearningPathData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPath = useCallback(async () => {
    try {
      const response = await apiClient.get<ApiResponse<LearningPathData>>('/learning/path');
      if (response.data?.success && response.data.data) {
        setPath(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching learning path:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPath();
  }, [fetchPath]);

  const handleAdvance = async () => {
    setIsAdvancing(true);
    setMessage(null);
    try {
      const response = await apiClient.post<ApiResponse<{ level: string; message: string }>>('/learning/path', {});
      if (response.data?.success && response.data.data) {
        setMessage(response.data.data.message);
        await fetchPath();
      }
    } catch (err) {
      console.error('Error advancing level:', err);
      setMessage('Could not advance level yet. Complete your remaining lessons and the checkpoint first.');
    } finally {
      setIsAdvancing(false);
    }
  };

  if (isLoading || !path || path.totalLessons === 0) {
    return null;
  }

  return (
    <div className="p-6 mb-8 text-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-600 to-blue-500">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-sm font-bold bg-white rounded-full text-indigo-700">
              Level {path.level}
            </span>
            <h2 className="text-xl font-bold">Your Learning Path</h2>
          </div>
          <p className="mt-2 opacity-90">
            {path.completedLessons} of {path.totalLessons} lessons completed
            {path.nextLevel ? ` — next stop: ${path.nextLevel}` : ' — top level!'}
          </p>
          <div className="w-full h-2 mt-3 rounded-full bg-white/25">
            <div
              className="h-2 bg-white rounded-full transition-all"
              style={{ width: `${path.progressPercent}%` }}
            />
          </div>
          {message && <p className="mt-2 text-sm font-medium">{message}</p>}
        </div>

        <div className="flex flex-col items-stretch gap-2 md:items-end">
          {path.canAdvance && path.nextLevel ? (
            <Button
              onClick={handleAdvance}
              disabled={isAdvancing}
              className="bg-white text-indigo-700 hover:bg-indigo-50"
            >
              {isAdvancing ? 'Advancing…' : `Advance to ${path.nextLevel} 🎉`}
            </Button>
          ) : path.nextLesson ? (
            <Link href={`/lessons/${path.nextLesson.id}`}>
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50">
                Continue: {path.nextLesson.title.length > 40 ? `${path.nextLesson.title.slice(0, 40)}…` : path.nextLesson.title}
              </Button>
            </Link>
          ) : null}
          {!path.checkpointPassed && path.nextLesson?.isCheckpoint && (
            <p className="text-xs opacity-80">Pass the checkpoint to unlock {path.nextLevel}.</p>
          )}
        </div>
      </div>
    </div>
  );
}
