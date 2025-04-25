import React from 'react';
import '../../styles/animations.css';

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
    <div className="pt-6 mt-6 border-t border-gray-200 animate-fade-in">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Your Progress</h2>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-indigo-50 rounded-lg shadow-sm transition-all hover-lift">
          <div className="text-2xl font-bold text-indigo-700">{overallCompletion}%</div>
          <div className="text-sm text-indigo-600">Overall Completion</div>
          <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-indigo-600 animate-progress-fill" 
              style={{ width: `${overallCompletion}%`, '--progress-width': `${overallCompletion}%` } as React.CSSProperties}
            ></div>
          </div>
        </div>
        
        {progressData.map((item, index) => (
          <div 
            key={index} 
            className={`${item.color} p-4 rounded-lg shadow-sm hover-lift transition-all`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-2xl font-bold text-gray-700">{item.percentage}%</div>
            <div className="text-sm text-gray-600">{item.section}</div>
            <div className="mt-2 w-full bg-white bg-opacity-30 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full bg-gray-700 bg-opacity-60 animate-progress-fill" 
                style={{ width: `${item.percentage}%`, '--progress-width': `${item.percentage}%` } as React.CSSProperties}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-right">
        <a href="/exam-practice/progress" className="inline-flex items-center text-sm font-medium text-indigo-600 transition-all hover:text-indigo-800 group">
          View detailed progress 
          <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}