import React from 'react';

interface ProgressData {
  section: string;
  percentage: number;
  color: string;
}

interface ProgressTrackerProps {
  progressData: ProgressData[];
  overallCompletion: number;
}

export default function ProgressTracker({ progressData, overallCompletion }: ProgressTrackerProps) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Progress</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-indigo-700">{overallCompletion}%</div>
          <div className="text-sm text-indigo-600">Overall Completion</div>
        </div>
        
        {progressData.map((item, index) => (
          <div key={index} className={`${item.color} p-4 rounded-lg`}>
            <div className="text-2xl font-bold text-gray-700">{item.percentage}%</div>
            <div className="text-sm text-gray-600">{item.section}</div>
            <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-gray-700 bg-opacity-60" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-right">
        <a href="/exam-practice/progress" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
          View detailed progress →
        </a>
      </div>
    </div>
  );
}