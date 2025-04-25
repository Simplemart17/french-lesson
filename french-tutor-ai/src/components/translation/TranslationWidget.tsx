import React, { useState, useCallback, useEffect } from 'react';
import { translateText, detectLanguage, LanguageCode } from '../../services/translationService';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Loader2, ArrowLeftRight, Globe, CopyCheck, Languages, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import '../../styles/animations.css';

const TranslationWidget: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<LanguageCode>('en');
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('fr');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslation = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await translateText(inputText, sourceLanguage, targetLanguage);
      setTranslatedText(result.translatedText);
      
      // If language was auto-detected, update the source language
      if (sourceLanguage === 'auto' && result.detectedLanguage) {
        setSourceLanguage(result.detectedLanguage);
      }
    } catch (err: any) {
      setError(err.message || 'Translation failed');
      toast.error(err.message || 'Translation failed');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLanguage, targetLanguage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Clear translated text when input changes
    if (translatedText) {
      setTranslatedText('');
    }
  };

  const handleSourceLanguageChange = (value: string) => {
    setSourceLanguage(value as LanguageCode);
    if (translatedText) {
      setTranslatedText('');
    }
  };

  const handleTargetLanguageChange = (value: string) => {
    setTargetLanguage(value as LanguageCode);
    if (translatedText) {
      setTranslatedText('');
    }
  };

  const handleSwapLanguages = () => {
    // Only swap if not using auto-detect
    if (sourceLanguage !== 'auto') {
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
      
      // Swap text if there's translated content
      if (translatedText) {
        setInputText(translatedText);
        setTranslatedText('');
      }
    } else {
      toast.warning('Cannot swap when using auto-detect');
    }
  };

  const handleDetectLanguage = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to detect language');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await detectLanguage(inputText);
      setSourceLanguage(result.language);
      toast.success(`Detected language: ${result.language === 'en' ? 'English' : 'French'}`);
    } catch (err: any) {
      setError(err.message || 'Language detection failed');
      toast.error(err.message || 'Language detection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  // Animation effect when translation is complete
  useEffect(() => {
    if (translatedText) {
      const textareaElement = document.getElementById('translatedText');
      if (textareaElement) {
        textareaElement.classList.add('animate-fade-in');
        setTimeout(() => {
          textareaElement.classList.remove('animate-fade-in');
        }, 500);
      }
    }
  }, [translatedText]);

  return (
    <Card className="mx-auto w-full max-w-3xl shadow-lg transition-all hover-lift">
      <CardHeader className="bg-gradient-to-r rounded-t-xl from-primary-50 to-primary-100">
        <div className="flex items-center">
          <Languages className="mr-2 w-6 h-6 text-primary-600" />
          <CardTitle>Text Translation</CardTitle>
        </div>
        <CardDescription>Translate between English and French</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex gap-2 justify-between items-center animate-fade-in">
          <div className="w-1/2">
            <label htmlFor="sourceLanguage" className="block mb-1 text-sm font-medium text-gray-700">
              From
            </label>
            <Select value={sourceLanguage} onValueChange={handleSourceLanguageChange}>
              <SelectTrigger className="border-2 transition-all hover:border-primary-300">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSwapLanguages}
            disabled={sourceLanguage === 'auto' || isLoading}
            className="mt-5 rounded-full transition-all hover:bg-primary-100"
          >
            <ArrowLeftRight className="w-5 h-5 text-primary-600" />
          </Button>
          
          <div className="w-1/2">
            <label htmlFor="targetLanguage" className="block mb-1 text-sm font-medium text-gray-700">
              To
            </label>
            <Select value={targetLanguage} onValueChange={handleTargetLanguageChange}>
              <SelectTrigger className="border-2 transition-all hover:border-primary-300">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex justify-between items-center">
            <label htmlFor="inputText" className="block text-sm font-medium text-gray-700">
              Enter text
            </label>
            {inputText && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDetectLanguage} 
                disabled={isLoading}
                className="-mt-1 h-7 transition-all hover:bg-primary-50"
              >
                <Globe className="mr-1 w-4 h-4 text-primary-600" />
                <span className="text-xs">Detect language</span>
              </Button>
            )}
          </div>
          <Textarea
            id="inputText"
            placeholder="Type or paste text here..."
            value={inputText}
            onChange={handleInputChange}
            rows={5}
            className="border-2 shadow-sm transition-all resize-none focus:border-primary-300 focus:ring-primary-200"
          />
          {inputText && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(inputText)}
              className="mt-1 h-7 transition-all hover:bg-primary-50"
            >
              <CopyCheck className="mr-1 w-4 h-4 text-primary-600" />
              <span className="text-xs">Copy</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <label htmlFor="translatedText" className="block flex items-center text-sm font-medium text-gray-700">
            Translation
            {translatedText && <Sparkles className="ml-2 w-4 h-4 text-amber-500 animate-pulse" />}
          </label>
          <div className="relative">
            <Textarea
              id="translatedText"
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              rows={5}
              className="border-2 border-dashed shadow-sm transition-all resize-none bg-muted/30 focus:border-primary-300"
            />
            {isLoading && (
              <div className="flex absolute inset-0 justify-center items-center bg-white/80">
                <div className="text-center">
                  <Loader2 className="mx-auto w-8 h-8 animate-spin text-primary-600" />
                  <p className="mt-2 text-sm text-gray-600">Translating...</p>
                </div>
              </div>
            )}
          </div>
          {translatedText && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(translatedText)}
              className="mt-1 h-7 transition-all hover:bg-primary-50"
            >
              <CopyCheck className="mr-1 w-4 h-4 text-primary-600" />
              <span className="text-xs">Copy</span>
            </Button>
          )}
        </div>
        
        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-6 bg-gradient-to-r rounded-b-xl from-primary-50 to-primary-100">
        <Button 
          onClick={handleTranslation} 
          disabled={!inputText.trim() || isLoading} 
          className="w-full shadow-md transition-all bg-primary-600 hover:bg-primary-700 hover:shadow-lg"
          variant="primary"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 w-5 h-5" />
              Translate
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationWidget;