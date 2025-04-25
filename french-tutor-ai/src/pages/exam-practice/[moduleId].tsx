import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ExamModule, { ExamResults } from '@/components/exam/ExamModule';
import { ExamQuestionData } from '@/components/exam/ExamQuestion';
import { Button } from '@/components/ui/Button';

type ExamType = 'tcf' | 'tef';
type ExamSection = 'listening' | 'reading' | 'writing' | 'speaking';

interface ExamModuleData {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  section: ExamSection;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: ExamQuestionData[];
}

// Mock data for exam modules
const examModulesData: Record<string, ExamModuleData> = {
  'tcf-listening-1': {
    id: 'tcf-listening-1',
    title: 'TCF Listening - Everyday Conversations',
    description: 'Practice understanding everyday conversations in French.',
    duration: 20,
    section: 'listening',
    difficulty: 'easy',
    questions: [
      {
        id: 'tcf-l1-q1',
        type: 'audio-response',
        text: 'Écoutez la conversation et répondez à la question: Où se trouvent les personnes qui parlent?',
        audioUrl: '/audio/tcf-listening-sample-1.mp3',
        correctAnswer: 'dans un café',
        explanation: 'Les personnes mentionnent commander un café et un croissant, et on peut entendre des bruits de tasses et de conversations en arrière-plan.'
      },
      {
        id: 'tcf-l1-q2',
        type: 'multiple-choice',
        text: 'Écoutez l\'annonce et choisissez la bonne réponse: À quelle heure part le train?',
        audioUrl: '/audio/tcf-listening-sample-2.mp3',
        options: ['14h30', '14h45', '15h30', '15h45'],
        correctAnswer: 1,
        explanation: 'L\'annonce indique clairement que le train partira à 14h45.'
      },
      {
        id: 'tcf-l1-q3',
        type: 'multiple-choice',
        text: 'Écoutez le message téléphonique et choisissez la bonne réponse: Pourquoi la personne appelle-t-elle?',
        audioUrl: '/audio/tcf-listening-sample-3.mp3',
        options: [
          'Pour annuler un rendez-vous',
          'Pour prendre un rendez-vous',
          'Pour changer la date d\'un rendez-vous',
          'Pour confirmer un rendez-vous'
        ],
        correctAnswer: 2,
        explanation: 'La personne explique qu\'elle ne peut pas venir à la date prévue et souhaite reporter le rendez-vous.'
      },
    ]
  },
  'tcf-reading-1': {
    id: 'tcf-reading-1',
    title: 'TCF Reading - Short Texts',
    description: 'Practice reading and understanding short texts in French.',
    duration: 25,
    section: 'reading',
    difficulty: 'easy',
    questions: [
      {
        id: 'tcf-r1-q1',
        type: 'multiple-choice',
        text: 'Lisez ce texte: "La médiathèque municipale sera exceptionnellement fermée ce samedi 20 juin pour cause d\'inventaire annuel." Quand la médiathèque sera-t-elle fermée?',
        options: [
          'Tous les samedis',
          'Uniquement le samedi 20 juin',
          'Pendant tout le mois de juin',
          'Chaque année au mois de juin'
        ],
        correctAnswer: 1,
        explanation: 'Le texte précise que la fermeture est exceptionnelle et concerne uniquement le samedi 20 juin.'
      },
      {
        id: 'tcf-r1-q2',
        type: 'multiple-choice',
        text: 'Dans un restaurant, vous voyez ce panneau: "Service continu de 11h à 23h". Cela signifie que:',
        options: [
          'Le restaurant est ouvert seulement pour le déjeuner et le dîner',
          'Le restaurant est fermé entre 11h et 23h',
          'Le restaurant sert des repas toute la journée sans interruption',
          'Le restaurant propose un service de 11 à 23 euros'
        ],
        correctAnswer: 2,
        explanation: '"Service continu" signifie que le service est assuré sans interruption pendant les heures indiquées.'
      },
      {
        id: 'tcf-r1-q3',
        type: 'multiple-choice',
        text: 'Lisez cette annonce: "À vendre: appartement 3 pièces, 65m², 2e étage, ascenseur, proche commerces et transports. Disponible immédiatement. Contact: 06.XX.XX.XX.XX" Que peut-on dire de cet appartement?',
        options: [
          'Il est situé au rez-de-chaussée',
          'Il est loin des magasins',
          'Il faut monter les escaliers pour y accéder',
          'On peut y emménager tout de suite'
        ],
        correctAnswer: 3,
        explanation: 'L\'annonce précise que l\'appartement est "disponible immédiatement", ce qui signifie qu\'on peut y emménager tout de suite.'
      },
    ]
  },
  'tcf-writing-1': {
    id: 'tcf-writing-1',
    title: 'TCF Writing - Personal Opinion',
    description: 'Practice writing a short text expressing your opinion on a topic.',
    duration: 30,
    section: 'writing',
    difficulty: 'medium',
    questions: [
      {
        id: 'tcf-w1-q1',
        type: 'text-input',
        text: 'Vous avez visité Paris la semaine dernière. Écrivez un email à un ami pour lui raconter votre séjour (80-100 mots).',
        correctAnswer: '',
        explanation: 'Cette question évalue votre capacité à raconter une expérience passée et à décrire vos impressions.'
      },
      {
        id: 'tcf-w1-q2',
        type: 'text-input',
        text: 'Selon vous, est-il important d\'apprendre plusieurs langues étrangères? Pourquoi? Donnez des exemples pour justifier votre opinion (100-120 mots).',
        correctAnswer: '',
        explanation: 'Cette question évalue votre capacité à exprimer et justifier une opinion personnelle.'
      },
    ]
  },
  'tef-listening-1': {
    id: 'tef-listening-1',
    title: 'TEF Listening - News Reports',
    description: 'Practice understanding news reports in French.',
    duration: 25,
    section: 'listening',
    difficulty: 'medium',
    questions: [
      {
        id: 'tef-l1-q1',
        type: 'audio-response',
        text: 'Écoutez le reportage et répondez à la question: Quel est le sujet principal de ce reportage?',
        audioUrl: '/audio/tef-listening-sample-1.mp3',
        correctAnswer: 'le changement climatique',
        explanation: 'Le reportage traite principalement des effets du changement climatique sur l\'agriculture.'
      },
      {
        id: 'tef-l1-q2',
        type: 'multiple-choice',
        text: 'Écoutez l\'interview et choisissez la bonne réponse: Quelle est la profession de la personne interviewée?',
        audioUrl: '/audio/tef-listening-sample-2.mp3',
        options: ['Médecin', 'Professeur', 'Journaliste', 'Chercheur'],
        correctAnswer: 3,
        explanation: 'La personne se présente comme chercheur en biologie marine au début de l\'interview.'
      },
    ]
  },
};

export default function ExamModulePage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [moduleData, setModuleData] = useState<ExamModuleData | null>(null);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  
  useEffect(() => {
    if (moduleId && typeof moduleId === 'string') {
      // In a real app, this would be an API call
      const data = examModulesData[moduleId];
      if (data) {
        setModuleData(data);
      } else {
        // Module not found, redirect to exam practice page
        router.push('/exam-practice');
      }
    }
  }, [moduleId, router]);
  
  const handleExamComplete = (results: ExamResults) => {
    setExamResults(results);
    // In a real app, you would save these results to a database
    console.log('Exam completed:', results);
  };
  
  if (!moduleData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{moduleData.title} | French Tutor AI</title>
        <meta name="description" content={moduleData.description} />
      </Head>
      
      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <Button 
            variant="link" 
            onClick={() => router.push('/exam-practice')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Exam Practice
          </Button>
        </div>
        
        <ExamModule
          moduleId={moduleData.id}
          title={moduleData.title}
          description={moduleData.description}
          section={moduleData.section}
          duration={moduleData.duration}
          questions={moduleData.questions}
          onComplete={handleExamComplete}
        />
      </div>
    </>
  );
}