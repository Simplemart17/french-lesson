import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Shared microphone recording hook. Owns the MediaRecorder/stream lifecycle,
 * including unmount cleanup so the microphone is always released — navigating
 * away mid-recording must never leave the mic indicator on.
 */
export function useRecorder(onComplete: (blob: Blob) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      // Detach onstop first so no callback or state update fires after unmount
      if (recorderRef.current && recorderRef.current.state !== 'inactive') {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const isSupported =
    typeof window !== 'undefined' &&
    typeof MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia);

  const start = useCallback(async () => {
    if (!isSupported || recorderRef.current?.state === 'recording') return;
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        releaseStream();
        setIsRecording(false);
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        onCompleteRef.current(blob);
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      setError("Impossible d'accéder au microphone. Vérifiez les autorisations de votre navigateur.");
      releaseStream();
    }
  }, [isSupported, releaseStream]);

  const stop = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }, []);

  const toggle = useCallback(() => {
    if (isRecording) {
      stop();
    } else {
      void start();
    }
  }, [isRecording, start, stop]);

  return { isRecording, isSupported, error, start, stop, toggle };
}
