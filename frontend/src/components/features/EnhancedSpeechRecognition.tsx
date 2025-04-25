import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// Define the SpeechRecognition type
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  onend: () => void;
}

// Define the window with SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

interface PronunciationFeedback {
  word: string;
  expected: string;
  actual: string;
  isCorrect: boolean;
  tips?: string;
}

interface EnhancedSpeechRecognitionProps {
  targetPhrase: string;
  language?: string;
  onComplete?: (transcript: string, score: number, feedback: PronunciationFeedback[]) => void;
}

const EnhancedSpeechRecognition = ({
  targetPhrase,
  language = 'fr-FR',
  onComplete
}: EnhancedSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pronunciationScore, setPronunciationScore] = useState(0);
  const [feedback, setFeedback] = useState<PronunciationFeedback[]>([]);
  const [volume, setVolume] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const windowWithSpeech = window as WindowWithSpeechRecognition;
      const SpeechRecognition = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language;
        
        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(finalTranscript);
          }
          
          if (interimTranscript) {
            setInterimTranscript(interimTranscript);
          }
        };
        
        recognition.onerror = (event) => {
          setError(`Error occurred in recognition: ${event.error}`);
          setIsListening(false);
          stopAudioAnalysis();
        };
        
        recognition.onend = () => {
          setIsListening(false);
          stopAudioAnalysis();
        };
        
        recognitionRef.current = recognition;
      } else {
        setError('Speech recognition is not supported in this browser.');
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopAudioAnalysis();
    };
  }, [language]);
  
  // Start audio analysis for volume visualization
  const startAudioAnalysis = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyserRef.current = analyser;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedVolume = Math.min(100, Math.max(0, avg * 2)); // Scale to 0-100
        
        setVolume(normalizedVolume);
        
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      
      updateVolume();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Error accessing microphone. Please check your permissions.');
    }
  };
  
  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    setVolume(0);
  };
  
  const startListening = async () => {
    setError('');
    setTranscript('');
    setInterimTranscript('');
    setIsSubmitted(false);
    setFeedback([]);
    
    if (recognitionRef.current) {
      try {
        await startAudioAnalysis();
        setIsListening(true);
        recognitionRef.current.start();
      } catch (err) {
        setError('Error starting speech recognition. Please try again.');
        setIsListening(false);
        stopAudioAnalysis();
        console.error('Speech recognition error:', err);
      }
    } else {
      setError('Speech recognition is not supported in this browser.');
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    stopAudioAnalysis();
  };
  
  const analyzePronunciation = () => {
    setIsSubmitted(true);
    
    // Split the target phrase and transcript into words
    const targetWords = targetPhrase.toLowerCase().split(/\s+/);
    const spokenWords = transcript.toLowerCase().split(/\s+/);
    
    // Generate feedback for each word
    const wordFeedback: PronunciationFeedback[] = [];
    
    // Common French pronunciation challenges
    const pronunciationTips: Record<string, string> = {
      'r': 'The French "r" is pronounced at the back of the throat, not with the tongue tip like in English.',
      'u': 'The French "u" sound is made with rounded lips and the tongue positioned high in the mouth.',
      'e': 'The French "e" at the end of words is often silent or very subtle.',
      'j': 'The French "j" is softer than in English, similar to the "s" in "measure".',
      'an': 'The "an" sound in French is nasal - the air passes through the nose, not the mouth.',
      'on': 'The "on" sound in French is nasal - try to direct the sound through your nose.',
      'in': 'The "in" sound in French is nasal - the air should pass through your nose.',
      'en': 'The "en" sound in French is nasal - similar to "an" but with a different mouth position.',
      'ou': 'The French "ou" is pronounced like "oo" in "food", with rounded lips.',
      'oi': 'The French "oi" is pronounced like "wa" in "water".',
      'ai': 'The French "ai" is typically pronounced like "e" in "bed".',
      'eu': 'The French "eu" has no English equivalent - try rounding your lips while saying "e".',
      'ch': 'The French "ch" is softer than in English, similar to "sh" in "ship".',
    };
    
    // Compare words and generate feedback
    const maxWords = Math.max(targetWords.length, spokenWords.length);
    for (let i = 0; i < maxWords; i++) {
      const targetWord = i < targetWords.length ? targetWords[i] : '';
      const spokenWord = i < spokenWords.length ? spokenWords[i] : '';
      
      if (!targetWord || !spokenWord) {
        // Missing or extra word
        wordFeedback.push({
          word: targetWord || spokenWord,
          expected: targetWord,
          actual: spokenWord,
          isCorrect: false,
          tips: !targetWord ? 'Extra word' : 'Missing word'
        });
        continue;
      }
      
      // Check if words match
      const isCorrect = targetWord === spokenWord;
      
      // Generate pronunciation tips
      let tips = '';
      if (!isCorrect) {
        // Look for common pronunciation challenges
        for (const [sound, tip] of Object.entries(pronunciationTips)) {
          if (targetWord.includes(sound) && targetWord !== spokenWord) {
            tips = tip;
            break;
          }
        }
        
        // If no specific tip found, provide a general one
        if (!tips) {
          tips = `Try to pronounce "${targetWord}" more clearly.`;
        }
      }
      
      wordFeedback.push({
        word: targetWord,
        expected: targetWord,
        actual: spokenWord,
        isCorrect,
        tips: isCorrect ? undefined : tips
      });
    }
    
    // Calculate overall score (percentage of correct words)
    const correctWords = wordFeedback.filter(fb => fb.isCorrect).length;
    const score = Math.round((correctWords / targetWords.length) * 100);
    
    setPronunciationScore(score);
    setFeedback(wordFeedback);
    
    if (onComplete) {
      onComplete(transcript, score, wordFeedback);
    }
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Pronunciation Practice</h3>
        
        <div className="mb-6">
          <div className="mb-2 text-sm text-gray-500">Target phrase:</div>
          <div className="p-4 text-lg font-medium border border-gray-200 rounded-lg bg-gray-50">
            {targetPhrase}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="mb-2 text-sm text-gray-500">Your speech:</div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px] relative">
            {transcript ? (
              <p className="text-gray-800">{transcript}</p>
            ) : interimTranscript ? (
              <p className="italic text-gray-500">{interimTranscript}</p>
            ) : (
              <p className="italic text-gray-400">
                {isListening ? 'Listening...' : 'Press the microphone button and speak'}
              </p>
            )}
            
            {/* Volume visualization */}
            {isListening && (
              <div className="absolute flex items-center space-x-1 -translate-y-1/2 right-4 top-1/2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div 
                    key={level}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      volume >= level * 20 ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                    style={{ 
                      height: `${Math.min(30, Math.max(5, level * 5 + (volume >= level * 20 ? volume / 10 : 0)))}px` 
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}
        
        <div className="flex justify-center mb-6">
          {!isListening ? (
            <Button 
              onClick={startListening}
              className="flex items-center justify-center w-16 h-16 rounded-full"
              disabled={isSubmitted}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </Button>
          ) : (
            <Button 
              onClick={stopListening}
              variant="destructive"
              className="flex items-center justify-center w-16 h-16 rounded-full animate-pulse"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </Button>
          )}
        </div>
        
        {transcript && !isSubmitted && (
          <div className="flex justify-center">
            <Button onClick={analyzePronunciation}>
              Check Pronunciation
            </Button>
          </div>
        )}
        
        {/* Pronunciation Feedback */}
        {isSubmitted && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Pronunciation Feedback</h4>
              <div className="flex items-center">
                <div className="mr-2 text-sm text-gray-600">Score:</div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  pronunciationScore >= 80 
                    ? 'bg-green-100 text-green-800' 
                    : pronunciationScore >= 50 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pronunciationScore}%
                </div>
              </div>
            </div>
            
            <div className="mb-6 space-y-3">
              {feedback.map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border ${
                    item.isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">
                        {item.word}
                      </div>
                      {!item.isCorrect && (
                        <div className="mt-1 text-sm">
                          <span className="text-gray-600">You said: </span>
                          <span className={item.actual ? 'text-red-600 font-medium' : 'text-gray-500 italic'}>
                            {item.actual || '(missing)'}
                          </span>
                        </div>
                      )}
                      {item.tips && (
                        <div className="mt-2 text-sm text-gray-700">
                          <span className="font-medium">Tip: </span>
                          {item.tips}
                        </div>
                      )}
                    </div>
                    <div>
                      {item.isCorrect ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h5 className="mb-2 font-medium text-blue-800">Overall Assessment</h5>
              <p className="text-blue-700">
                {pronunciationScore >= 80 
                  ? 'Excellent pronunciation! Keep practicing to maintain your skills.' 
                  : pronunciationScore >= 50 
                  ? 'Good effort! Focus on the pronunciation tips to improve further.' 
                  : 'Keep practicing! Pay attention to the pronunciation tips and try again.'}
              </p>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button onClick={startListening}>
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedSpeechRecognition;
