import { useState } from 'react';
import { ExamResults } from './ExamModule';
import { Button } from '@/components/ui/Button';

interface ExamProgressProps {
  examType: 'tcf' | 'tef';
  results?: ExamResults[];
}

export default function ExamProgress({ examType, results = [] }: ExamProgressProps) {
  const [selectedSection, setSelectedSection] = useState<'all' | 'listening' | 'reading' | 'writing' | 'speaking'>('all');
  
  // Group results by section
  const sectionResults = {
    listening: results.filter(r => r.moduleId.includes('listening')),
    reading: results.filter(r => r.moduleId.includes('reading')),
    writing: results.filter(r => r.moduleId.includes('writing')),
    speaking: results.filter(r => r.moduleId.includes('speaking')),
  };
  
  const filteredResults = selectedSection === 'all' 
    ? results 
    : sectionResults[selectedSection];
  
  // Calculate overall progress
  const calculateProgress = () => {
    if (results.length === 0) return 0;
    
    const totalModules = {
      tcf: 8, // Example: 2 modules per section
      tef: 8,
    };
    
    return Math.min(100, Math.round((results.length / totalModules[examType]) * 100));
  };
  
  // Calculate average score
  const calculateAverageScore = (resultsList: ExamResults[]) => {
    if (resultsList.length === 0) return 0;
    
    const totalScore = resultsList.reduce((sum, result) => {
      return sum + (result.score / result.totalQuestions * 100);
    }, 0);
    
    return Math.round(totalScore / resultsList.length);
  };
  
  const getSectionColor = (section: string) => {
    switch (section) {
      case 'listening': return 'bg-blue-100 text-blue-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'speaking': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const overallProgress = calculateProgress();
  const averageScore = calculateAverageScore(results);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your {examType.toUpperCase()} Progress</h2>
      
      {/* Overall Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Overall Progress</h3>
          <span className="text-lg font-semibold">{overallProgress}%</span>
        </div>
        <div className="w-full h-4 overflow-hidden bg-gray-200 rounded-full">
          <div 
            className="h-full transition-all duration-500 rounded-full bg-primary-600" 
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {results.length} module{results.length !== 1 ? 's' : ''} completed
        </div>
      </div>
      
      {/* Section Filters */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-medium text-gray-700">Filter by Section</h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'listening', 'reading', 'writing', 'speaking'].map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section as 'all' | 'listening' | 'reading' | 'writing' | 'speaking')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSection === section
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              {section === 'all' ? 'All Sections' : section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Completed Modules</h3>
            <span className={`text-lg font-semibold ${getScoreColor(averageScore)}`}>
              Avg. Score: {averageScore}%
            </span>
          </div>
          
          {filteredResults.map((result) => {
            const moduleSection = result.moduleId.includes('listening') ? 'listening' :
                               result.moduleId.includes('reading') ? 'reading' :
                               result.moduleId.includes('writing') ? 'writing' : 'speaking';
            
            const score = Math.round((result.score / result.totalQuestions) * 100);
            
            return (
              <div key={result.moduleId} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {result.moduleId.includes('tcf') ? 'TCF' : 'TEF'} {moduleSection.charAt(0).toUpperCase() + moduleSection.slice(1)}
                    </h4>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSectionColor(moduleSection)} mr-2`}>
                        {moduleSection.charAt(0).toUpperCase() + moduleSection.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Completed on {new Date(result.completedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`text-lg font-semibold ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
                <div className="flex justify-end mt-3">
                  <Button size="sm" variant="link">View Details</Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="inline-block p-3 mb-4 bg-gray-100 rounded-full">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-700">No modules completed yet</h3>
          <p className="mb-6 text-gray-500">
            {selectedSection === 'all' 
              ? 'Start practicing with exam modules to track your progress' 
              : `You haven't completed any ${selectedSection} modules yet`}
          </p>
          <Button variant="default">
            Start a Practice Module
          </Button>
        </div>
      )}
    </div>
  );
}