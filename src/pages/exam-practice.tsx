import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import AudioRecorder from '@/components/exam/AudioRecorder';
import DifficultyFilter from '@/components/exam/DifficultyFilter';
import ProgressTracker from '@/components/exam/ProgressTracker';
import { examService } from '@/services';
import { formatTime } from '@/utils/time';
import { levelForDifficulty } from '@/lib/curriculum';

type ExamType = 'tcf' | 'tef';
type ExamSection = 'listening' | 'reading' | 'writing' | 'speaking';

interface ExamQuestion {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: number;
  type: 'multiple-choice' | 'written' | 'speaking';
  prompt?: string;
  audioText?: string; // French script rendered as TTS audio for listening questions
}

interface ExamModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  section: ExamSection;
  difficulty: 'easy' | 'medium' | 'hard';
  questions?: ExamQuestion[];
}

// Fallback exam modules when API returns empty
const fallbackExamModules: Record<ExamType, ExamModule[]> = {
  tcf: [
    // TCF Listening
    {
      id: 'tcf-listening-1',
      title: 'TCF Listening - Everyday Conversations',
      description: 'Understand short everyday conversations and announcements',
      duration: 15,
      section: 'listening',
      difficulty: 'easy',
      questions: [
        { id: 'tcf-l1-q1', text: "Ecoutez le dialogue. Que propose la femme?", options: ["De prendre un cafe", "D'aller au cinema", "De visiter un musee", "De faire les courses"], correctAnswer: 0, type: 'multiple-choice', audioText: "La femme dit : Tu as un peu de temps cet après-midi ? On pourrait prendre un café ensemble au nouveau salon près de la gare. L'homme répond : Bonne idée, je finis le travail à quinze heures, on se retrouve là-bas." },
        { id: 'tcf-l1-q2', text: "Ecoutez l'annonce. A quelle heure part le train pour Lyon?", options: ["14h30", "14h45", "15h00", "15h30"], correctAnswer: 1, type: 'multiple-choice', audioText: "Votre attention s'il vous plaît. Le train T G V à destination de Lyon partira à quatorze heures quarante-cinq, voie numéro trois. Nous rappelons aux voyageurs que le compostage des billets est obligatoire. Bon voyage." },
        { id: 'tcf-l1-q3', text: "Ecoutez la conversation. Ou se passe cette scene?", options: ["Dans un restaurant", "Dans une pharmacie", "A la poste", "Au supermarche"], correctAnswer: 0, type: 'multiple-choice', audioText: "Le serveur demande : Bonsoir, vous avez choisi ? La femme répond : Oui, je vais prendre le menu du jour avec le poisson, s'il vous plaît. Le serveur dit : Très bon choix. Et comme boisson ? La femme répond : Une carafe d'eau, merci." },
        { id: 'tcf-l1-q4', text: "Quel est le probleme de l'homme?", options: ["Il a perdu ses cles", "Il est en retard", "Il a mal a la tete", "Il a faim"], correctAnswer: 1, type: 'multiple-choice', audioText: "L'homme dit : Oh non, regarde l'heure ! Ma réunion commence dans dix minutes et je suis encore loin du bureau. La femme répond : Prends le métro, c'est plus rapide à cette heure-ci." },
      ]
    },
    {
      id: 'tcf-listening-2',
      title: 'TCF Listening - News & Reports',
      description: 'Comprehend news broadcasts and longer audio segments',
      duration: 20,
      section: 'listening',
      difficulty: 'hard',
      questions: [
        { id: 'tcf-l2-q1', text: "D'apres le reportage, quel est le sujet principal?", options: ["L'economie francaise", "Le changement climatique", "Les elections municipales", "La reforme de l'education"], correctAnswer: 2, type: 'multiple-choice', audioText: "À trois semaines des élections municipales, la campagne s'intensifie dans tout le pays. Les candidats multiplient les réunions publiques et présentent leurs programmes aux habitants. Interrogé ce matin, un candidat a proposé d'investir massivement dans la recherche et l'innovation locales afin de créer des emplois durables dans la commune. Selon les premiers sondages, les électeurs se montrent confiants, et la participation s'annonce en hausse, un signe encourageant pour la démocratie locale." },
        { id: 'tcf-l2-q2', text: "Selon l'intervenant, quelle solution est proposee?", options: ["Augmenter les impots", "Reduire les depenses", "Investir dans la recherche", "Changer la loi"], correctAnswer: 2, type: 'multiple-choice' },
        { id: 'tcf-l2-q3', text: "Quel est le ton general de ce reportage?", options: ["Optimiste", "Pessimiste", "Neutre", "Ironique"], correctAnswer: 0, type: 'multiple-choice' },
      ]
    },
    // TCF Reading
    {
      id: 'tcf-reading-1',
      title: 'TCF Reading - Signs & Notices',
      description: 'Understand common signs, menus, and short notices',
      duration: 15,
      section: 'reading',
      difficulty: 'easy',
      questions: [
        { id: 'tcf-r1-q1', text: "\"Service continu de 11h a 23h.\" Cela signifie que:", options: ["Le restaurant est ouvert seulement pour le dejeuner", "Le restaurant est ferme entre 11h et 23h", "Le restaurant sert des repas toute la journee sans interruption", "Le restaurant propose un service de 11 a 23 euros"], correctAnswer: 2, type: 'multiple-choice' },
        { id: 'tcf-r1-q2', text: "\"Interdit de stationner sauf riverains.\" Qui peut se garer ici?", options: ["Tout le monde", "Personne", "Les habitants du quartier", "Les livraisons uniquement"], correctAnswer: 2, type: 'multiple-choice' },
        { id: 'tcf-r1-q3', text: "\"Soldes: jusqu'a -50% sur une selection d'articles.\" Que signifie ce panneau?", options: ["Tous les articles sont a moitie prix", "Certains articles ont des reductions", "Le magasin ferme bientot", "Les prix ont augmente"], correctAnswer: 1, type: 'multiple-choice' },
      ]
    },
    {
      id: 'tcf-reading-2',
      title: 'TCF Reading - Articles & Essays',
      description: 'Analyze complex texts, arguments, and literary excerpts',
      duration: 25,
      section: 'reading',
      difficulty: 'hard',
      questions: [
        { id: 'tcf-r2-q1', text: "\"La democratisation de l'enseignement superieur n'a pas tenu toutes ses promesses.\" L'auteur veut dire que:", options: ["L'enseignement superieur est trop democratique", "Les resultats sont en dessous des attentes", "Tout le monde a acces a l'universite", "Les promesses ont ete tenues"], correctAnswer: 1, type: 'multiple-choice' },
        { id: 'tcf-r2-q2', text: "Quel est l'argument principal de cet extrait?", options: ["L'education doit etre gratuite", "La qualite prime sur la quantite", "Les reformes sont inutiles", "Le systeme est parfait"], correctAnswer: 1, type: 'multiple-choice' },
        { id: 'tcf-r2-q3', text: "Le mot \"neanmoins\" dans ce contexte introduit:", options: ["Une cause", "Une consequence", "Une opposition", "Une comparaison"], correctAnswer: 2, type: 'multiple-choice' },
      ]
    },
    // TCF Writing
    {
      id: 'tcf-writing-1',
      title: 'TCF Writing - Short Messages',
      description: 'Write short messages, emails, and notes in French',
      duration: 20,
      section: 'writing',
      difficulty: 'easy',
      questions: [
        { id: 'tcf-w1-q1', text: "Ecrivez un email a un ami pour l'inviter a votre anniversaire. Incluez la date, l'heure et le lieu. (60-80 mots)", type: 'written', prompt: "Cher/Chere ami(e)..." },
        { id: 'tcf-w1-q2', text: "Vous avez trouve un objet perdu dans le parc. Ecrivez une annonce pour le rendre a son proprietaire. (40-60 mots)", type: 'written', prompt: "Objet trouve..." },
      ]
    },
    {
      id: 'tcf-writing-2',
      title: 'TCF Writing - Argumentative Essay',
      description: 'Write structured argumentative essays on social topics',
      duration: 45,
      section: 'writing',
      difficulty: 'hard',
      questions: [
        { id: 'tcf-w2-q1', text: "\"Les reseaux sociaux ont un impact negatif sur les relations humaines.\" Discutez cette affirmation en presentant des arguments pour et contre. (200-250 mots)", type: 'written', prompt: "Introduction..." },
        { id: 'tcf-w2-q2', text: "Pensez-vous que le teletravail devrait devenir la norme? Argumentez votre position. (180-220 mots)", type: 'written', prompt: "De nos jours..." },
      ]
    },
    // TCF Speaking
    {
      id: 'tcf-speaking-1',
      title: 'TCF Speaking - Self Introduction',
      description: 'Practice introducing yourself and describing daily life',
      duration: 10,
      section: 'speaking',
      difficulty: 'easy',
      questions: [
        { id: 'tcf-s1-q1', text: "Presentez-vous: votre nom, votre age, votre nationalite, et vos loisirs. (1-2 minutes)", type: 'speaking' },
        { id: 'tcf-s1-q2', text: "Decrivez votre journee typique du matin au soir. (1-2 minutes)", type: 'speaking' },
      ]
    },
    {
      id: 'tcf-speaking-2',
      title: 'TCF Speaking - Opinion & Debate',
      description: 'Express and defend opinions on complex topics',
      duration: 15,
      section: 'speaking',
      difficulty: 'hard',
      questions: [
        { id: 'tcf-s2-q1', text: "Choisissez un sujet d'actualite et presentez votre opinion de maniere structuree. (2-3 minutes)", type: 'speaking' },
        { id: 'tcf-s2-q2', text: "\"L'intelligence artificielle va remplacer de nombreux emplois.\" Etes-vous d'accord? Argumentez. (2-3 minutes)", type: 'speaking' },
      ]
    },
  ],
  tef: [
    // TEF Listening
    {
      id: 'tef-listening-1',
      title: 'TEF Listening - Daily Situations',
      description: 'Understand conversations in everyday French situations',
      duration: 15,
      section: 'listening',
      difficulty: 'easy',
      questions: [
        { id: 'tef-l1-q1', text: "Ecoutez l'annonce. A quelle heure ferme le magasin?", options: ["18h00", "19h00", "19h30", "20h00"], correctAnswer: 2, type: 'multiple-choice', audioText: "Chers clients, votre magasin ferme ses portes dans quinze minutes. Il est dix-neuf heures quinze ; le magasin fermera à dix-neuf heures trente précises. Merci de vous diriger dès maintenant vers les caisses. Nous vous remercions de votre visite et vous souhaitons une bonne soirée." },
        { id: 'tef-l1-q2', text: "Que demande le client au serveur?", options: ["L'addition", "Le menu", "Un verre d'eau", "Une table pour deux"], correctAnswer: 1, type: 'multiple-choice', audioText: "Le client dit : Excusez-moi, monsieur ! Pourrions-nous avoir le menu, s'il vous plaît ? Le serveur répond : Bien sûr, je vous l'apporte tout de suite. Aujourd'hui, nous avons aussi des suggestions du chef." },
        { id: 'tef-l1-q3', text: "Ou va la femme apres le travail?", options: ["Chez elle", "Au gymnase", "Au supermarche", "Chez le medecin"], correctAnswer: 2, type: 'multiple-choice', audioText: "L'homme demande : Tu rentres directement à la maison après le travail ce soir ? La femme répond : Non, je dois d'abord passer au supermarché, il ne reste plus rien dans le frigo. Je rentrerai vers dix-neuf heures." },
        { id: 'tef-l1-q4', text: "Pourquoi l'homme telephone-t-il?", options: ["Pour prendre rendez-vous", "Pour annuler une reservation", "Pour se plaindre", "Pour commander un produit"], correctAnswer: 0, type: 'multiple-choice', audioText: "L'homme dit : Bonjour madame, je vous appelle pour prendre rendez-vous avec le docteur Martin, si possible cette semaine. La secrétaire répond : Oui, il reste une place jeudi à dix heures. Cela vous convient ? L'homme dit : Parfait, jeudi à dix heures, merci beaucoup." },
      ]
    },
    {
      id: 'tef-listening-2',
      title: 'TEF Listening - Interviews & Debates',
      description: 'Follow complex discussions and radio interviews',
      duration: 25,
      section: 'listening',
      difficulty: 'hard',
      questions: [
        { id: 'tef-l2-q1', text: "Quel est le theme principal de cette interview?", options: ["La politique internationale", "L'environnement", "L'education numerique", "La sante publique"], correctAnswer: 2, type: 'multiple-choice', audioText: "La journaliste annonce : Nous recevons aujourd'hui un spécialiste de l'éducation numérique à l'école. L'intervenant explique : Le numérique offre des possibilités pédagogiques réelles, mais je reste critique : sans formation sérieuse des enseignants, les tablettes et les logiciels ne servent à rien. Je ne dis pas qu'il faut tout arrêter, au contraire ; je propose d'avancer étape par étape, en évaluant chaque dispositif. Regardez la comparaison internationale : la Finlande et la Corée du Sud ont réussi leur transition parce qu'elles ont d'abord investi dans la pédagogie, pas dans le matériel." },
        { id: 'tef-l2-q2', text: "Quelle est la position de l'intervenant?", options: ["Favorable sans reserve", "Critique mais constructif", "Totalement oppose", "Indifferent"], correctAnswer: 1, type: 'multiple-choice' },
        { id: 'tef-l2-q3', text: "Quel exemple l'intervenant utilise-t-il pour illustrer son propos?", options: ["Une etude scientifique", "Une experience personnelle", "Un cas historique", "Une comparaison internationale"], correctAnswer: 3, type: 'multiple-choice' },
      ]
    },
    // TEF Reading
    {
      id: 'tef-reading-1',
      title: 'TEF Reading - Practical Documents',
      description: 'Read and understand practical French documents and instructions',
      duration: 15,
      section: 'reading',
      difficulty: 'easy',
      questions: [
        { id: 'tef-r1-q1', text: "\"La mediatheque municipale sera exceptionnellement fermee ce samedi 20 juin pour cause d'inventaire annuel.\" Quand la mediatheque sera-t-elle fermee?", options: ["Tous les samedis", "Uniquement le samedi 20 juin", "Pendant tout le mois de juin", "Chaque annee au mois de juin"], correctAnswer: 1, type: 'multiple-choice' },
        { id: 'tef-r1-q2', text: "\"Priere de ne pas deranger entre 12h et 14h.\" Que doit-on faire?", options: ["Ne pas entrer dans le batiment", "Eviter de faire du bruit pendant ces heures", "Quitter les lieux avant midi", "Revenir apres 14h"], correctAnswer: 1, type: 'multiple-choice' },
        { id: 'tef-r1-q3', text: "\"Tarif reduit pour les etudiants sur presentation de la carte.\" Que faut-il montrer?", options: ["Une carte d'identite", "Une carte etudiant", "Un passeport", "Une carte bancaire"], correctAnswer: 1, type: 'multiple-choice' },
      ]
    },
    {
      id: 'tef-reading-2',
      title: 'TEF Reading - Academic Texts',
      description: 'Analyze academic and professional French texts',
      duration: 30,
      section: 'reading',
      difficulty: 'hard',
      questions: [
        { id: 'tef-r2-q1', text: "Dans ce texte, l'expression \"force est de constater\" signifie:", options: ["Il faut admettre", "On peut ignorer", "C'est surprenant", "Il est faux de dire"], correctAnswer: 0, type: 'multiple-choice' },
        { id: 'tef-r2-q2', text: "L'auteur utilise le conditionnel pour exprimer:", options: ["Une certitude", "Une hypothese", "Un ordre", "Un regret"], correctAnswer: 1, type: 'multiple-choice' },
        { id: 'tef-r2-q3', text: "Quelle est la these defendue dans cet extrait?", options: ["Le progres technique est toujours benefique", "La modernisation a des consequences imprevues", "La tradition doit etre preservee a tout prix", "L'innovation est impossible"], correctAnswer: 1, type: 'multiple-choice' },
      ]
    },
    // TEF Writing
    {
      id: 'tef-writing-1',
      title: 'TEF Writing - Formal Letters',
      description: 'Write formal letters and professional correspondence',
      duration: 20,
      section: 'writing',
      difficulty: 'medium',
      questions: [
        { id: 'tef-w1-q1', text: "Ecrivez une lettre de motivation pour un poste de stagiaire dans une entreprise francaise. (100-120 mots)", type: 'written', prompt: "Madame, Monsieur..." },
        { id: 'tef-w1-q2', text: "Vous souhaitez vous inscrire a un cours de francais. Ecrivez au directeur de l'ecole pour demander des informations. (80-100 mots)", type: 'written', prompt: "Monsieur le Directeur..." },
      ]
    },
    {
      id: 'tef-writing-2',
      title: 'TEF Writing - Summary & Analysis',
      description: 'Summarize texts and write analytical responses',
      duration: 40,
      section: 'writing',
      difficulty: 'hard',
      questions: [
        { id: 'tef-w2-q1', text: "Resumez le texte suivant en identifiant les idees principales et la structure argumentative. (150-200 mots)", type: 'written', prompt: "Ce texte traite de..." },
        { id: 'tef-w2-q2', text: "Redigez un essai structure sur le theme: \"La culture est-elle un luxe ou une necessite?\" (200-250 mots)", type: 'written', prompt: "La question de la culture..." },
      ]
    },
    // TEF Speaking
    {
      id: 'tef-speaking-1',
      title: 'TEF Speaking - Information Exchange',
      description: 'Ask and answer questions about familiar topics',
      duration: 10,
      section: 'speaking',
      difficulty: 'easy',
      questions: [
        { id: 'tef-s1-q1', text: "Decrivez votre ville ou votre quartier. Qu'est-ce que vous aimez et qu'est-ce que vous changeriez? (1-2 minutes)", type: 'speaking' },
        { id: 'tef-s1-q2', text: "Parlez de votre dernier voyage ou vacances. Ou etes-vous alle(e) et qu'avez-vous fait? (1-2 minutes)", type: 'speaking' },
      ]
    },
    {
      id: 'tef-speaking-2',
      title: 'TEF Speaking - Persuasive Argument',
      description: 'Convince and persuade through structured argumentation',
      duration: 15,
      section: 'speaking',
      difficulty: 'hard',
      questions: [
        { id: 'tef-s2-q1', text: "Vous voulez convaincre votre employeur d'adopter le teletravail. Presentez vos arguments. (2-3 minutes)", type: 'speaking' },
        { id: 'tef-s2-q2', text: "Debattez du sujet suivant: \"Faut-il interdire les telephones portables dans les ecoles?\" (2-3 minutes)", type: 'speaking' },
      ]
    },
  ]
};

export default function ExamPracticePage() {
  const [selectedExam, setSelectedExam] = useState<ExamType>('tcf');
  const [selectedSection, setSelectedSection] = useState<ExamSection | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [, setAudioBlob] = useState<Blob | null>(null);
  const [, setAudioUrl] = useState<string>('');
  const [examModules, setExamModules] = useState<ExamModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<ExamModule | null>(null);
  const [moduleAnswers, setModuleAnswers] = useState<Record<string, number | string>>({});
  const [showModuleResults, setShowModuleResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examProgress, setExamProgress] = useState({
    overall: 0,
    listening: 0,
    reading: 0,
    writingSpeaking: 0
  });

  useEffect(() => {
    const fetchExamModules = async () => {
      try {
        const response = await fetch(`/api/exam/modules?examType=${selectedExam}`);
        const payload = await response.json();

        if (payload?.success && Array.isArray(payload.data) && payload.data.length > 0) {
          setExamModules(payload.data);
          return;
        }
      } catch {
        // Fall through to fallback data
      }

      // Use fallback hardcoded modules when API returns empty or fails
      setExamModules(fallbackExamModules[selectedExam]);
    };

    fetchExamModules();
  }, [selectedExam]);

  // Fetch actual exam results for progress computation
  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const results = await examService.getExamResults();
        if (results && results.length > 0) {
          const totalModules = examModules.length || 1;
          const completedModuleIds = new Set(results.map(r => r.moduleId));
          const completedCount = completedModuleIds.size;

          const listeningModules = examModules.filter(m => m.section === 'listening');
          const readingModules = examModules.filter(m => m.section === 'reading');
          const wsModules = examModules.filter(m => m.section === 'writing' || m.section === 'speaking');

          const calcPct = (sectionModules: ExamModule[]) => {
            if (sectionModules.length === 0) return 0;
            const completed = sectionModules.filter(m => completedModuleIds.has(m.id)).length;
            return Math.round((completed / sectionModules.length) * 100);
          };

          setExamProgress({
            overall: Math.round((completedCount / totalModules) * 100),
            listening: calcPct(listeningModules),
            reading: calcPct(readingModules),
            writingSpeaking: calcPct(wsModules)
          });
        }
      } catch {
        // Keep default 0% if results can't be fetched
      }
    };

    if (examModules.length > 0) {
      fetchExamResults();
    }
  }, [examModules]);
  
  const filteredModules = examModules.filter(module => {
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
  
  const handleSelectModule = (mod: ExamModule) => {
    setSelectedModule(mod);
    setModuleAnswers({});
    setShowModuleResults(false);
    // Guard against non-numeric duration: NaN would freeze the countdown
    setTimeLeft(Number.isFinite(mod.duration) && mod.duration > 0 ? mod.duration * 60 : null);
  };

  const handleModuleAnswer = (questionId: string, answer: number | string) => {
    setModuleAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getModuleScore = () => {
    if (!selectedModule?.questions) return { correct: 0, total: 0 };
    const mcQuestions = selectedModule.questions.filter(q => q.type === 'multiple-choice');
    const correct = mcQuestions.filter(q => moduleAnswers[q.id] === q.correctAnswer).length;
    return { correct, total: mcQuestions.length };
  };

  const handleSubmitModule = () => {
    if (!selectedModule || showModuleResults) return;
    setShowModuleResults(true);

    // Persist graded (multiple-choice) attempts; written/speaking modules are
    // recorded locally until AI scoring exists for them.
    const { correct, total } = getModuleScore();
    if (total === 0) return;

    const elapsed = timeLeft !== null
      ? Math.max(0, selectedModule.duration * 60 - timeLeft)
      : selectedModule.duration * 60;

    examService.submitExamResults(
      {
        moduleId: selectedModule.id,
        score: Math.round((correct / total) * 100),
        totalQuestions: selectedModule.questions?.length || 0,
        answers: (selectedModule.questions || []).map(q => moduleAnswers[q.id] ?? ''),
        timeSpent: elapsed,
        completedAt: new Date()
      },
      {
        section: selectedModule.section,
        level: levelForDifficulty(selectedModule.difficulty)
      }
    ).catch(() => { /* the service stores results locally on failure */ });
  };

  // Countdown while a module is in progress; auto-submit when time runs out
  useEffect(() => {
    if (!selectedModule || showModuleResults || timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmitModule();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(s => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showModuleResults, selectedModule]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <ProtectedRoute>
      <Head>
        <title>Exam Practice | French Tutor AI</title>
        <meta name="description" content="Practice for TCF and TEF exams with AI-powered tools" />
      </Head>

      <div className="max-w-6xl px-4 mx-auto">
        {/* Module Detail View */}
        {selectedModule && selectedModule.questions && selectedModule.questions.length > 0 ? (
          <div>
            <Button
              variant="outline"
              onClick={() => setSelectedModule(null)}
              className="flex items-center mb-6"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Modules
            </Button>

            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-bold text-gray-800">{selectedModule.title}</h1>
              <p className="text-gray-600">{selectedModule.description}</p>
              <div className="flex gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSectionColor(selectedModule.section)}`}>
                  {selectedModule.section.charAt(0).toUpperCase() + selectedModule.section.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedModule.difficulty)}`}>
                  {selectedModule.difficulty.charAt(0).toUpperCase() + selectedModule.difficulty.slice(1)}
                </span>
                <span className="px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                  {selectedModule.duration} min
                </span>
                {!showModuleResults && timeLeft !== null && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${timeLeft <= 60 ? 'bg-red-100 text-red-800' : 'bg-indigo-100 text-indigo-800'}`}>
                    Temps restant : {formatTime(timeLeft)}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {selectedModule.questions.map((question, qIndex) => (
                <div key={question.id} className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center mb-3">
                    <span className="flex items-center justify-center w-8 h-8 mr-3 text-sm font-bold text-white rounded-full bg-indigo-600">
                      {qIndex + 1}
                    </span>
                    <h3 className="text-lg font-medium text-gray-800">{question.text}</h3>
                  </div>

                  {question.audioText && (
                    <div className="mb-4 ml-11">
                      <audio
                        controls
                        preload="none"
                        src={`/api/tts?text=${encodeURIComponent(question.audioText)}&voice=nova`}
                        className="w-full max-w-md"
                      >
                        Votre navigateur ne supporte pas la lecture audio.
                      </audio>
                    </div>
                  )}

                  {question.type === 'multiple-choice' && question.options && (
                    <div className="ml-11 space-y-2">
                      {question.options.map((option, oIndex) => {
                        const isSelected = moduleAnswers[question.id] === oIndex;
                        const isCorrect = showModuleResults && oIndex === question.correctAnswer;
                        const isWrong = showModuleResults && isSelected && oIndex !== question.correctAnswer;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => !showModuleResults && handleModuleAnswer(question.id, oIndex)}
                            disabled={showModuleResults}
                            className={`w-full p-3 text-left rounded-lg border transition-colors ${
                              isCorrect
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : isWrong
                                ? 'border-red-500 bg-red-50 text-red-800'
                                : isSelected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <span className="inline-block w-6 h-6 mr-3 text-sm font-medium text-center rounded-full bg-gray-100">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {question.type === 'written' && (
                    <div className="ml-11">
                      <textarea
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={question.prompt || "Ecrivez votre reponse ici..."}
                        value={(moduleAnswers[question.id] as string) || ''}
                        onChange={(e) => handleModuleAnswer(question.id, e.target.value)}
                        disabled={showModuleResults}
                      />
                      <div className="mt-1 text-sm text-gray-500">
                        {((moduleAnswers[question.id] as string) || '').split(/\s+/).filter(Boolean).length} words
                      </div>
                    </div>
                  )}

                  {question.type === 'speaking' && (
                    <div className="ml-11">
                      <AudioRecorder
                        maxDuration={180}
                        onRecordingComplete={(blob, url) => {
                          setAudioBlob(blob);
                          setAudioUrl(url);
                          handleModuleAnswer(question.id, url);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!showModuleResults ? (
              <div className="flex justify-center mt-8">
                <Button size="lg" onClick={handleSubmitModule}>
                  Submit Answers
                </Button>
              </div>
            ) : (
              <div className="p-6 mt-8 text-center bg-white rounded-lg shadow-md">
                <h2 className="mb-2 text-xl font-bold text-gray-800">Results</h2>
                {(() => {
                  const { correct, total } = getModuleScore();
                  return total > 0 ? (
                    <>
                      <p className="text-lg text-gray-700">
                        You scored <span className="font-bold text-indigo-600">{correct}</span> out of <span className="font-bold">{total}</span> on multiple choice questions.
                      </p>
                      <p className="mt-2 text-gray-600">
                        {correct / total >= 0.8 ? 'Excellent work!' : correct / total >= 0.5 ? 'Good effort! Keep practicing.' : 'Keep studying and try again.'}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg text-gray-700">Your written and speaking responses have been recorded.</p>
                  );
                })()}
                <div className="flex justify-center gap-4 mt-6">
                  <Button variant="outline" onClick={() => setSelectedModule(null)}>
                    Back to Modules
                  </Button>
                  <Button onClick={() => { setModuleAnswers({}); setShowModuleResults(false); }}>
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
        <>
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
            overallCompletion={examProgress.overall}
            progressData={[
              { section: 'Listening', percentage: examProgress.listening, color: 'bg-blue-50' },
              { section: 'Reading', percentage: examProgress.reading, color: 'bg-green-50' },
              { section: 'Writing & Speaking', percentage: examProgress.writingSpeaking, color: 'bg-purple-50' }
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

                  {module.questions && (
                    <span className="px-3 py-1 text-xs font-medium text-indigo-800 bg-indigo-100 rounded-full">
                      {module.questions.length} questions
                    </span>
                  )}
                </div>

                {module.questions && module.questions.length > 0 ? (
                  <Button className="w-full" onClick={() => handleSelectModule(module)}>
                    Start Practice
                  </Button>
                ) : (
                  <Link href={`/exam-practice/${module.id}`}>
                    <Button className="w-full">
                      Start Practice
                    </Button>
                  </Link>
                )}
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
            {filteredModules.length > 0 ? (
              // Fallback modules carry inline questions and their synthetic ids
              // don't exist in the DB, so start them locally; DB-backed modules
              // deep-link to the module page which fetches their questions.
              filteredModules[0].questions?.length ? (
                <Button size="lg" onClick={() => handleSelectModule(filteredModules[0])}>
                  Take Full Practice Test
                </Button>
              ) : (
                <Link href={`/exam-practice/${filteredModules[0].id}`}>
                  <Button size="lg">
                    Take Full Practice Test
                  </Button>
                </Link>
              )
            ) : (
              <Button size="lg" disabled>
                No Practice Tests Available
              </Button>
            )}
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
                The Test de Connaissance du Français (TCF) is a French language proficiency test administered by the Centre International d&apos;Études Pédagogiques (CIEP) on behalf of the French Ministry of Education.
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
                The Test d&apos;Évaluation de Français (TEF) is a French language proficiency test administered by the Paris Ile-de-France Chamber of Commerce and Industry.
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
        </>
        )}
      </div>
    </ProtectedRoute>
  );
}
