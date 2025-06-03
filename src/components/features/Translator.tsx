import { useState, useEffect, useRef } from 'react';
import { translateText, detectLanguage, LanguageCode } from '@/services/translationService';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

interface TranslatorProps {
  initialText?: string;
  initialSourceLang?: LanguageCode;
  initialTargetLang?: LanguageCode;
  onTranslationComplete?: (result: { 
    original: string; 
    translated: string; 
    sourceLang: LanguageCode; 
    targetLang: LanguageCode; 
  }) => void;
  allowLanguageSelection?: boolean;
  showControls?: boolean;
  minHeight?: number;
  showAddToVocabulary?: boolean;
  className?: string;
}

const Translator = ({
  initialText = '',
  initialSourceLang = 'auto',
  initialTargetLang = 'fr',
  onTranslationComplete,
  allowLanguageSelection = true,
  showControls = true,
  minHeight = 100,
  showAddToVocabulary = true,
  className = '',
}: TranslatorProps) => {
  const [sourceText, setSourceText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<LanguageCode>(initialSourceLang);
  const [targetLang, setTargetLang] = useState<LanguageCode>(initialTargetLang);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<Array<{ original: string; translated: string; sourceLang: LanguageCode; targetLang: LanguageCode; }>>([]);
  
  const sourceTextareaRef = useRef<HTMLTextAreaElement>(null);
  const translateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Languages available for translation
  const availableLanguages = [
    { code: 'en' as LanguageCode, name: 'English' },
    { code: 'fr' as LanguageCode, name: 'French' },
    { code: 'auto' as LanguageCode, name: 'Auto-detect' },
  ];

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, []);

  // Auto-translate when source text changes (with debounce)
  useEffect(() => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    if (translateTimeoutRef.current) {
      clearTimeout(translateTimeoutRef.current);
    }

    translateTimeoutRef.current = setTimeout(() => {
      handleTranslate();
    }, 800); // Debounce for 800ms
    
    return () => {
      if (translateTimeoutRef.current) {
        clearTimeout(translateTimeoutRef.current);
      }
    };
  }, [sourceText, sourceLang, targetLang]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    setError(null);
    
    try {
      // Auto-detect language if set to auto
      let actualSourceLang = sourceLang;
      if (sourceLang === 'auto') {
        const detection = await detectLanguage(sourceText);
        actualSourceLang = detection.language;
        setDetectedLanguage(actualSourceLang);
      }
      
      // Don't translate if source and target languages are the same
      if (actualSourceLang === targetLang) {
        setTranslatedText(sourceText);
        setIsTranslating(false);
        return;
      }
      
      const result = await translateText(sourceText, actualSourceLang, targetLang);
      
      setTranslatedText(result.translatedText);
      
      if (onTranslationComplete) {
        onTranslationComplete({
          original: sourceText,
          translated: result.translatedText,
          sourceLang: actualSourceLang,
          targetLang: targetLang,
        });
      }
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleSwapLanguages = () => {
    // Don't swap if either language is auto-detect
    if (sourceLang === 'auto' || targetLang === 'auto') {
      return;
    }
    
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  const handleClearText = () => {
    setSourceText('');
    setTranslatedText('');
    setError(null);
    if (sourceTextareaRef.current) {
      sourceTextareaRef.current.focus();
    }
  };
  
  const handleSaveToVocabulary = () => {
    if (!sourceText.trim() || !translatedText.trim()) return;
    
    const newPhrase = {
      original: sourceText,
      translated: translatedText,
      sourceLang: sourceLang === 'auto' ? (detectedLanguage || 'en' as LanguageCode) : sourceLang,
      targetLang: targetLang,
    };
    
    // Add to saved phrases and store in local storage
    const updatedPhrases = [...savedPhrases, newPhrase];
    setSavedPhrases(updatedPhrases);
    localStorage.setItem('savedTranslations', JSON.stringify(updatedPhrases));
    
    // Show confirmation
    toast.success('Phrase saved to vocabulary!');
  };
  
  const handleSourceLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceLang(e.target.value as LanguageCode);
    setDetectedLanguage(null);
  };
  
  const getLanguageLabel = (code: LanguageCode): string => {
    return availableLanguages.find(lang => lang.code === code)?.name || code;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Source Language Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            {allowLanguageSelection ? (
              <select
                value={sourceLang}
                onChange={handleSourceLangChange}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {availableLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-sm font-medium text-gray-700">
                {getLanguageLabel(sourceLang)}
                {sourceLang === 'auto' && detectedLanguage && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Detected: {getLanguageLabel(detectedLanguage)})
                  </span>
                )}
              </div>
            )}
            
            {showControls && (
              <button
                onClick={handleClearText}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
          
          <textarea
            ref={sourceTextareaRef}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-primary-500 focus:border-primary-500"
            style={{ minHeight: `${minHeight}px` }}
          />
        </div>
        
        {/* Controls for mobile */}
        <div className="flex items-center justify-center my-2 md:hidden">
          {showControls && (
            <button
              onClick={handleSwapLanguages}
              disabled={sourceLang === 'auto' || targetLang === 'auto'}
              className={`mx-2 p-2 rounded-full ${
                sourceLang === 'auto' || targetLang === 'auto'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Target Language Section */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            {allowLanguageSelection ? (
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value as LanguageCode)}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {availableLanguages.filter(lang => lang.code !== 'auto').map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            ) : (
              <div className="text-sm font-medium text-gray-700">
                {getLanguageLabel(targetLang)}
              </div>
            )}
            
            {showControls && showAddToVocabulary && sourceText.trim() && translatedText.trim() && (
              <button
                onClick={handleSaveToVocabulary}
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Save
              </button>
            )}
          </div>
          
          <div 
            className={`w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-50 overflow-auto ${
              isTranslating ? 'animate-pulse' : ''
            }`}
            style={{ minHeight: `${minHeight}px` }}
          >
            {isTranslating ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Translating...
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : translatedText ? (
              <div className="whitespace-pre-wrap">{translatedText}</div>
            ) : (
              <div className="text-gray-400">Translation will appear here</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Controls for desktop */}
      <div className="items-center justify-center hidden my-4 md:flex">
        {showControls && (
          <>
            <Button
              onClick={handleTranslate}
              isLoading={isTranslating}
              disabled={!sourceText.trim() || isTranslating}
              className="mr-2"
            >
              Translate
            </Button>
            
            <button
              onClick={handleSwapLanguages}
              disabled={sourceLang === 'auto' || targetLang === 'auto'}
              className={`mx-2 p-2 rounded-full ${
                sourceLang === 'auto' || targetLang === 'auto'
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
              title={
                sourceLang === 'auto' || targetLang === 'auto'
                  ? 'Cannot swap when using auto-detect'
                  : 'Swap languages'
              }
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </>
        )}
      </div>
      
      {/* Character count */}
      <div className="mt-2 text-xs text-right text-gray-500">
        {sourceText.length}/500 characters
      </div>
    </div>
  );
};

export default Translator; 