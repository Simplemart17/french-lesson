import { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse } from '@/types/api';
import { isAuthenticated, getUserId } from '@/utils/auth';

// Define the exam module type
interface ExamModule {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  section: 'listening' | 'reading' | 'writing' | 'speaking';
  difficulty: 'easy' | 'medium' | 'hard';
  examType: 'tcf' | 'tef';
  questions?: ExamQuestion[];
}

// Define the exam question types
type ExamQuestion = 
  | MultipleChoiceQuestion
  | AudioResponseQuestion
  | WritingQuestion
  | SpeakingQuestion;

interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface AudioResponseQuestion {
  id: string;
  type: 'audio-response';
  text: string;
  audioUrl: string;
  correctAnswer: string;
  explanation?: string;
}

interface WritingQuestion {
  id: string;
  type: 'writing';
  text: string;
  wordLimit?: number;
  sampleAnswer?: string;
  rubric?: {
    criteria: string;
    maxPoints: number;
  }[];
}

interface SpeakingQuestion {
  id: string;
  type: 'speaking';
  text: string;
  preparationTime?: number; // in seconds
  responseTime?: number; // in seconds
  sampleResponse?: string;
  rubric?: {
    criteria: string;
    maxPoints: number;
  }[];
}

// Mock exam modules data
const examModules: Record<string, ExamModule> = {
  'tcf-listening-1': {
    id: 'tcf-listening-1',
    title: 'TCF Listening - Everyday Conversations',
    description: 'Practice understanding everyday conversations in French.',
    duration: 20,
    section: 'listening',
    difficulty: 'easy',
    examType: 'tcf',
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
        text: 'Écoutez l\'annonce et choisissez la bonne réponse: Qu\'est-ce que la femme annonce?',
        options: [
          'Un retard de train',
          'Une promotion dans un magasin',
          'Un changement de salle pour une conférence',
          'Une fermeture temporaire d\'un restaurant'
        ],
        correctAnswer: 'Un retard de train',
        explanation: 'La femme annonce que le train en direction de Lyon aura un retard de 20 minutes.'
      },
      {
        id: 'tcf-l1-q3',
        type: 'audio-response',
        text: 'Écoutez la conversation téléphonique et répondez: Quel est le problème de la personne qui appelle?',
        audioUrl: '/audio/tcf-listening-sample-3.mp3',
        correctAnswer: 'elle a perdu son portefeuille',
        explanation: 'La personne explique qu\'elle a perdu son portefeuille qui contenait ses papiers d\'identité et ses cartes bancaires.'
      }
    ]
  },
  'tcf-reading-1': {
    id: 'tcf-reading-1',
    title: 'TCF Reading - Short Texts',
    description: 'Practice reading and understanding short texts in French.',
    duration: 25,
    section: 'reading',
    difficulty: 'easy',
    examType: 'tcf',
    questions: [
      {
        id: 'tcf-r1-q1',
        type: 'multiple-choice',
        text: 'Lisez le texte suivant:\n\n"Le musée sera fermé le lundi 14 juillet en raison de la fête nationale. Les horaires d\'ouverture restent inchangés les autres jours: de 9h à 18h du mardi au dimanche."\n\nQuand le musée sera-t-il fermé?',
        options: [
          'Tous les lundis',
          'Le 14 juillet seulement',
          'Du 14 au 20 juillet',
          'Les dimanches et lundis'
        ],
        correctAnswer: 'Le 14 juillet seulement',
        explanation: 'Le texte indique clairement que le musée sera fermé le lundi 14 juillet en raison de la fête nationale.'
      },
      {
        id: 'tcf-r1-q2',
        type: 'multiple-choice',
        text: 'Lisez l\'email suivant:\n\n"Cher client,\nNous vous informons que votre commande n°12345 a été expédiée aujourd\'hui. Le délai de livraison estimé est de 3 à 5 jours ouvrables. Vous recevrez un email avec le numéro de suivi dans les prochaines 24 heures.\nCordialement,\nLe service client"\n\nQuel est l\'objet de cet email?',
        options: [
          'Confirmer une commande',
          'Annoncer un retard de livraison',
          'Informer de l\'expédition d\'une commande',
          'Demander un avis sur un produit'
        ],
        correctAnswer: 'Informer de l\'expédition d\'une commande',
        explanation: 'L\'email informe le client que sa commande a été expédiée et donne des informations sur le délai de livraison.'
      }
    ]
  },
  'tcf-writing-1': {
    id: 'tcf-writing-1',
    title: 'TCF Writing - Personal Opinion',
    description: 'Practice writing a short text expressing your opinion on a topic.',
    duration: 30,
    section: 'writing',
    difficulty: 'medium',
    examType: 'tcf',
    questions: [
      {
        id: 'tcf-w1-q1',
        type: 'writing',
        text: 'Écrivez un texte de 150-180 mots sur le sujet suivant: "Les avantages et les inconvénients des réseaux sociaux dans notre vie quotidienne."',
        wordLimit: 180,
        sampleAnswer: 'De nos jours, les réseaux sociaux font partie intégrante de notre quotidien. Ils présentent de nombreux avantages, notamment la possibilité de rester en contact avec des amis et de la famille éloignés. Ils permettent également de partager des moments importants de notre vie et de découvrir de nouvelles idées et perspectives.\n\nCependant, les réseaux sociaux ont aussi des inconvénients significatifs. Ils peuvent créer une dépendance et réduire les interactions sociales réelles. De plus, ils posent des problèmes de confidentialité et peuvent contribuer à la propagation de fausses informations.\n\nPersonnellement, je pense que les réseaux sociaux sont utiles s\'ils sont utilisés avec modération. Il est important de maintenir un équilibre entre notre vie en ligne et notre vie réelle. Nous devons aussi être conscients des informations que nous partageons et vérifier la fiabilité des contenus que nous lisons.',
        rubric: [
          { criteria: 'Respect du sujet et de la consigne', maxPoints: 5 },
          { criteria: 'Cohérence et cohésion', maxPoints: 5 },
          { criteria: 'Lexique/orthographe lexicale', maxPoints: 5 },
          { criteria: 'Morphosyntaxe/orthographe grammaticale', maxPoints: 5 }
        ]
      }
    ]
  },
  'tcf-speaking-1': {
    id: 'tcf-speaking-1',
    title: 'TCF Speaking - Personal Introduction',
    description: 'Practice introducing yourself and talking about your interests in French.',
    duration: 15,
    section: 'speaking',
    difficulty: 'easy',
    examType: 'tcf',
    questions: [
      {
        id: 'tcf-s1-q1',
        type: 'speaking',
        text: 'Présentez-vous en parlant de votre famille, de vos études ou de votre travail, et de vos loisirs (2 minutes).',
        preparationTime: 60,
        responseTime: 120,
        sampleResponse: 'Bonjour, je m\'appelle Marie et j\'ai 28 ans. Je suis française et j\'habite à Lyon. Ma famille est assez grande: j\'ai deux frères et une sœur. Mes parents habitent toujours dans ma ville natale, Bordeaux.\n\nJe suis ingénieure en informatique et je travaille dans une entreprise qui développe des applications mobiles. J\'aime beaucoup mon travail car il est créatif et me permet de résoudre des problèmes intéressants.\n\nPendant mon temps libre, j\'aime faire du sport, surtout du tennis et de la natation. Je suis aussi passionnée par la photographie et j\'aime voyager pour découvrir de nouveaux paysages à photographier. L\'année dernière, j\'ai visité le Portugal et l\'Italie, et cette année, j\'espère aller en Grèce.',
        rubric: [
          { criteria: 'Étendue du vocabulaire', maxPoints: 5 },
          { criteria: 'Correction grammaticale', maxPoints: 5 },
          { criteria: 'Aisance et fluidité', maxPoints: 5 },
          { criteria: 'Prononciation et intonation', maxPoints: 5 }
        ]
      }
    ]
  },
  'tef-listening-1': {
    id: 'tef-listening-1',
    title: 'TEF Listening - News and Announcements',
    description: 'Practice understanding news reports and public announcements in French.',
    duration: 25,
    section: 'listening',
    difficulty: 'medium',
    examType: 'tef',
    questions: [
      {
        id: 'tef-l1-q1',
        type: 'audio-response',
        text: 'Écoutez le bulletin météo et répondez à la question: Quel temps fera-t-il demain dans le sud de la France?',
        audioUrl: '/audio/tef-listening-sample-1.mp3',
        correctAnswer: 'ensoleillé avec des températures élevées',
        explanation: 'Le bulletin météo annonce un temps ensoleillé avec des températures entre 28 et 32 degrés dans le sud de la France.'
      },
      {
        id: 'tef-l1-q2',
        type: 'multiple-choice',
        text: 'Écoutez l\'annonce et choisissez la bonne réponse: Pourquoi le vol est-il retardé?',
        options: [
          'À cause du mauvais temps',
          'En raison d\'un problème technique',
          'À cause d\'une grève du personnel',
          'En raison d\'un retard de l\'avion précédent'
        ],
        correctAnswer: 'En raison d\'un problème technique',
        explanation: 'L\'annonce mentionne clairement que le vol est retardé en raison d\'un problème technique qui nécessite une vérification supplémentaire.'
      }
    ]
  },
  'tef-reading-1': {
    id: 'tef-reading-1',
    title: 'TEF Reading - Articles and Reports',
    description: 'Practice reading and understanding articles and reports in French.',
    duration: 35,
    section: 'reading',
    difficulty: 'medium',
    examType: 'tef',
    questions: [
      {
        id: 'tef-r1-q1',
        type: 'multiple-choice',
        text: 'Lisez l\'article suivant:\n\n"Selon une étude récente publiée dans la revue Science, la consommation de chocolat noir pourrait avoir des effets bénéfiques sur la santé cardiovasculaire. Les chercheurs ont suivi 2000 participants pendant cinq ans et ont constaté que ceux qui consommaient régulièrement du chocolat noir (au moins deux fois par semaine) présentaient un risque réduit de 15% de développer des maladies cardiaques. Cependant, les chercheurs soulignent que ces résultats ne s\'appliquent qu\'au chocolat noir contenant au moins 70% de cacao et recommandent une consommation modérée."\n\nQuel est le principal résultat de l\'étude mentionnée dans l\'article?',
        options: [
          'Le chocolat noir peut remplacer les médicaments pour le cœur',
          'La consommation régulière de chocolat noir peut réduire le risque de maladies cardiaques',
          'Le chocolat noir est meilleur pour la santé que le chocolat au lait',
          'Il faut consommer du chocolat noir tous les jours pour en tirer des bénéfices'
        ],
        correctAnswer: 'La consommation régulière de chocolat noir peut réduire le risque de maladies cardiaques',
        explanation: 'L\'article indique que les participants qui consommaient régulièrement du chocolat noir présentaient un risque réduit de 15% de développer des maladies cardiaques.'
      }
    ]
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  // GET request to retrieve exam modules
  if (req.method === 'GET') {
    try {
      const { id, examType, section, difficulty } = req.query;
      
      // If ID is provided, return that specific module
      if (id) {
        const module = examModules[id as string];
        
        if (!module) {
          return res.status(404).json({
            success: false,
            error: {
              message: 'Exam module not found'
            }
          });
        }
        
        return res.status(200).json({
          success: true,
          data: module
        });
      }
      
      // Otherwise, filter modules based on query parameters
      let filteredModules = Object.values(examModules);
      
      // Filter by exam type if provided
      if (examType) {
        filteredModules = filteredModules.filter(
          module => module.examType === examType
        );
      }
      
      // Filter by section if provided
      if (section) {
        filteredModules = filteredModules.filter(
          module => module.section === section
        );
      }
      
      // Filter by difficulty if provided
      if (difficulty) {
        filteredModules = filteredModules.filter(
          module => module.difficulty === difficulty
        );
      }
      
      // Return basic module info without questions for the list view
      const modulesList = filteredModules.map(({ questions, ...moduleInfo }) => moduleInfo);
      
      return res.status(200).json({
        success: true,
        data: modulesList
      });
    } catch (error) {
      console.error('Error fetching exam modules:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // POST request to submit exam answers
  if (req.method === 'POST') {
    // Check if user is authenticated
    if (!isAuthenticated(req)) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Unauthorized'
        }
      });
    }
    
    const userId = getUserId(req);
    
    try {
      const { moduleId, answers } = req.body;
      
      // Validate required fields
      if (!moduleId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required fields or invalid format'
          }
        });
      }
      
      // Find the module
      const module = examModules[moduleId];
      
      if (!module) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Exam module not found'
          }
        });
      }
      
      // Process answers based on question type
      const results = answers.map((answer: { questionId: string; answer: string }) => {
        const question = module.questions?.find(q => q.id === answer.questionId);
        
        if (!question) {
          return {
            questionId: answer.questionId,
            isCorrect: false,
            score: 0,
            feedback: 'Question not found'
          };
        }
        
        // Handle different question types
        if (question.type === 'multiple-choice' || question.type === 'audio-response') {
          const isCorrect = answer.answer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
          
          return {
            questionId: answer.questionId,
            isCorrect,
            score: isCorrect ? 1 : 0,
            feedback: isCorrect 
              ? 'Correct! ' + (question.explanation || '')
              : 'Incorrect. The correct answer is: ' + question.correctAnswer + (question.explanation ? '. ' + question.explanation : '')
          };
        }
        
        // For writing and speaking questions, we would normally have a human evaluator
        // For now, just provide a generic response
        if (question.type === 'writing' || question.type === 'speaking') {
          return {
            questionId: answer.questionId,
            isEvaluated: false,
            score: null,
            feedback: 'Your response has been recorded and will be evaluated by an examiner.'
          };
        }
        
        return {
          questionId: answer.questionId,
          isCorrect: false,
          score: 0,
          feedback: 'Unknown question type'
        };
      });
      
      // Calculate score for automatically graded questions
      const gradedResults = results.filter(result => 'isCorrect' in result) as { 
        questionId: string; 
        isCorrect: boolean; 
        score: number; 
        feedback: string 
      }[];
      
      const correctCount = gradedResults.filter(result => result.isCorrect).length;
      const totalCount = gradedResults.length;
      const score = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : null;
      
      // In a real app, we would save the results to the database
      
      return res.status(200).json({
        success: true,
        data: {
          moduleId,
          results,
          score,
          totalCorrect: correctCount,
          totalGraded: totalCount,
          totalQuestions: module.questions?.length || 0,
          submittedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error submitting exam answers:', error);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error'
        }
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({
    success: false,
    error: {
      message: 'Method not allowed'
    }
  });
}
