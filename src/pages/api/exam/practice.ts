import type { NextApiRequest, NextApiResponse } from 'next';
import { isAuthenticated } from '../../../utils/auth';

// Mock exam sections
type ExamSection = 'comprehension-ecrite' | 'comprehension-orale' | 'expression-ecrite' | 'expression-orale' | 'grammaire' | 'vocabulaire';

// Mock exam questions
const examQuestions: Record<ExamSection, Record<string, any[]>> = {
  'comprehension-ecrite': {
    A2: [
      {
        id: 'ce_a2_1',
        type: 'multiple-choice',
        text: `Lisez ce message et répondez à la question:
        
        "Chère Marie, je ne peux pas venir à ton anniversaire samedi parce que je dois travailler. Je suis vraiment désolée. Peut-être nous pouvons déjeuner ensemble la semaine prochaine? Bises, Sophie"
        
        Pourquoi Sophie écrit-elle à Marie?`,
        options: [
          "Pour inviter Marie à son anniversaire",
          "Pour annuler un rendez-vous",
          "Pour proposer un dîner",
          "Pour souhaiter un bon anniversaire"
        ],
        correctAnswer: 1
      },
      {
        id: 'ce_a2_2',
        type: 'true-false',
        text: `Lisez ce texte:
        
        "Le musée est ouvert tous les jours sauf le lundi, de 9h à 18h. L'entrée est gratuite pour les étudiants et les enfants de moins de 12 ans."
        
        Le musée est fermé le dimanche.`,
        correctAnswer: false
      }
    ],
    B1: [
      {
        id: 'ce_b1_1',
        type: 'multiple-choice',
        text: `Lisez cet article et répondez à la question:
        
        "Selon une nouvelle étude publiée cette semaine, faire du sport régulièrement améliore non seulement la santé physique mais aussi les capacités mentales. Les chercheurs ont observé que les personnes qui font au moins 30 minutes d'activité physique par jour ont une meilleure mémoire et concentration."
        
        Quel est le sujet principal de cet article?`,
        options: [
          "Comment améliorer sa mémoire",
          "Une nouvelle méthode d'entraînement sportif",
          "Les bienfaits du sport sur le corps et l'esprit",
          "La durée idéale d'exercice physique"
        ],
        correctAnswer: 2
      }
    ]
  },
  'comprehension-orale': {
    A2: [
      {
        id: 'co_a2_1',
        type: 'multiple-choice',
        audioUrl: '/audio/exam/comprehension_a2_1.mp3',
        transcript: "Bonjour, je voudrais réserver une table pour ce soir à 20h pour deux personnes. C'est possible?",
        question: "Que fait cette personne?",
        options: [
          "Elle commande un repas",
          "Elle réserve une table au restaurant",
          "Elle cherche un restaurant",
          "Elle annule une réservation"
        ],
        correctAnswer: 1
      }
    ],
    B1: [
      {
        id: 'co_b1_1',
        type: 'multiple-choice',
        audioUrl: '/audio/exam/comprehension_b1_1.mp3',
        transcript: "Bienvenue sur Radio France Info. Il est 7h et voici les titres de l'actualité: La grève des transports continue aujourd'hui dans plusieurs villes. Les usagers doivent s'attendre à des perturbations importantes sur les lignes de métro et de bus. La météo annonce de la pluie pour tout le weekend sur la moitié nord du pays.",
        question: "De quel type d'émission s'agit-il?",
        options: [
          "Une publicité",
          "Un bulletin météo",
          "Un journal d'information",
          "Une émission culturelle"
        ],
        correctAnswer: 2
      }
    ]
  },
  'expression-ecrite': {
    A2: [
      {
        id: 'ee_a2_1',
        type: 'writing',
        instructions: "Vous écrivez un email à un ami pour l'inviter à votre anniversaire. Précisez la date, l'heure, le lieu et demandez une réponse. (60-80 mots)",
        minWords: 60,
        maxWords: 80,
        evaluationCriteria: [
          "Respect de la consigne",
          "Capacité à inviter et à décrire un événement",
          "Correction grammaticale",
          "Vocabulaire approprié"
        ]
      }
    ],
    B1: [
      {
        id: 'ee_b1_1',
        type: 'writing',
        instructions: "Vous avez récemment visité une ville française. Écrivez un message sur un forum de voyage pour décrire votre expérience, les lieux que vous avez visités et donnez votre opinion. (120-150 mots)",
        minWords: 120,
        maxWords: 150,
        evaluationCriteria: [
          "Respect de la consigne",
          "Capacité à raconter et à décrire",
          "Expression d'opinions et de sentiments",
          "Cohérence et cohésion",
          "Correction grammaticale et richesse du vocabulaire"
        ]
      }
    ]
  },
  'expression-orale': {
    A2: [
      {
        id: 'eo_a2_1',
        type: 'speaking',
        instructions: "Présentez-vous et parlez de vos loisirs. (1-2 minutes)",
        duration: 120, // seconds
        evaluationCriteria: [
          "Capacité à se présenter",
          "Fluidité",
          "Prononciation",
          "Vocabulaire approprié",
          "Correction grammaticale"
        ]
      }
    ],
    B1: [
      {
        id: 'eo_b1_1',
        type: 'speaking',
        instructions: "Choisissez un des sujets suivants et exprimez votre opinion: 1) Les avantages et inconvénients des réseaux sociaux, 2) L'importance d'apprendre des langues étrangères, 3) Vivre en ville ou à la campagne. (3 minutes)",
        duration: 180, // seconds
        evaluationCriteria: [
          "Capacité à présenter et défendre un point de vue",
          "Organisation du discours",
          "Fluidité et prononciation",
          "Richesse grammaticale et lexicale"
        ]
      }
    ]
  },
  'grammaire': {
    A2: [
      {
        id: 'gr_a2_1',
        type: 'fill-in-blank',
        text: "Je _____ au cinéma hier soir.",
        options: ["vais", "allais", "suis allé", "aller"],
        correctAnswer: 2
      },
      {
        id: 'gr_a2_2',
        type: 'multiple-choice',
        text: "Choisissez la phrase correcte:",
        options: [
          "J'ai mangé rien.",
          "Je n'ai mangé rien.",
          "Je n'ai rien mangé.",
          "J'ai rien mangé."
        ],
        correctAnswer: 2
      }
    ],
    B1: [
      {
        id: 'gr_b1_1',
        type: 'fill-in-blank',
        text: "Si j'_____ plus d'argent, je _____ en vacances.",
        options: [
          ["avais", "partirais"],
          ["aurais", "partirais"],
          ["avais", "partirai"],
          ["ai", "partirais"]
        ],
        correctAnswer: 0
      }
    ]
  },
  'vocabulaire': {
    A2: [
      {
        id: 'voc_a2_1',
        type: 'matching',
        instructions: "Associez chaque mot à sa définition:",
        items: [
          { id: 1, text: "cuisine" },
          { id: 2, text: "salon" },
          { id: 3, text: "chambre" },
          { id: 4, text: "salle de bain" }
        ],
        matches: [
          { id: "a", text: "pièce où l'on dort" },
          { id: "b", text: "pièce où l'on prépare les repas" },
          { id: "c", text: "pièce où l'on se lave" },
          { id: "d", text: "pièce où l'on reçoit des invités" }
        ],
        correctAnswers: [
          { item: 1, match: "b" },
          { item: 2, match: "d" },
          { item: 3, match: "a" },
          { item: 4, match: "c" }
        ]
      }
    ],
    B1: [
      {
        id: 'voc_b1_1',
        type: 'multiple-choice',
        text: "Quel est le synonyme de 'se dépêcher'?",
        options: ["se promener", "se reposer", "se précipiter", "se détendre"],
        correctAnswer: 2
      }
    ]
  }
};

// User exam progress (would be stored in a database in a real app)
const userExamProgress: Record<number, Record<string, any>> = {
  1: {
    'comprehension-ecrite': {
      A2: {
        completed: 1,
        score: 80
      }
    }
  }
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Get exam questions
    const { section, level, id } = req.query;
    
    // Validate section
    if (section && !examQuestions[section as ExamSection]) {
      return res.status(400).json({ message: 'Invalid exam section' });
    }
    
    // Return all available sections if no section specified
    if (!section) {
      return res.status(200).json({
        sections: Object.keys(examQuestions),
        levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
      });
    }
    
    // Get specific section
    const sectionData = examQuestions[section as ExamSection];
    
    // Validate level for the section
    if (level && !sectionData[level as string]) {
      return res.status(400).json({ message: 'Invalid level for this section' });
    }
    
    // Get questions for specific level
    if (level) {
      const levelQuestions = sectionData[level as string];
      
      // Get specific question by ID
      if (id) {
        const question = levelQuestions.find(q => q.id === id);
        if (!question) {
          return res.status(404).json({ message: 'Question not found' });
        }
        return res.status(200).json(question);
      }
      
      // Return all questions for the level
      return res.status(200).json(levelQuestions);
    }
    
    // Return all levels available for the section
    return res.status(200).json({
      section,
      levels: Object.keys(sectionData)
    });
  } else if (req.method === 'POST') {
    // Submit exam answers
    try {
      const userId = 1; // In a real app, get this from the authenticated user
      const { section, level, answers } = req.body;
      
      if (!section || !level || !answers) {
        return res.status(400).json({ message: 'Section, level, and answers are required' });
      }
      
      // Validate section and level
      if (!examQuestions[section as ExamSection] || !examQuestions[section as ExamSection][level]) {
        return res.status(400).json({ message: 'Invalid section or level' });
      }
      
      // In a real app, evaluate answers and calculate score
      // This is a mock implementation
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      
      // Update user progress
      if (!userExamProgress[userId]) {
        userExamProgress[userId] = {};
      }
      
      if (!userExamProgress[userId][section]) {
        userExamProgress[userId][section] = {};
      }
      
      userExamProgress[userId][section][level] = {
        completed: (userExamProgress[userId][section][level]?.completed || 0) + 1,
        score
      };
      
      // Generate feedback (mock implementation)
      const strengths = ['Bonne compréhension générale', 'Vocabulaire varié'];
      const weaknesses = ['Attention aux temps verbaux', 'Développer les réponses'];
      
      return res.status(200).json({
        score,
        feedback: {
          strengths: strengths.filter(() => Math.random() > 0.3),
          weaknesses: weaknesses.filter(() => Math.random() > 0.3)
        },
        progress: userExamProgress[userId][section][level]
      });
    } catch (error) {
      console.error('Exam submission error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
} 