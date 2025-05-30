import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { pronunciationApiService, PronunciationResponse } from '@/services/api/pronunciationApiService';

interface PronunciationWordScore {
  word: string;
  score: number;
  feedback: string;
}

interface PronunciationProblemSound {
  sound: string;
  description: string;
}

const AI_PRONUNCIATION_PHRASES = [
  {
    id: 1,
    text: "Bonjour, comment allez-vous aujourd'hui?",
    translation: "Hello, how are you today?",
    difficulty: "beginner"
  },
  {
    id: 2,
    text: "Je voudrais un café au lait, s'il vous plaît.",
    translation: "I would like a coffee with milk, please.",
    difficulty: "beginner"
  },
  {
    id: 3,
    text: "Pourriez-vous me recommander un bon restaurant?",
    translation: "Could you recommend a good restaurant to me?",
    difficulty: "intermediate"
  },
  {
    id: 4,
    text: "J'ai besoin d'aide pour comprendre cette explication.",
    translation: "I need help understanding this explanation.",
    difficulty: "intermediate"
  },
  {
    id: 5,
    text: "Cette situation nécessite une analyse approfondie des données.",
    translation: "This situation requires an in-depth analysis of the data.",
    difficulty: "advanced"
  }
];

export default function AIPronunciationPage() {
  const [selectedPhrase, setSelectedPhrase] = useState(AI_PRONUNCIATION_PHRASES[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PronunciationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize media recorder
  useEffect(() => {
    const initializeRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          audioChunksRef.current = [];
        };

        mediaRecorderRef.current = mediaRecorder;
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setError('Unable to access microphone. Please check your permissions.');
      }
    };

    initializeRecorder();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      setError(null);
      setAnalysisResult(null);
      setAudioBlob(null);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzeRecording = async () => {
    if (!audioBlob) {
      setError('No recording available to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await pronunciationApiService.analyzePronunciation(audioBlob, selectedPhrase.text);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing pronunciation:', err);
      setError('Failed to analyze pronunciation. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <>
      <Head>
        <title>AI-Powered Pronunciation | French Tutor AI</title>
        <meta name="description" content="Practice French pronunciation with AI-powered feedback and analysis" />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI-Powered Pronunciation</h1>
              <p className="mt-2 text-gray-600">Get detailed feedback on your French pronunciation using advanced AI analysis</p>
            </div>
            <Link href="/pronunciation">
              <Button variant="outline">
                ← Back to Exercises
              </Button>
            </Link>
          </div>
        </div>

        {/* Phrase Selection */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Choose a Phrase to Practice</h2>
            <div className="grid gap-3">
              {AI_PRONUNCIATION_PHRASES.map((phrase) => (
                <div
                  key={phrase.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPhrase.id === phrase.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPhrase(phrase)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{phrase.text}</p>
                      <p className="text-sm text-gray-600 mt-1">{phrase.translation}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      phrase.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                      phrase.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {phrase.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recording Section */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Record Your Pronunciation</h2>
            
            <div className="text-center mb-6">
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p className="text-lg font-medium text-gray-800 mb-2">{selectedPhrase.text}</p>
                <p className="text-gray-600">{selectedPhrase.translation}</p>
              </div>

              <div className="flex justify-center space-x-4">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    disabled={isAnalyzing}
                  >
                    🎤 Start Recording
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    className="bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    ⏹️ Stop Recording
                  </Button>
                )}

                {audioBlob && (
                  <>
                    <Button
                      onClick={playAudio}
                      variant="outline"
                      disabled={isAnalyzing}
                    >
                      ▶️ Play Recording
                    </Button>
                    <Button
                      onClick={analyzeRecording}
                      className="bg-primary-500 hover:bg-primary-600 text-white"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Analyzing...' : '🔍 Analyze Pronunciation'}
                    </Button>
                  </>
                )}
              </div>

              {isRecording && (
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">Recording...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="mb-6">
            <div className="p-6">
              <LoadingState message="Analyzing your pronunciation..." size="large" />
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && analysisResult.success && analysisResult.data && (
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pronunciation Analysis</h2>
              
              {/* Overall Score */}
              <div className={`p-4 rounded-lg mb-6 ${getScoreBackground(analysisResult.data.feedback.overallScore)}`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysisResult.data.feedback.overallScore)}`}>
                    {analysisResult.data.feedback.overallScore}%
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        analysisResult.data.feedback.overallScore >= 80 ? 'bg-green-500' :
                        analysisResult.data.feedback.overallScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${analysisResult.data.feedback.overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Transcription */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">What we heard:</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-800">{analysisResult.data.transcript}</p>
                </div>
              </div>

              {/* Word Scores */}
              {analysisResult.data.feedback.wordScores && analysisResult.data.feedback.wordScores.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Word-by-Word Analysis</h3>
                  <div className="grid gap-2">
                    {analysisResult.data.feedback.wordScores.map((wordScore, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <span className="font-medium">{wordScore.word}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getScoreColor(wordScore.score)}`}>
                            {wordScore.score}%
                          </span>
                          {wordScore.feedback && (
                            <span className="text-sm text-gray-600">({wordScore.feedback})</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Problem Sounds */}
              {analysisResult.data.feedback.problemSounds && analysisResult.data.feedback.problemSounds.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Sounds to Work On</h3>
                  <div className="grid gap-2">
                    {analysisResult.data.feedback.problemSounds.map((sound, index) => (
                      <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-yellow-800">{sound.sound}</span>
                          <span className="text-yellow-700">{sound.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {analysisResult.data.feedback.recommendations && analysisResult.data.feedback.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {analysisResult.data.feedback.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-primary-500 mt-1">•</span>
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* No Results Message */}
        {analysisResult && !analysisResult.success && (
          <Card>
            <div className="p-6 text-center">
              <p className="text-gray-600">
                {analysisResult.error?.message || 'Unable to analyze pronunciation. Please try again.'}
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
