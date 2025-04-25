import { VocabularyWord } from '@/components/features/SpacedRepetition';

// Initial vocabulary data
const initialVocabularyData: VocabularyWord[] = [
  { 
    id: '1',
    word: 'Bonjour', 
    translation: 'Hello / Good day', 
    example: 'Bonjour, comment allez-vous?', 
    category: 'greetings',
    pronunciation: '/bɔ̃.ʒuʁ/',
    level: 'beginner'
  },
  { 
    id: '2',
    word: 'Au revoir', 
    translation: 'Goodbye', 
    example: 'Au revoir, à demain!', 
    category: 'greetings',
    pronunciation: '/o.ʁə.vwaʁ/',
    level: 'beginner'
  },
  { 
    id: '3',
    word: 'Merci', 
    translation: 'Thank you', 
    example: 'Merci beaucoup pour votre aide.', 
    category: 'greetings',
    pronunciation: '/mɛʁ.si/',
    level: 'beginner'
  },
  { 
    id: '4',
    word: 'S\'il vous plaît', 
    translation: 'Please', 
    example: 'Un café, s\'il vous plaît.', 
    category: 'greetings',
    pronunciation: '/sil.vu.plɛ/',
    level: 'beginner'
  },
  { 
    id: '5',
    word: 'Excusez-moi', 
    translation: 'Excuse me', 
    example: 'Excusez-moi, où est la gare?', 
    category: 'travel',
    pronunciation: '/ɛk.sky.ze.mwa/',
    level: 'beginner'
  },
  { 
    id: '6',
    word: 'La gare', 
    translation: 'The train station', 
    example: 'La gare est à dix minutes à pied.', 
    category: 'travel',
    pronunciation: '/la.ɡaʁ/',
    level: 'beginner'
  },
  { 
    id: '7',
    word: 'Le restaurant', 
    translation: 'The restaurant', 
    example: 'Ce restaurant est très bon.', 
    category: 'food',
    pronunciation: '/lə.ʁɛs.to.ʁɑ̃/',
    level: 'beginner'
  },
  { 
    id: '8',
    word: 'Le menu', 
    translation: 'The menu', 
    example: 'Pouvez-vous m\'apporter le menu?', 
    category: 'food',
    pronunciation: '/lə.mə.ny/',
    level: 'beginner'
  },
  { 
    id: '9',
    word: 'Le magasin', 
    translation: 'The store/shop', 
    example: 'Le magasin ouvre à 9 heures.', 
    category: 'shopping',
    pronunciation: '/lə.ma.ɡa.zɛ̃/',
    level: 'beginner'
  },
  { 
    id: '10',
    word: 'Combien ça coûte?', 
    translation: 'How much does it cost?', 
    example: 'Combien ça coûte, ce livre?', 
    category: 'shopping',
    pronunciation: '/kɔ̃.bjɛ̃.sa.kut/',
    level: 'beginner'
  },
  { 
    id: '11',
    word: 'Néanmoins', 
    translation: 'Nevertheless', 
    example: 'C\'est difficile, néanmoins je vais essayer.', 
    category: 'business',
    pronunciation: '/ne.ɑ̃.mwɛ̃/',
    level: 'intermediate'
  },
  { 
    id: '12',
    word: 'Désormais', 
    translation: 'From now on', 
    example: 'Désormais, nous travaillerons ensemble.', 
    category: 'business',
    pronunciation: '/de.zɔʁ.mɛ/',
    level: 'intermediate'
  },
  { 
    id: '13',
    word: 'Épanouissement', 
    translation: 'Fulfillment/blossoming', 
    example: 'Le voyage a contribué à son épanouissement personnel.', 
    category: 'business',
    pronunciation: '/e.pa.nu.is.mɑ̃/',
    level: 'advanced'
  },
  { 
    id: '14',
    word: 'Vraisemblablement', 
    translation: 'Presumably/likely', 
    example: 'Il arrivera vraisemblablement en retard.', 
    category: 'business',
    pronunciation: '/vʁɛ.sɑ̃.bla.blə.mɑ̃/',
    level: 'advanced'
  },
  { 
    id: '15',
    word: 'Je m\'appelle', 
    translation: 'My name is', 
    example: 'Je m\'appelle Marie. Et vous?', 
    category: 'greetings',
    pronunciation: '/ʒə.ma.pɛl/',
    level: 'beginner'
  },
  { 
    id: '16',
    word: 'Enchanté(e)', 
    translation: 'Nice to meet you', 
    example: 'Enchanté de faire votre connaissance.', 
    category: 'greetings',
    pronunciation: '/ɑ̃.ʃɑ̃.te/',
    level: 'beginner'
  },
  { 
    id: '17',
    word: 'À bientôt', 
    translation: 'See you soon', 
    example: 'À bientôt, mon ami!', 
    category: 'greetings',
    pronunciation: '/a.bjɛ̃.to/',
    level: 'beginner'
  },
  { 
    id: '18',
    word: 'Le métro', 
    translation: 'The subway/metro', 
    example: 'Je prends le métro pour aller au travail.', 
    category: 'travel',
    pronunciation: '/lə.me.tʁo/',
    level: 'beginner'
  },
  { 
    id: '19',
    word: 'L\'aéroport', 
    translation: 'The airport', 
    example: 'L\'aéroport est à 30 minutes en voiture.', 
    category: 'travel',
    pronunciation: '/la.e.ʁo.pɔʁ/',
    level: 'beginner'
  },
  { 
    id: '20',
    word: 'Le billet', 
    translation: 'The ticket', 
    example: 'J\'ai acheté un billet pour Paris.', 
    category: 'travel',
    pronunciation: '/lə.bi.jɛ/',
    level: 'beginner'
  }
];

// Get vocabulary from local storage or use initial data
const getVocabulary = (): VocabularyWord[] => {
  if (typeof window === 'undefined') {
    return initialVocabularyData;
  }
  
  const storedVocabulary = localStorage.getItem('vocabulary');
  if (storedVocabulary) {
    return JSON.parse(storedVocabulary);
  }
  
  // If no stored vocabulary, save the initial data and return it
  localStorage.setItem('vocabulary', JSON.stringify(initialVocabularyData));
  return initialVocabularyData;
};

// Save vocabulary to local storage
const saveVocabulary = (vocabulary: VocabularyWord[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
  }
};

// Update vocabulary words (e.g., after review)
const updateVocabularyWords = (updatedWords: VocabularyWord[]): VocabularyWord[] => {
  const vocabulary = getVocabulary();
  
  // Create a map for faster lookup
  const updatedWordsMap = new Map(updatedWords.map(word => [word.id, word]));
  
  // Update the vocabulary with the updated words
  const updatedVocabulary = vocabulary.map(word => {
    const updatedWord = updatedWordsMap.get(word.id);
    return updatedWord || word;
  });
  
  // Save the updated vocabulary
  saveVocabulary(updatedVocabulary);
  
  return updatedVocabulary;
};

// Add a new vocabulary word
const addVocabularyWord = (word: Omit<VocabularyWord, 'id'>): VocabularyWord[] => {
  const vocabulary = getVocabulary();
  
  // Generate a new ID
  const newId = (Math.max(...vocabulary.map(w => parseInt(w.id)), 0) + 1).toString();
  
  // Create the new word with ID
  const newWord: VocabularyWord = {
    ...word,
    id: newId,
  };
  
  // Add the new word to the vocabulary
  const updatedVocabulary = [...vocabulary, newWord];
  
  // Save the updated vocabulary
  saveVocabulary(updatedVocabulary);
  
  return updatedVocabulary;
};

// Get vocabulary categories
const getCategories = (): string[] => {
  const vocabulary = getVocabulary();
  const categories = new Set(vocabulary.map(word => word.category));
  return Array.from(categories);
};

// Get vocabulary due for review
const getDueVocabulary = (): VocabularyWord[] => {
  const vocabulary = getVocabulary();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return vocabulary.filter(word => {
    if (!word.nextReview) return true; // Never reviewed
    const reviewDate = new Date(word.nextReview);
    return reviewDate <= today;
  });
};

export const vocabularyService = {
  getVocabulary,
  saveVocabulary,
  updateVocabularyWords,
  addVocabularyWord,
  getCategories,
  getDueVocabulary,
};
