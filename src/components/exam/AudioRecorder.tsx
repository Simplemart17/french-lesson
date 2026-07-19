import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { formatTime } from '@/utils/time';

interface AudioRecorderProps {
  maxDuration?: number; // in seconds
  onRecordingComplete?: (blob: Blob, url: string) => void;
}

function pickMimeType(): string {
  if (typeof MediaRecorder === 'undefined') return '';
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

export default function AudioRecorder({ maxDuration = 120, onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioUrlRef = useRef<string>('');

  const cleanupStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        // Detach onstop first so no state update or completion callback fires after unmount
        mediaRecorderRef.current.onstop = null;
        mediaRecorderRef.current.stop();
      }
      cleanupStream();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [cleanupStream]);

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = async () => {
    setError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError("Votre navigateur ne supporte pas l'enregistrement audio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = url;
        setAudioUrl(url);
        cleanupStream();
        onRecordingComplete?.(blob, url);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration - 1) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError("Impossible d'accéder au microphone. Vérifiez les autorisations de votre navigateur.");
      cleanupStream();
    }
  };

  const resetRecording = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = '';
    }
    setAudioUrl('');
    setRecordingTime(0);
    setError(null);
  };

  return (
    <div className="p-6 border border-orange-100 rounded-lg bg-orange-50">
      {error && (
        <p className="mb-4 text-sm text-center text-red-600">{error}</p>
      )}
      {!audioUrl ? (
        <div className="flex flex-col items-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`${isRecording ? 'bg-red-600 animate-pulse' : 'bg-orange-600'} text-white rounded-full p-4 hover:bg-orange-700 transition-colors mb-4`}
          >
            {isRecording ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          <div className="text-center text-orange-800">
            <p className="font-medium">{isRecording ? 'Recording in Progress' : 'Record Your Answer'}</p>
            {isRecording && (
              <p className="mt-2 text-sm">
                Recording: {formatTime(recordingTime)} / {formatTime(maxDuration)}
              </p>
            )}
            {!isRecording && (
              <p className="mt-2 text-sm">Click to start recording</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md p-4 mb-4 bg-white rounded-lg shadow-sm">
            <p className="mb-2 font-medium text-gray-800">Your Recording ({formatTime(recordingTime)})</p>
            <audio controls src={audioUrl} className="w-full">
              Votre navigateur ne supporte pas la lecture audio.
            </audio>
          </div>

          <div className="flex gap-3">
            <Button size="sm" variant="outline" onClick={resetRecording}>
              Record Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
