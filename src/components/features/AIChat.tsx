import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  corrections?: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  suggestions?: string[];
}

interface AIChatProps {
  initialMessage?: string;
  language?: string;
  topic?: string;
  enableCorrections?: boolean;
  enableVocabSuggestions?: boolean;
}

const AIChat = ({
  initialMessage = "Bonjour! Je suis votre assistant français. Comment puis-je vous aider aujourd'hui?",
  language = 'fr',
  topic = 'general',
  enableCorrections = true,
  enableVocabSuggestions = true
}: AIChatProps) => {
  void language;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<{
    lastTopic?: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    recentTopics: string[];
    suggestedVocab: Set<string>;
  }>({
    userLevel: 'beginner',
    recentTopics: [],
    suggestedVocab: new Set()
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add initial message from the assistant
  useEffect(() => {
    const initialMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    };
    
    setMessages([initialMsg]);
  }, [initialMessage]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Generate AI response
    generateResponse(inputText);
  };
  
  const detectGrammarErrors = (text: string): { original: string; corrected: string; explanation: string }[] => {
    // This is a simple mock implementation. In a real app, you would call an API
    const corrections: { original: string; corrected: string; explanation: string }[] = [];
    
    // Check for common grammar errors
    if (text.includes('je suis allé au Paris')) {
      corrections.push({
        original: 'je suis allé au Paris',
        corrected: 'je suis allé à Paris',
        explanation: 'Cities typically use "à" instead of "au". "Au" is used for masculine countries or places.'
      });
    }
    
    if (text.includes('j\'ai mangé un pomme')) {
      corrections.push({
        original: 'j\'ai mangé un pomme',
        corrected: 'j\'ai mangé une pomme',
        explanation: '"Pomme" is feminine, so it requires the feminine article "une" instead of "un".'
      });
    }
    
    if (text.match(/je peut/i)) {
      corrections.push({
        original: 'je peut',
        corrected: 'je peux',
        explanation: 'The verb "pouvoir" is conjugated as "peux" in the first person singular (je).'
      });
    }
    
    if (text.match(/tu es allé|tu as allé/i) && text.includes('elle')) {
      corrections.push({
        original: text.match(/tu es allé|tu as allé/i)?.[0] || '',
        corrected: 'tu es allée',
        explanation: 'When addressing a female, past participles must agree in gender.'
      });
    }
    
    // Check for articles with incorrect gender
    const commonMisusedArticles = [
      { pattern: /la (homme|garçon|père|frère)/i, correct: { article: 'l\'', gender: 'masculine' } },
      { pattern: /le (femme|fille|mère|sœur)/i, correct: { article: 'la', gender: 'feminine' } },
      { pattern: /un (table|chaise|maison|voiture)/i, correct: { article: 'une', gender: 'feminine' } },
      { pattern: /une (livre|stylo|cahier|ordinateur)/i, correct: { article: 'un', gender: 'masculine' } }
    ];
    
    commonMisusedArticles.forEach(item => {
      const match = text.match(item.pattern);
      if (match) {
        const [full, noun] = match;
        corrections.push({
          original: full,
          corrected: `${item.correct.article}${noun}`,
          explanation: `"${noun}" is ${item.correct.gender}, so it should use the article "${item.correct.article}" instead.`
        });
      }
    });
    
    return corrections;
  };
  
  const suggestVocabulary = (text: string, topic: string): string[] => {
    // This is a simple mock implementation. In a real app, you would call an API
    const suggestions: string[] = [];
    const topicVocab: Record<string, string[]> = {
      general: [
        'également (also)',
        'en effet (indeed)',
        'en tout cas (in any case)',
        'par conséquent (consequently)',
        'néanmoins (nevertheless)'
      ],
      travel: [
        'un aller-retour (a round trip)',
        'la gare (the train station)',
        'un billet (a ticket)',
        'l\'hébergement (accommodation)',
        'le séjour (the stay)'
      ],
      food: [
        'savoureux (tasty)',
        'la cuisson (cooking)',
        'un plat principal (a main dish)',
        'l\'addition (the bill)',
        'goûter (to taste)'
      ],
      culture: [
        'un chef-d\'œuvre (a masterpiece)',
        'une exposition (an exhibition)',
        'contemporain (contemporary)',
        'le patrimoine (heritage)',
        'une tradition (a tradition)'
      ]
    };
    
    // Add topic-specific vocabulary
    if (topic in topicVocab) {
      // Select 2-3 vocabulary items that haven't been suggested before
      const availableVocab = topicVocab[topic].filter(
        item => !conversationContext.suggestedVocab.has(item)
      );
      
      if (availableVocab.length > 0) {
        const itemsToSuggest = availableVocab.slice(0, Math.min(2, availableVocab.length));
        suggestions.push(...itemsToSuggest);
        
        // Update the suggested vocab set
        itemsToSuggest.forEach(item => {
          conversationContext.suggestedVocab.add(item);
        });
      }
    }
    
    // Suggest vocabulary based on specific words in the user's message
    if (text.includes('aller') || text.includes('voyager')) {
      suggestions.push('se déplacer (to move around)', 'partir en voyage (to go on a trip)');
    }
    
    if (text.includes('manger') || text.includes('cuisine')) {
      suggestions.push('se régaler (to enjoy a meal)', 'un repas copieux (a hearty meal)');
    }
    
    if (text.includes('aimer') || text.includes('adorer')) {
      suggestions.push('être passionné(e) de (to be passionate about)', 'prendre plaisir à (to take pleasure in)');
    }
    
    return suggestions;
  };
  
  const determineUserLevel = (text: string): 'beginner' | 'intermediate' | 'advanced' => {
    // This is a simple mock implementation. In a real app, you would call an API
    // that analyzes the user's language proficiency.
    
    // Count complex grammatical structures
    let complexityScore = 0;
    
    // Check for subjunctive usage
    if (text.match(/que je (sois|fasse|puisse|aie|veuille|aille)/i) || 
        text.match(/qu'il (soit|fasse|puisse|ait|veuille|aille)/i)) {
      complexityScore += 3;
    }
    
    // Check for conditional tense
    if (text.match(/je (voudrais|aimerais|pourrais|serais|aurais)/i)) {
      complexityScore += 2;
    }
    
    // Check for complex linking words
    if (text.match(/néanmoins|toutefois|cependant|par conséquent|ainsi que|en revanche/i)) {
      complexityScore += 2;
    }
    
    // Check for past tenses
    if (text.match(/j'ai (été|fait|dit|vu|pris)/i) || text.match(/je suis (allé|venu|parti)/i)) {
      complexityScore += 1;
    }
    
    // Check for future tense
    if (text.match(/je (vais|vais aller|ferai|serai|aurai)/i)) {
      complexityScore += 1;
    }
    
    // Determine level based on complexity score
    if (complexityScore >= 5) {
      return 'advanced';
    } else if (complexityScore >= 2) {
      return 'intermediate';
    } else {
      return 'beginner';
    }
  };
  
  const generateResponse = (userInput: string) => {
    setIsTyping(true);
    
    // In a real app, this would call an API to get a response from a language model
    setTimeout(() => {
      // Detect grammar errors if enabled
      const corrections = enableCorrections ? detectGrammarErrors(userInput) : [];
      
      // Update user level based on their input
      const detectedLevel = determineUserLevel(userInput);
      if (detectedLevel !== conversationContext.userLevel) {
        setConversationContext(prev => ({
          ...prev,
          userLevel: detectedLevel
        }));
      }
      
      // Suggest vocabulary if enabled
      const suggestions = enableVocabSuggestions ? suggestVocabulary(userInput, topic) : [];
      
      // Analyze the current topic of conversation
      let detectedTopic = topic;
      if (userInput.match(/voyage|train|avion|hôtel|visite|tourisme/i)) {
        detectedTopic = 'travel';
      } else if (userInput.match(/manger|cuisine|restaurant|nourriture|plat|délicieux/i)) {
        detectedTopic = 'food';
      } else if (userInput.match(/musée|art|peinture|histoire|littérature|culture/i)) {
        detectedTopic = 'culture';
      }
      
      // Update conversation context
      setConversationContext(prev => ({
        ...prev,
        lastTopic: detectedTopic,
        recentTopics: [
          detectedTopic, 
          ...prev.recentTopics.filter(t => t !== detectedTopic)
        ].slice(0, 3)
      }));
      
      // Generate the main response based on user input
      let botReply = '';
      
      // Basic pattern matching for common French phrases
      if (userInput.toLowerCase().includes('bonjour') || userInput.toLowerCase().includes('salut')) {
        botReply = "Bonjour! Comment allez-vous aujourd'hui?";
      } else if (userInput.toLowerCase().includes('merci')) {
        botReply = "Je vous en prie! C'est un plaisir de vous aider.";
      } else if (userInput.toLowerCase().includes('au revoir') || userInput.toLowerCase().includes('à bientôt')) {
        botReply = "Au revoir! À bientôt! N'hésitez pas à revenir pour pratiquer votre français.";
      } else if (userInput.toLowerCase().includes('comment') && (userInput.toLowerCase().includes('tu') || userInput.toLowerCase().includes('vous'))) {
        botReply = "Je vais très bien, merci! Et vous? Comment se passe votre apprentissage du français?";
      } else if (userInput.toLowerCase().includes('parle') && userInput.toLowerCase().includes('français')) {
        botReply = "Oui, je parle français! C'est une belle langue, n'est-ce pas? Continuez à pratiquer régulièrement pour progresser.";
      } else if (userInput.toLowerCase().includes('apprendre') || userInput.toLowerCase().includes('étudier')) {
        botReply = "C'est excellent que vous vouliez apprendre le français! La pratique régulière est la clé du succès. Je vous suggère de lire des articles simples et d'écouter des podcasts en français.";
      } else if (userInput.toLowerCase().includes('difficile')) {
        botReply = "Oui, le français peut être difficile parfois, mais avec de la pratique, vous allez vous améliorer! Ne vous découragez pas, prenez votre temps et soyez patient avec vous-même.";
      } else if (userInput.toLowerCase().includes('vocabulaire')) {
        botReply = "Pour améliorer votre vocabulaire, essayez de lire des livres simples en français ou d'écouter des podcasts français. Vous pouvez aussi étiqueter des objets chez vous avec leur nom en français, ou utiliser des applications de flashcards.";
      } else if (userInput.toLowerCase().includes('grammaire')) {
        botReply = "La grammaire française a beaucoup de règles, mais ne vous inquiétez pas! Concentrez-vous sur une règle à la fois. Les articles et l'accord des adjectifs sont de bons points de départ pour les débutants.";
      } else if (userInput.toLowerCase().includes('prononciation')) {
        botReply = "La prononciation française peut être difficile. Essayez d'écouter attentivement les natifs et de pratiquer régulièrement. Les sons nasaux (an, en, in, on) et le 'r' français demandent beaucoup de pratique.";
      } else if (userInput.toLowerCase().includes('exercice') || userInput.toLowerCase().includes('pratique')) {
        botReply = "La pratique est essentielle! Essayez de parler français tous les jours, même si c'est juste pour quelques minutes. Vous pouvez aussi écrire un journal en français ou décrire votre journée à voix haute.";
      } else if (userInput.toLowerCase().includes('conjugaison') || userInput.toLowerCase().includes('verbe')) {
        botReply = "La conjugaison des verbes est un aspect important du français. Commencez par les verbes réguliers en -ER comme 'parler', puis passez aux verbes irréguliers courants comme 'être', 'avoir', et 'aller'.";
      } else if (userInput.toLowerCase().includes('subjonctif')) {
        botReply = "Le subjonctif est un mode verbal utilisé pour exprimer des souhaits, des doutes, ou des sentiments. Il est souvent utilisé après des expressions comme 'il faut que', 'je veux que', ou 'je suis content que'.";
      } else if (userInput.toLowerCase().includes('conditionnel')) {
        botReply = "Le conditionnel est utilisé pour exprimer des actions hypothétiques. Par exemple, 'Je voudrais' (I would like) ou 'Nous irions' (We would go). C'est aussi utilisé pour faire des demandes polies.";
      } else if (userInput.toLowerCase().includes('passé composé') || userInput.toLowerCase().includes('passe compose')) {
        botReply = "Le passé composé est formé avec l'auxiliaire 'avoir' ou 'être' suivi du participe passé. Par exemple: 'J'ai mangé' (I ate) ou 'Je suis allé' (I went). C'est utilisé pour des actions terminées dans le passé.";
      } else if (userInput.toLowerCase().includes('imparfait')) {
        botReply = "L'imparfait est utilisé pour décrire des situations continues ou habituelles dans le passé. Par exemple: 'J'étais jeune' (I was young) ou 'Je mangeais souvent' (I often ate).";
      } else {
        // Default responses based on topic and user level
        const defaultResponses: Record<string, Record<string, string[]>> = {
          beginner: {
            general: [
              "Je comprends. Pouvez-vous m'en dire plus?",
              "C'est intéressant! Continuez, s'il vous plaît.",
              "Je vois. Et qu'en pensez-vous?",
              "Merci de partager cela. Avez-vous d'autres questions?",
              "Très bien. Comment puis-je vous aider davantage?"
            ],
            travel: [
              "La France a beaucoup de belles régions à visiter. Avez-vous une préférence?",
              "Paris est magnifique, mais n'oubliez pas d'explorer d'autres villes françaises comme Lyon ou Bordeaux!",
              "Si vous aimez la nature, je recommande les Alpes ou la Provence.",
              "Les transports en commun en France sont très efficaces, surtout les trains.",
              "N'oubliez pas d'essayer la cuisine locale pendant votre voyage!"
            ],
            food: [
              "La cuisine française est célèbre dans le monde entier. Aimez-vous les fromages?",
              "Chaque région de France a ses spécialités culinaires. La Normandie est connue pour ses pommes et son cidre.",
              "Le petit déjeuner français est simple: généralement un croissant ou une baguette avec du beurre et de la confiture.",
              "Le dîner en France est souvent servi tard, vers 20h ou même plus tard.",
              "Avez-vous déjà essayé de cuisiner un plat français?"
            ],
            culture: [
              "La culture française est riche en art, littérature, cinéma et musique.",
              "Les Français apprécient beaucoup l'art de vivre et prennent le temps de profiter des petits plaisirs.",
              "Les cafés sont très importants dans la culture française. C'est un lieu de rencontre et de discussion.",
              "La politesse est très valorisée en France. N'oubliez pas de dire 'bonjour' et 'merci'.",
              "Les Français sont fiers de leur patrimoine culturel et historique."
            ]
          },
          intermediate: {
            general: [
              "C'est un sujet intéressant que vous abordez. Pourriez-vous développer votre pensée?",
              "Je comprends votre point de vue. Il y a plusieurs façons d'envisager cette question.",
              "Votre français s'améliore! Continuez à pratiquer régulièrement.",
              "C'est une bonne observation. Avez-vous d'autres réflexions à ce sujet?",
              "Je suis impressionné par votre niveau de français. Depuis combien de temps l'étudiez-vous?"
            ],
            travel: [
              "Voyager en France permet de découvrir une grande diversité de paysages et de cultures régionales.",
              "Si vous visitez Paris, je vous conseille d'explorer les quartiers moins touristiques comme le Canal Saint-Martin ou Belleville.",
              "La Côte d'Azur est magnifique, mais très fréquentée en été. Préférez-vous les destinations moins touristiques?",
              "Connaissez-vous les DOM-TOM français? La Martinique, la Guadeloupe et la Réunion sont des destinations formidables.",
              "Le réseau ferroviaire français est excellent pour voyager entre les grandes villes. Avez-vous déjà pris le TGV?"
            ],
            food: [
              "La gastronomie française varie énormément d'une région à l'autre. Connaissez-vous les spécialités alsaciennes ou basques?",
              "Le service dans les restaurants français peut sembler lent pour les étrangers, mais c'est parce que les Français aiment prendre leur temps pour savourer un repas.",
              "Les marchés français sont une excellente façon de découvrir les produits locaux et de parler avec les producteurs.",
              "Saviez-vous que le repas gastronomique des Français est inscrit au patrimoine culturel immatériel de l'UNESCO?",
              "Les Français ont tendance à manger plus tard que dans d'autres pays, surtout pour le dîner qui commence rarement avant 19h30."
            ],
            culture: [
              "Le cinéma français a une longue tradition et une approche différente du cinéma hollywoodien. Avez-vous vu des films français récemment?",
              "La littérature française compte de nombreux auteurs célèbres comme Victor Hugo, Albert Camus et Simone de Beauvoir. Avez-vous lu certains de leurs ouvrages?",
              "L'art contemporain français est très dynamique. Le Centre Pompidou à Paris est un excellent endroit pour le découvrir.",
              "Les Français accordent beaucoup d'importance aux débats intellectuels. Les émissions littéraires et politiques sont populaires à la télévision française.",
              "La chanson française a une riche tradition, de Jacques Brel à Stromae. Quels artistes francophones écoutez-vous?"
            ]
          },
          advanced: {
            general: [
              "Votre analyse est pertinente et nuancée. Peut-être pourriez-vous également considérer d'autres perspectives?",
              "Cette réflexion soulève des questions fondamentales sur notre rapport au monde. Qu'en pensez-vous?",
              "Votre maîtrise du français est impressionnante. Les subtilités de la langue ne vous échappent pas.",
              "Ce sujet me fait penser à plusieurs œuvres littéraires qui traitent de thèmes similaires. Connaissez-vous Proust ou Camus?",
              "La complexité de votre pensée se reflète dans votre expression linguistique. C'est un plaisir de discuter avec vous."
            ],
            travel: [
              "Au-delà des sentiers battus, la France rurale recèle des trésors méconnus. Avez-vous envisagé d'explorer des régions comme l'Auvergne ou le Jura?",
              "Le tourisme durable gagne en importance en France. De nombreux hébergements écologiques se développent dans des lieux préservés.",
              "L'architecture française témoigne de l'évolution des styles à travers les siècles, du roman au contemporain. Quelles périodes vous intéressent particulièrement?",
              "La diversité géographique française permet de pratiquer une multitude d'activités: randonnée dans les Cévennes, voile en Bretagne, ski dans les Alpes...",
              "Les festivals culturels français, comme celui d'Avignon pour le théâtre ou de Cannes pour le cinéma, attirent des artistes du monde entier."
            ],
            food: [
              "La haute gastronomie française évolue constamment, intégrant des influences internationales tout en préservant son héritage. Qu'en pensez-vous?",
              "Le débat sur l'agriculture biologique et les circuits courts est très vif en France. Les consommateurs deviennent plus conscients de l'impact environnemental de leur alimentation.",
              "Les accords mets-vins sont fondamentaux dans la gastronomie française. La diversité des terroirs viticoles offre une palette d'arômes exceptionnelle.",
              "Le savoir-faire artisanal français en matière de fromages, pains et pâtisseries est reconnu mondialement mais confronté à l'industrialisation croissante.",
              "La transmission des techniques culinaires traditionnelles est un enjeu culturel majeur. Les écoles de cuisine françaises jouent un rôle crucial dans cette préservation."
            ],
            culture: [
              "L'exception culturelle française, défendue politiquement depuis des décennies, vise à protéger la création artistique de la pure logique marchande. Cette approche vous semble-t-elle pertinente?",
              "Le rapport des Français à leur langue est complexe, entre défense du français face à l'anglais et évolution naturelle de l'usage. Comment percevez-vous ce phénomène?",
              "La philosophie occupe une place particulière dans l'enseignement et la culture française. Les débats d'idées sont valorisés dans l'espace public.",
              "L'art contemporain français oscille entre reconnaissance internationale et critiques domestiques sur son élitisme. Trouvez-vous l'art contemporain accessible?",
              "Le patrimoine immatériel français, des savoir-faire artisanaux aux traditions régionales, connaît un regain d'intérêt face à la mondialisation culturelle."
            ]
          }
        };
        
        // Select appropriate responses based on user level and topic
        const userLevel = conversationContext.userLevel || 'beginner';
        const responseCategory = userLevel as keyof typeof defaultResponses;
        const topicCategory = detectedTopic as keyof typeof defaultResponses[typeof responseCategory];
        
        const responses = defaultResponses[responseCategory][topicCategory] || 
                         defaultResponses[responseCategory].general;
        botReply = responses[Math.floor(Math.random() * responses.length)];
      }
      
      // Add learning tips based on user level
      const userLevelForTips = conversationContext.userLevel || 'beginner';
      let learningTip = '';
      if (Math.random() < 0.3) { // 30% chance to add a learning tip
        const tips = {
          beginner: [
            "Conseil: Écoutez des chansons françaises simples pour vous familiariser avec la prononciation.",
            "Astuce: Regardez des dessins animés en français pour apprendre du vocabulaire de base.",
            "Conseil: Utilisez des applications comme Duolingo pour pratiquer un peu chaque jour.",
            "Astuce: Commencez par apprendre les phrases de base pour les situations quotidiennes."
          ],
          intermediate: [
            "Conseil: Essayez de lire des articles de journaux français pour élargir votre vocabulaire.",
            "Astuce: Regardez des séries françaises avec sous-titres français pour améliorer votre compréhension.",
            "Conseil: Tenez un journal en français pour pratiquer l'écriture régulièrement.",
            "Astuce: Participez à des groupes de conversation pour améliorer votre fluidité."
          ],
          advanced: [
            "Conseil: Lisez des œuvres littéraires françaises pour maîtriser les nuances de la langue.",
            "Astuce: Écoutez des podcasts sur des sujets spécialisés pour enrichir votre vocabulaire technique.",
            "Conseil: Rédigez des essais argumentatifs pour affiner votre expression écrite.",
            "Astuce: Analysez des discours politiques ou des débats pour comprendre la rhétorique française."
          ]
        };
        
        const userTips = tips[userLevelForTips as keyof typeof tips];
        learningTip = userTips[Math.floor(Math.random() * userTips.length)];
        botReply += `\n\n${learningTip}`;
      }
      
      // Add grammar correction note if there are corrections
      if (corrections.length > 0) {
        botReply += "\n\n📝 J'ai remarqué quelques points à améliorer dans votre français:";
        corrections.forEach(correction => {
          botReply += `\n- "${correction.original}" → "${correction.corrected}": ${correction.explanation}`;
        });
      }
      
      // Add vocabulary suggestions if there are any
      if (suggestions.length > 0) {
        botReply += "\n\n📚 Suggestions de vocabulaire:";
        suggestions.forEach(suggestion => {
          botReply += `\n- ${suggestion}`;
        });
      }
      
      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date(),
        corrections: corrections.length > 0 ? corrections : undefined,
        suggestions: suggestions.length > 0 ? suggestions : undefined
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800">French Conversation Practice</h3>
        <p className="text-sm text-gray-500">Chat with our AI assistant to practice your French</p>
      </div>
      
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user' 
                ? 'bg-primary-100 text-primary-900' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="whitespace-pre-line">{message.content}</p>
              
              {message.role === 'assistant' && message.corrections && message.corrections.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-amber-700">Corrections grammaticales:</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    {message.corrections.map((correction, index) => (
                      <li key={index}>
                        <span className="text-red-500 line-through">{correction.original}</span> → <span className="text-green-600">{correction.corrected}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <p className="text-sm font-medium text-blue-700">Vocabulaire utile:</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-600">
                    {message.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-1 text-xs text-gray-500">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleInputSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message in French..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            disabled={!inputText.trim() || isTyping}
          >
            Send
          </Button>
        </form>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>Tip: Try to write in French as much as possible to practice your skills!</p>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
