import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import AudioRecorder from '@/components/exam/AudioRecorder';
import DifficultyFilter from '@/components/exam/DifficultyFilter';
import ProgressTracker from '@/components/exam/ProgressTracker';

type ExamType = 'tcf' | 'tef';
type ExamSection = 'listening' | 'reading' | 'writing' | 'speaking';

interface ExamModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  section: ExamSection;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function ExamPracticePage() {
  const [selectedExam, setSelectedExam] = useState<ExamType>('tcf');
  const [selectedSection, setSelectedSection] = useState<ExamSection | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  
  // Mock exam modules data
  const examModules: Record<ExamType, ExamModule[]> = {
    tcf: [
      {
        id: 'tcf-listening-1',
        title: 'TCF Listening - Everyday Conversations',
        description: 'Practice understanding everyday conversations in French.',
        duration: 20,
        section: 'listening',
        difficulty: 'easy',
      },
      {
        id: 'tcf-reading-1',
        title: 'TCF Reading - Short Texts',
        description: 'Practice reading and understanding short texts in French.',
        duration: 25,
        section: 'reading',
        difficulty: 'easy',
      },
      {
        id: 'tcf-writing-1',
        title: 'TCF Writing - Personal Opinion',
        description: 'Practice writing a short text expressing your opinion on a topic.',
        duration: 30,
        section: 'writing',
        difficulty: 'medium',
      },
      {
        id: 'tcf-speaking-1',
        title: 'TCF Speaking - Self-Introduction',
        description: 'Practice introducing yourself and talking about your interests.',
        duration: 15,
        section: 'speaking',
        difficulty: 'easy',
      },
    ],
    tef: [
      {
        id: 'tef-listening-1',
        title: 'TEF Listening - News Reports',
        description: 'Practice understanding news reports in French.',
        duration: 25,
        section: 'listening',
        difficulty: 'medium',
      },
      {
        id: 'tef-reading-1',
        title: 'TEF Reading - Articles',
        description: 'Practice reading and understanding articles in French.',
        duration: 30,
        section: 'reading',
        difficulty: 'medium',
      },
      {
        id: 'tef-writing-1',
        title: 'TEF Writing - Formal Letter',
        description: 'Practice writing a formal letter in French.',
        duration: 35,
        section: 'writing',
        difficulty: 'hard',
      },
      {
        id: 'tef-speaking-1',
        title: 'TEF Speaking - Argument',
        description: 'Practice presenting an argument on a given topic.',
        duration: 20,
        section: 'speaking',
        difficulty: 'hard',
      },
    ],
  };
  
  const filteredModules = examModules[selectedExam].filter(module => {
    return (selectedSection === 'all' || module.section === selectedSection) && 
           (selectedDifficulty === 'all' || module.difficulty === selectedDifficulty);
  });
  
  const getSectionColor = (section: ExamSection) => {
    switch (section) {
      case 'listening': return 'bg-blue-100 text-blue-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'writing': return 'bg-purple-100 text-purple-800';
      case 'speaking': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <>
      <Head>
        <title>Exam Practice | French Tutor AI</title>
        <meta name="description" content="Practice for TCF and TEF exams with AI-powered tools" />
      </Head>

      <div className="max-w-6xl px-4 mx-auto">
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">Exam Practice</h1>
          <p className="text-lg text-gray-600">
            Prepare for your TCF or TEF exam with our specialized practice modules. 
            Choose your exam type and section to get started.
          </p>
        </div>

        {/* Exam Selection Banner */}
        <div className="p-6 mb-8 text-white rounded-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="mb-2 text-2xl font-bold">Official Exam Preparation</h2>
              <p className="opacity-90">Structured practice modules designed to match the format of official exams</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedExam('tcf')}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${selectedExam === 'tcf' 
                  ? 'bg-white text-indigo-700' 
                  : 'bg-white/20 hover:bg-white/30'}`}
              >
                TCF
              </button>
              <button
                onClick={() => setSelectedExam('tef')}
                className={`px-5 py-2 rounded-full font-medium transition-colors ${selectedExam === 'tef' 
                  ? 'bg-white text-purple-700' 
                  : 'bg-white/20 hover:bg-white/30'}`}
              >
                TEF
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Section Filters */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-800">Exam Sections</h2>
              <div className="flex flex-wrap gap-2">
                {['all', 'listening', 'reading', 'writing', 'speaking'].map((section) => (
                  <button
                    key={section}
                    onClick={() => setSelectedSection(section as ExamSection | 'all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedSection === section
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    {section === 'all' ? 'All Sections' : section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Difficulty Filters */}
            <DifficultyFilter 
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={setSelectedDifficulty}
            />
          </div>
          
          {/* Progress Overview using ProgressTracker component */}
          <ProgressTracker 
            overallCompletion={25}
            progressData={[
              { section: 'Listening', percentage: 40, color: 'bg-blue-50' },
              { section: 'Reading', percentage: 30, color: 'bg-green-50' },
              { section: 'Writing & Speaking', percentage: 10, color: 'bg-purple-50' }
            ]}
          />
        </div>

        {/* Exam Modules Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <div key={module.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
              <div className="p-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">{module.title}</h3>
                <p className="mb-4 text-gray-600">{module.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSectionColor(module.section)}`}>
                    {module.section.charAt(0).toUpperCase() + module.section.slice(1)}
                  </span>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                  </span>
                  
                  <span className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                    {module.duration} min
                  </span>
                </div>
                
                <Link href={`/exam-practice/${module.id}`}>
                  <Button className="w-full">
                    Start Practice
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sample Questions Preview */}
        <div className="p-6 mb-12 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Sample {selectedExam.toUpperCase()} Questions</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Your Progress:</span>
              <div className="w-32 h-2 overflow-hidden bg-gray-200 rounded-full">
                <div className="h-full rounded-full bg-primary-600" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Reading Sample - Interactive */}
            <div className="pb-6 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <span className="px-3 py-1 mr-2 text-xs font-medium text-green-800 bg-green-100 rounded-full">Reading</span>
                <h3 className="text-lg font-medium text-gray-800">Sample Question</h3>
              </div>
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <p className="mb-3 text-gray-700">
                  {selectedExam === 'tcf' ? 
                    "Dans un restaurant, vous voyez ce panneau: 'Service continu de 11h à 23h'. Cela signifie que:" :
                    "Lisez ce texte: 'La médiathèque municipale sera exceptionnellement fermée ce samedi 20 juin pour cause d'inventaire annuel.' Quand la médiathèque sera-t-elle fermée?"}
                </p>
                <div className="space-y-2">
                  {(selectedExam === 'tcf' ? [
                    "Le restaurant est ouvert seulement pour le déjeuner et le dîner",
                    "Le restaurant est fermé entre 11h et 23h",
                    "Le restaurant sert des repas toute la journée sans interruption",
                    "Le restaurant propose un service de 11 à 23 euros"
                  ] : [
                    "Tous les samedis",
                    "Uniquement le samedi 20 juin",
                    "Pendant tout le mois de juin",
                    "Chaque année au mois de juin"
                  ]).map((option, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`reading-option-${index}`}
                          type="radio"
                          name="reading-sample"
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`reading-option-${index}`} className="text-gray-700">{option}</label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <Button size="sm">Check Answer</Button>
                </div>
              </div>
            </div>

            {/* Listening Sample - Interactive */}
            <div className="pb-6 border-b border-gray-200">
              <div className="flex items-center mb-3">
                <span className="px-3 py-1 mr-2 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Listening</span>
                <h3 className="text-lg font-medium text-gray-800">Sample Audio</h3>
              </div>
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <div className="mb-4">
                  <div className="flex items-center justify-center p-4 border border-indigo-100 rounded-lg bg-indigo-50">
                    <button className="p-3 text-white transition-colors bg-indigo-600 rounded-full hover:bg-indigo-700">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <div className="ml-4 text-indigo-800">
                      <p className="font-medium">Sample {selectedExam.toUpperCase()} Listening Exercise</p>
                      <p className="text-sm">Click to play audio</p>
                    </div>
                  </div>
                </div>
                <p className="mb-3 text-gray-700">
                  {selectedExam === 'tcf' ? 
                    "Écoutez l'audio et répondez à la question: Que propose la femme?" :
                    "Écoutez l'annonce et répondez: À quelle heure part le train?"}
                </p>
                <div className="mb-4 space-y-2">
                  {(selectedExam === 'tcf' ? [
                    "De prendre un café",
                    "D'aller au cinéma",
                    "De visiter un musée",
                    "De faire les courses"
                  ] : [
                    "14h30",
                    "14h45",
                    "15h30",
                    "15h45"
                  ]).map((option, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`listening-option-${index}`}
                          type="radio"
                          name="listening-sample"
                          className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`listening-option-${index}`} className="text-gray-700">{option}</label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <Button size="sm">Check Answer</Button>
                </div>
              </div>
            </div>

            {/* Writing Sample - Interactive */}
            <div>
              <div className="flex items-center mb-3">
                <span className="px-3 py-1 mr-2 text-xs font-medium text-purple-800 bg-purple-100 rounded-full">Writing</span>
                <h3 className="text-lg font-medium text-gray-800">Sample Prompt</h3>
              </div>
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <p className="mb-4 text-gray-700">
                  {selectedExam === 'tcf' ? 
                    "Vous avez visité Paris la semaine dernière. Écrivez un email à un ami pour lui raconter votre séjour (80-100 mots)." :
                    "Vous souhaitez vous inscrire à un cours de français. Écrivez un email au directeur de l'école pour demander des informations sur les horaires, les prix et le niveau requis (100-120 mots)."}
                </p>
                <div className="flex justify-between mb-2 text-sm text-gray-500">
                  <span>Minimum: 80 words</span>
                  <span>0 words</span>
                </div>
                <textarea 
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Write your response here..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <Button size="sm">Submit for Feedback</Button>
                </div>
              </div>
            </div>
            
            {/* Speaking Sample - Using AudioRecorder Component */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center mb-3">
                <span className="px-3 py-1 mr-2 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">Speaking</span>
                <h3 className="text-lg font-medium text-gray-800">Sample Speaking Task</h3>
              </div>
              <div className="p-4 mb-4 rounded-lg bg-gray-50">
                <p className="mb-4 text-gray-700">
                  {selectedExam === 'tcf' ? 
                    "Présentez-vous et parlez de vos loisirs et de vos intérêts (1-2 minutes)." :
                    "Choisissez un sujet d'actualité qui vous intéresse et présentez votre opinion (2-3 minutes)."}
                </p>
                
                <AudioRecorder 
                  maxDuration={120}
                  onRecordingComplete={(blob, url) => {
                    setAudioBlob(blob);
                    setAudioUrl(url);
                  }}
                />
                
                {/* Speaking Tips */}
                <div className="p-4 mt-4 rounded-lg bg-blue-50">
                  <h4 className="mb-2 font-medium text-blue-800">Speaking Tips:</h4>
                  <ul className="space-y-1 text-sm text-blue-700 list-disc list-inside">
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Use a variety of vocabulary and grammatical structures</li>
                    <li>Structure your response with an introduction, main points, and conclusion</li>
                    <li>Practice speaking without long pauses</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row">
            <Link href={`/exam-practice/${selectedExam}-${selectedSection === 'all' ? 'reading' : selectedSection}-1`}>
              <Button size="lg">
                Take Full Practice Test
              </Button>
            </Link>
            <Link href="/exam-practice/progress">
              <Button size="lg" variant="secondary">
                View Your Progress
              </Button>
            </Link>
          </div>
        </div>

        {/* Exam Tips Section */}
        <div className="p-6 mb-12 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Exam Preparation Tips</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="p-5 bg-white rounded-lg shadow-sm">
              <div className="mb-3 text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Study Consistently</h3>
              <p className="text-gray-600">Regular practice is more effective than cramming. Set aside time each day for focused study and review.</p>
            </div>
            <div className="p-5 bg-white rounded-lg shadow-sm">
              <div className="mb-3 text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Immerse Yourself</h3>
              <p className="text-gray-600">Listen to French podcasts, watch French movies, and read French news to improve your comprehension skills.</p>
            </div>
            <div className="p-5 bg-white rounded-lg shadow-sm">
              <div className="mb-3 text-purple-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Familiarize with Format</h3>
              <p className="text-gray-600">Understanding the exam structure and timing is crucial. Take multiple practice tests to build confidence.</p>
            </div>
            <div className="p-5 bg-white rounded-lg shadow-sm">
              <div className="mb-3 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">Manage Stress</h3>
              <p className="text-gray-600">Practice relaxation techniques to stay calm during the exam. Good sleep and nutrition also impact performance.</p>
            </div>
          </div>
        </div>

        {/* Exam Info Section */}
        <div className="p-6 mb-12 rounded-lg bg-gray-50">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            About the {selectedExam.toUpperCase()} Exam
          </h2>
          
          {selectedExam === 'tcf' ? (
            <div className="space-y-4">
              <p className="text-gray-700">
                The Test de Connaissance du Français (TCF) is a French language proficiency test administered by the Centre International d'Études Pédagogiques (CIEP) on behalf of the French Ministry of Education.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-800">Exam Format</h3>
                  <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    <li>Listening Comprehension (29 questions)</li>
                    <li>Reading Comprehension (29 questions)</li>
                    <li>Writing Production (3 tasks)</li>
                    <li>Speaking Production (3 tasks)</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-800">Scoring</h3>
                  <p className="text-gray-700">
                    The TCF uses a 6-level scale aligned with the Common European Framework of Reference for Languages (CEFR), from A1 (beginner) to C2 (proficient).
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700">
                The Test d'Évaluation de Français (TEF) is a French language proficiency test administered by the Paris Ile-de-France Chamber of Commerce and Industry.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-800">Exam Format</h3>
                  <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    <li>Listening Comprehension (40 questions)</li>
                    <li>Reading Comprehension (50 questions)</li>
                    <li>Written Expression (2 tasks)</li>
                    <li>Oral Expression (2 tasks)</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-md shadow-sm">
                  <h3 className="mb-2 font-semibold text-gray-800">Scoring</h3>
                  <p className="text-gray-700">
                    The TEF uses a scoring system from 0 to 699 points, which corresponds to the 6 levels of the CEFR from A1 (beginner) to C2 (proficient).
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <Link href="/lessons">
              <Button variant="outline" className="mr-4">
                Explore Regular Lessons
              </Button>
            </Link>
            <Link href="/practice">
              <Button variant="outline">
                Try Speaking Practice
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}