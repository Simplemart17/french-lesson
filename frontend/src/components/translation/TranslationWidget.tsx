import React, { useState, useCallback } from 'react';
import { translateText, detectLanguage, LanguageCode } from '../../services/translationService';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { Loader2, ArrowLeftRight, Globe, CopyCheck } from 'lucide-react';
import { toast } from 'sonner';

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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Text Translation</CardTitle>
        <CardDescription>Translate between English and French</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="w-1/2">
            <label htmlFor="sourceLanguage" className="block mb-1 text-sm font-medium">
              From
            </label>
            <Select value={sourceLanguage} onValueChange={handleSourceLanguageChange}>
              <SelectTrigger>
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
            className="mt-5"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </Button>
          
          <div className="w-1/2">
            <label htmlFor="targetLanguage" className="block mb-1 text-sm font-medium">
              To
            </label>
            <Select value={targetLanguage} onValueChange={handleTargetLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <label htmlFor="inputText" className="block text-sm font-medium">
              Enter text
            </label>
            {inputText && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDetectLanguage} 
                disabled={isLoading}
                className="-mt-1 h-7"
              >
                <Globe className="w-4 h-4 mr-1" />
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
            className="resize-none"
          />
          {inputText && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(inputText)}
              className="mt-1 h-7"
            >
              <CopyCheck className="w-4 h-4 mr-1" />
              <span className="text-xs">Copy</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <label htmlFor="translatedText" className="block text-sm font-medium">
            Translation
          </label>
          <Textarea
            id="translatedText"
            placeholder="Translation will appear here..."
            value={translatedText}
            readOnly
            rows={5}
            className="resize-none bg-muted/50"
          />
          {translatedText && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(translatedText)}
              className="mt-1 h-7"
            >
              <CopyCheck className="w-4 h-4 mr-1" />
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
      
      <CardFooter>
        <Button 
          onClick={handleTranslation} 
          disabled={!inputText.trim() || isLoading} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranslationWidget; 