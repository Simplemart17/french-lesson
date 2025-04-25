import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface AudioRecorderProps {
  maxDuration?: number; // in seconds
  onRecordingComplete?: (blob: Blob, url: string) => void;
}

export default function AudioRecorder({ maxDuration = 120, onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // In a real implementation, this would use the MediaRecorder API
    // For this demo, we'll simulate recording with a timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxDuration - 1) {
          stopRecording();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Simulate starting the actual recording
    console.log('Recording started...');
  };
  
  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
    
    // Simulate getting a recording result
    // In a real app, this would process the actual recording
    setTimeout(() => {
      // Create a fake blob and URL
      const fakeBlob = new Blob(['audio data'], { type: 'audio/mp3' });
      const fakeUrl = 'data:audio/mp3;base64,fake-audio-data';
      
      setAudioBlob(fakeBlob);
      setAudioUrl(fakeUrl);
      
      if (onRecordingComplete) {
        onRecordingComplete(fakeBlob, fakeUrl);
      }
    }, 500);
  };
  
  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl('');
    setRecordingTime(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div className="p-6 border border-orange-100 rounded-lg bg-orange-50">
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
                Recording: {formatTime(recordingTime)}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button className="p-2 mr-3 text-white transition-colors bg-indigo-600 rounded-full hover:bg-indigo-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <div>
                  <p className="font-medium text-gray-800">Your Recording</p>
                  <p className="text-xs text-gray-500">{formatTime(recordingTime)} • Recorded just now</p>
                </div>
              </div>
              <div className="flex">
                <button className="mr-2 text-gray-500 hover:text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
                <button 
                  onClick={resetRecording}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button size="sm" variant="outline" onClick={resetRecording}>
              Record Again
            </Button>
            <Button size="sm">
              Submit for Feedback
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}