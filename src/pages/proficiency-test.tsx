import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import apiClient from '@/services/api/apiClient';

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  level: CEFRLevel;
  explanation?: string;
}

export default function ProficiencyTest() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'intro' | 'test' | 'results'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    level: CEFRLevel;
    score: number;
    totalQuestions: number;
    breakdown: Record<CEFRLevel, { correct: number; total: number }>;
  } | null>(null);

  const questions: Question[] = [
    // A1 - Basic greetings, numbers, simple vocabulary (5 questions)
    {
      id: 1,
      text: "Comment allez-vous?",
      options: ["How old are you?", "How are you?", "Where are you going?", "What is your name?"],
      correctAnswer: 1,
      level: 'A1',
      explanation: "'Comment allez-vous?' is a formal way to ask 'How are you?' in French."
    },
    {
      id: 2,
      text: "Je ___ etudiant.",
      options: ["suis", "es", "est", "sommes"],
      correctAnswer: 0,
      level: 'A1',
      explanation: "'Je suis' means 'I am'. The verb 'etre' conjugates as 'suis' with 'je'."
    },
    {
      id: 3,
      text: "Combien font vingt et treize?",
      options: ["Trente-deux", "Trente-trois", "Vingt-trois", "Trente"],
      correctAnswer: 1,
      level: 'A1',
      explanation: "Vingt (20) + treize (13) = trente-trois (33)."
    },
    {
      id: 4,
      text: "Quel est le contraire de 'grand'?",
      options: ["Gros", "Petit", "Long", "Lourd"],
      correctAnswer: 1,
      level: 'A1',
      explanation: "'Petit' (small) is the opposite of 'grand' (big/tall)."
    },
    {
      id: 5,
      text: "Comment dit-on 'apple' en francais?",
      options: ["Une poire", "Une pomme", "Une peche", "Un ananas"],
      correctAnswer: 1,
      level: 'A1',
      explanation: "'Une pomme' means 'an apple' in French."
    },

    // A2 - Daily activities, past tense basics (5 questions)
    {
      id: 6,
      text: "Hier, je ___ au cinema avec mes amis.",
      options: ["vais", "allais", "suis alle", "irai"],
      correctAnswer: 2,
      level: 'A2',
      explanation: "'Suis alle' is the passe compose of 'aller', used for completed actions in the past."
    },
    {
      id: 7,
      text: "Tous les matins, Marie ___ a sept heures.",
      options: ["se leve", "se levait", "s'est levee", "se levera"],
      correctAnswer: 0,
      level: 'A2',
      explanation: "For habitual present actions, we use the present tense: 'se leve'."
    },
    {
      id: 8,
      text: "Il fait beau aujourd'hui. Nous ___ nous promener au parc.",
      options: ["allons", "avons", "sommes", "faisons"],
      correctAnswer: 0,
      level: 'A2',
      explanation: "'Nous allons' (we are going to) + infinitive expresses the near future."
    },
    {
      id: 9,
      text: "Completez: 'J'ai achete du pain ___ la boulangerie.'",
      options: ["dans", "a", "sur", "chez"],
      correctAnswer: 1,
      level: 'A2',
      explanation: "'A la boulangerie' is the correct preposition for 'at the bakery'."
    },
    {
      id: 10,
      text: "Qu'est-ce que tu as fait le weekend dernier?",
      options: ["What will you do this weekend?", "What are you doing this weekend?", "What did you do last weekend?", "What do you usually do on weekends?"],
      correctAnswer: 2,
      level: 'A2',
      explanation: "'Le weekend dernier' means 'last weekend' and 'as fait' is past tense."
    },

    // B1 - Subjunctive, complex sentences (5 questions)
    {
      id: 11,
      text: "Il faut que tu ___ tes devoirs avant de sortir.",
      options: ["fais", "fasses", "fait", "fera"],
      correctAnswer: 1,
      level: 'B1',
      explanation: "'Il faut que' requires the subjunctive mood: 'fasses' (from 'faire')."
    },
    {
      id: 12,
      text: "Bien qu'il ___ malade, il est venu au travail.",
      options: ["est", "etait", "soit", "serait"],
      correctAnswer: 2,
      level: 'B1',
      explanation: "'Bien que' (although) requires the subjunctive: 'soit' (from 'etre')."
    },
    {
      id: 13,
      text: "Si j'avais le temps, je ___ en vacances.",
      options: ["partirai", "partirais", "pars", "suis parti"],
      correctAnswer: 1,
      level: 'B1',
      explanation: "The conditional 'partirais' is used with 'si + imparfait' for hypothetical situations."
    },
    {
      id: 14,
      text: "Elle m'a dit qu'elle ___ le lendemain.",
      options: ["viendra", "viendrait", "vient", "est venue"],
      correctAnswer: 1,
      level: 'B1',
      explanation: "In reported speech with past tense, the future becomes conditional: 'viendrait'."
    },
    {
      id: 15,
      text: "Le film ___ j'ai parle etait excellent.",
      options: ["que", "dont", "ou", "qui"],
      correctAnswer: 1,
      level: 'B1',
      explanation: "'Dont' replaces 'de' + relative pronoun. 'Parler de' requires 'dont'."
    },

    // B2 - Idiomatic expressions, advanced grammar (5 questions)
    {
      id: 16,
      text: "Que signifie l'expression 'avoir le cafard'?",
      options: ["Avoir faim", "Etre deprime", "Etre en colere", "Avoir sommeil"],
      correctAnswer: 1,
      level: 'B2',
      explanation: "'Avoir le cafard' is an idiomatic expression meaning 'to feel down/depressed'."
    },
    {
      id: 17,
      text: "Il a beau ___ , personne ne l'ecoute.",
      options: ["parler", "parle", "parlant", "parlerait"],
      correctAnswer: 0,
      level: 'B2',
      explanation: "'Avoir beau' + infinitive means 'to do something in vain'. It requires an infinitive."
    },
    {
      id: 18,
      text: "Lequel de ces mots est un faux-ami en anglais?",
      options: ["Hopital", "Actuel", "Famille", "Papier"],
      correctAnswer: 1,
      level: 'B2',
      explanation: "'Actuel' means 'current/present' in French, not 'actual' (which is 'reel/veritable')."
    },
    {
      id: 19,
      text: "Completez: 'C'est un probleme ___ il faudra trouver une solution rapidement.'",
      options: ["pour lequel", "auquel", "duquel", "avec lequel"],
      correctAnswer: 1,
      level: 'B2',
      explanation: "'Trouver une solution a' requires 'auquel' (a + lequel) as the relative pronoun."
    },
    {
      id: 20,
      text: "Que signifie 'Qui vivra verra'?",
      options: ["He who lives will see (time will tell)", "Live and let live", "Life is short", "Those who see are alive"],
      correctAnswer: 0,
      level: 'B2',
      explanation: "This proverb literally means 'who will live will see' - equivalent to 'time will tell'."
    },

    // C1-C2 - Literary/formal French, nuanced vocabulary (5 questions)
    {
      id: 21,
      text: "Quel est le registre de la phrase: 'Il convient de souligner que cette problematique suscite un debat passionnant.'?",
      options: ["Familier", "Courant", "Soutenu/Formel", "Argotique"],
      correctAnswer: 2,
      level: 'C1',
      explanation: "'Il convient de', 'problematique', and 'suscite' are markers of formal/literary register."
    },
    {
      id: 22,
      text: "Si j'avais su, je ___ venu plus tot.",
      options: ["serais", "aurais", "etais", "fusse"],
      correctAnswer: 0,
      level: 'C1',
      explanation: "'Si + plus-que-parfait' requires the conditional past: 'serais venu' (conditionnel passe)."
    },
    {
      id: 23,
      text: "Que signifie 'nolens volens'?",
      options: ["Avec plaisir", "Sans raison", "Bon gre mal gre", "A contrecoeur uniquement"],
      correctAnswer: 2,
      level: 'C1',
      explanation: "'Nolens volens' is a Latin expression used in formal French meaning 'willy-nilly/like it or not'."
    },
    {
      id: 24,
      text: "Dans la phrase 'Eut-il ete prevenu, il aurait agi differemment', 'eut-il ete' est:",
      options: ["Un plus-que-parfait du subjonctif a valeur conditionnelle", "Un passe simple", "Un conditionnel passe", "Un futur anterieur"],
      correctAnswer: 0,
      level: 'C2',
      explanation: "This is a literary form of 'si on l'avait prevenu' - the plus-que-parfait du subjonctif used as a conditional."
    },
    {
      id: 25,
      text: "Quel est le sens figure de 'C'est un homme de paille'?",
      options: ["Un homme faible physiquement", "Un intermediaire servant de couverture", "Un agriculteur", "Un homme malhonnete"],
      correctAnswer: 1,
      level: 'C2',
      explanation: "'Homme de paille' (straw man) refers to a person who serves as a front for someone else's activities."
    },
  ];

  const handleStartTest = () => {
    setCurrentStep('test');
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results with the final answer included
      calculateResults([...newAnswers]);
    }
  };

  const calculateResults = async (finalAnswers: number[]) => {
    const breakdown: Record<CEFRLevel, { correct: number; total: number }> = {
      A1: { correct: 0, total: 0 },
      A2: { correct: 0, total: 0 },
      B1: { correct: 0, total: 0 },
      B2: { correct: 0, total: 0 },
      C1: { correct: 0, total: 0 },
      C2: { correct: 0, total: 0 },
    };

    let correctCount = 0;

    questions.forEach((question, index) => {
      breakdown[question.level].total++;
      if (finalAnswers[index] === question.correctAnswer) {
        correctCount++;
        breakdown[question.level].correct++;
      }
    });

    // Determine CEFR level based on performance at each level
    // The level is the highest where the user scores >= 60%
    let determinedLevel: CEFRLevel = 'A1';
    const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    for (const level of levelOrder) {

      const levelPct = breakdown[level].total > 0
        ? breakdown[level].correct / breakdown[level].total
        : 0;

      // If user got at least 60% at this level, they qualify for it
      if (levelPct >= 0.6) {
        determinedLevel = level;
      } else {
        // Stop progressing if they fail a level
        break;
      }
    }

    const resultData = {
      level: determinedLevel,
      score: correctCount,
      totalQuestions: questions.length,
      breakdown,
    };

    setResult(resultData);
    setCurrentStep('results');

    // Update user profile with determined level
    if (user) {
      setIsSubmitting(true);
      try {
        await apiClient.put('/user/profile', {
          level: determinedLevel,
        });
      } catch (err) {
        console.error('Failed to update user level:', err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'text-green-500';
      case 'A2': return 'text-green-600';
      case 'B1': return 'text-yellow-500';
      case 'B2': return 'text-yellow-600';
      case 'C1': return 'text-red-500';
      case 'C2': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'A1': case 'A2': return 'bg-green-100 text-green-800';
      case 'B1': case 'B2': return 'bg-yellow-100 text-yellow-800';
      case 'C1': case 'C2': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelDescription = (level: CEFRLevel) => {
    switch (level) {
      case 'A1': return "You're at the very beginning of your French journey. Focus on basic greetings, simple vocabulary, numbers, and everyday phrases. Practice introducing yourself and asking simple questions.";
      case 'A2': return "You can handle basic daily interactions in French. Work on expanding your vocabulary for everyday situations, learn the past tense (passe compose), and practice talking about your daily routine and activities.";
      case 'B1': return "You have a solid foundation in French. Focus on mastering the subjunctive mood, complex sentence structures, reported speech, and relative pronouns. Practice expressing opinions and hypothetical situations.";
      case 'B2': return "You have a strong command of French. Work on idiomatic expressions, advanced grammar structures like 'avoir beau', compound relative pronouns, and understanding French proverbs and nuanced vocabulary.";
      case 'C1': return "Your French is at an advanced level. Refine your understanding of formal/literary register, Latin expressions used in French, complex conditional structures, and nuanced vocabulary distinctions.";
      case 'C2': return "You have a near-native command of French. Continue to explore literary French, archaic grammatical forms like the subjonctif plus-que-parfait, and figurative/idiomatic language at the highest level.";
    }
  };

  const renderIntro = () => (
    <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">French Proficiency Test</h1>
      <p className="mb-6 text-lg text-gray-600">
        This comprehensive assessment will determine your CEFR level (A1 through C2) in French.
        Answer the following questions to the best of your ability - they get progressively harder.
      </p>

      <div className="p-4 mb-6 border rounded-lg bg-primary-50 border-primary-100">
        <h2 className="mb-2 text-lg font-semibold text-primary-800">What to expect:</h2>
        <ul className="space-y-1 list-disc list-inside text-primary-700">
          <li>25 questions spanning A1 to C2 levels</li>
          <li>Multiple choice format with progressive difficulty</li>
          <li>No time limit (but try to answer naturally)</li>
          <li>Instant CEFR level assessment with detailed breakdown</li>
          <li>Your level will be saved to your profile</li>
        </ul>
      </div>

      <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">CEFR Level Overview</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-green-50 rounded"><span className="font-bold text-green-700">A1</span> - Beginner</div>
          <div className="p-2 bg-green-50 rounded"><span className="font-bold text-green-700">A2</span> - Elementary</div>
          <div className="p-2 bg-yellow-50 rounded"><span className="font-bold text-yellow-700">B1</span> - Intermediate</div>
          <div className="p-2 bg-yellow-50 rounded"><span className="font-bold text-yellow-700">B2</span> - Upper Intermediate</div>
          <div className="p-2 bg-red-50 rounded"><span className="font-bold text-red-700">C1</span> - Advanced</div>
          <div className="p-2 bg-red-50 rounded"><span className="font-bold text-red-700">C2</span> - Mastery</div>
        </div>
      </div>

      <Button size="lg" onClick={handleStartTest} className="w-full">
        Start Assessment
      </Button>
    </div>
  );

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    const progressPct = ((currentQuestionIndex) / questions.length) * 100;

    return (
      <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getLevelBadgeColor(question.level)}`}>
              {question.level}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 transition-all duration-300 rounded-full bg-primary-600"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <h2 className="mb-6 text-xl font-bold text-gray-800">{question.text}</h2>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full p-4 text-left transition-colors border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <span className={`inline-block w-6 h-6 mr-3 text-sm font-medium text-center rounded-full ${
                selectedAnswer === index ? 'bg-primary-200 text-primary-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <span className="text-sm text-gray-500 self-center">
            {selectedAnswer === null ? 'Select an answer to continue' : ''}
          </span>
          <Button
            onClick={handleConfirmAnswer}
            disabled={selectedAnswer === null}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
          </Button>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!result) return null;

    const levelOrder: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    return (
      <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 rounded-full bg-primary-100 text-primary-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Assessment Complete!</h1>
          <p className="text-lg text-gray-600">
            Based on your answers, we&apos;ve determined your CEFR level.
          </p>
          {isSubmitting && (
            <p className="mt-2 text-sm text-gray-500">Saving your level to your profile...</p>
          )}
        </div>

        <div className="p-6 mb-8 rounded-lg bg-gray-50">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-700">Your French level is:</h2>
            <p className={`text-5xl font-bold mb-2 ${getLevelColor(result.level)}`}>
              {result.level}
            </p>
            <p className="mb-4 text-lg text-gray-600">
              {result.level === 'A1' || result.level === 'A2' ? 'Beginner' :
               result.level === 'B1' || result.level === 'B2' ? 'Intermediate' : 'Advanced'}
            </p>
            <p className="text-gray-600">
              You answered <span className="font-bold">{result.score}</span> out of <span className="font-bold">{result.totalQuestions}</span> questions correctly ({Math.round((result.score / result.totalQuestions) * 100)}%).
            </p>
          </div>

          {/* Level breakdown */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="mb-4 font-medium text-gray-700">Performance by Level:</h3>
            <div className="space-y-3">
              {levelOrder.map((level) => {
                const data = result.breakdown[level];
                const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                const isCurrentLevel = level === result.level;

                return (
                  <div key={level} className={`p-3 rounded-lg ${isCurrentLevel ? 'bg-primary-50 border border-primary-200' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold mr-2 ${getLevelBadgeColor(level)}`}>
                          {level}
                        </span>
                        {isCurrentLevel && (
                          <span className="text-xs font-medium text-primary-600">Your level</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {data.correct}/{data.total} correct ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          pct >= 60 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-500' : 'bg-red-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="mb-3 font-medium text-gray-700">Recommendations:</h3>
            <p className="text-gray-600">
              {getLevelDescription(result.level)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/lessons" className="flex-1">
            <Button size="lg" className="w-full">
              Browse Lessons for {result.level}
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="flex-1" onClick={handleStartTest}>
            Retake Test
          </Button>
        </div>
        <div className="mt-4">
          <Link href="/" className="block">
            <Button size="lg" variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>French Proficiency Test | French Tutor AI</title>
        <meta name="description" content="Take our comprehensive French proficiency test to determine your CEFR level (A1-C2) and get personalized learning recommendations" />
      </Head>

      <div className="container px-4 py-12 mx-auto">
        {currentStep === 'intro' && renderIntro()}
        {currentStep === 'test' && renderQuestion()}
        {currentStep === 'results' && renderResults()}
      </div>
    </>
  );
}
