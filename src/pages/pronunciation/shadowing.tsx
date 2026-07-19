import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import pronunciationApiService, {
  PronunciationPhrase,
  PronunciationResponse
} from '@/services/api/pronunciationApiService';

type ShadowingStep = 'listen' | 'record' | 'result';

export default function ShadowingPage() {
  const [phrases, setPhrases] = useState<PronunciationPhrase[]>([]);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [step, setStep] = useState<ShadowingStep>('listen');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PronunciationResponse['data'] | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadPhrases = async () => {
      try {
        const response = await pronunciationApiService.getExercises();
        const items = response.data?.items || [];
        const allPhrases = items.flatMap((exercise) => exercise.phrases || []);
        if (allPhrases.length === 0) {
          setError('No pronunciation phrases available yet. Complete some lessons first.');
        } else {
          setPhrases(allPhrases);
        }
      } catch (err) {
        console.error('Error loading phrases:', err);
        setError('Could not load phrases. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadPhrases();
  }, []);

  const phrase = phrases[phraseIndex] || null;

  const playModel = useCallback(() => {
    if (!phrase) return;
    audioRef.current?.pause();
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(phrase.text)}&voice=nova`);
    audioRef.current = audio;
    void audio.play();
    setStep('record');
  }, [phrase]);

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    if (!phrase || typeof MediaRecorder === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setIsAnalyzing(true);
        try {
          const response = await pronunciationApiService.analyzePronunciation(blob, phrase.text);
          if (response.success && response.data) {
            setResult(response.data);
            setStep('result');
          } else {
            setError(response.error?.message || 'Analysis failed. Please try again.');
          }
        } finally {
          setIsAnalyzing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError("Impossible d'accéder au microphone. Vérifiez les autorisations.");
    }
  };

  const nextPhrase = () => {
    setPhraseIndex((i) => (i + 1) % phrases.length);
    setStep('listen');
    setResult(null);
    setError(null);
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Shadowing | French Tutor AI</title>
        <meta name="description" content="Listen to native audio and imitate it — shadowing practice" />
      </Head>

      <div className="max-w-2xl px-4 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Shadowing</h1>
          <p className="text-gray-600">
            Listen to the model, then imitate it immediately. Your imitation is transcribed
            and scored so you can close the gap phrase by phrase.
          </p>
        </div>

        {isLoading && <LoadingState message="Loading phrases..." size="large" />}
        {error && !isLoading && <ErrorMessage message={error} type="error" />}

        {phrase && !isLoading && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="mb-1 text-sm text-gray-500">
              Phrase {phraseIndex + 1} of {phrases.length}
            </p>
            <p className="mb-1 text-2xl font-medium text-gray-800">{phrase.text}</p>
            <p className="mb-6 text-gray-500">{phrase.translation}</p>

            <div className="flex flex-col items-center gap-4">
              <Button size="lg" variant={step === 'listen' ? 'default' : 'outline'} onClick={playModel}>
                🔊 {step === 'listen' ? 'Listen to the model' : 'Listen again'}
              </Button>

              {step !== 'listen' && (
                <Button
                  size="lg"
                  variant={isRecording ? 'destructive' : 'default'}
                  onClick={toggleRecording}
                  disabled={isAnalyzing}
                >
                  {isRecording ? '◼ Stop' : isAnalyzing ? 'Analyzing…' : '🎤 Record your imitation'}
                </Button>
              )}

              {step === 'result' && result && (
                <div className="w-full p-4 mt-2 border border-indigo-100 rounded-lg bg-indigo-50">
                  <p className="mb-1 text-lg font-bold text-center text-indigo-800">
                    {result.feedback.overallScore}%
                  </p>
                  <p className="mb-2 text-sm italic text-center text-gray-600">
                    What we heard: “{result.transcript}”
                  </p>
                  {result.feedback.recommendations?.[0] && (
                    <p className="text-sm text-center text-gray-700">
                      {result.feedback.recommendations[0]}
                    </p>
                  )}
                  <div className="flex justify-center gap-3 mt-4">
                    <Button variant="outline" onClick={() => { setStep('listen'); setResult(null); }}>
                      Try Again
                    </Button>
                    <Button onClick={nextPhrase}>Next Phrase</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
