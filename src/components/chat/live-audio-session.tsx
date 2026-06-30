'use client';

import * as React from 'react';
import { X, Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { orVoiceAssistantMedicalQuery } from '@/ai/flows/or-voice-assistant-medical-query';

interface LiveAudioSessionProps {
  onClose: () => void;
  onSpeechResult: (text: string) => void;
  lang: 'en' | 'ar';
}

type SessionState = 'idle' | 'listening' | 'thinking' | 'speaking';

export function LiveAudioSession({ onClose, onSpeechResult, lang }: LiveAudioSessionProps) {
  const [state, setState] = React.useState<SessionState>('idle');
  const [dots, setDots] = React.useState<number[]>(Array.from({ length: 20 }, () => 5));
  const [lastTranscript, setLastTranscript] = React.useState('');
  const [lastReply, setLastReply] = React.useState('');
  const t = translations[lang];
  const recognitionRef = React.useRef<any>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const activeRef = React.useRef(true);

  React.useEffect(() => {
    activeRef.current = true;
    const interval = setInterval(() => {
      setDots(Array.from({ length: 20 }, () =>
        state === 'listening' || state === 'speaking' ? Math.random() * 40 + 5 : 5
      ));
    }, 100);
    return () => {
      activeRef.current = false;
      clearInterval(interval);
      recognitionRef.current?.stop?.();
      audioRef.current?.pause?.();
    };
  }, [state]);

  const startListening = React.useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.interimResults = false;

    recognition.onresult = async (event: any) => {
      if (!activeRef.current) return;
      const text = event.results[0][0].transcript;
      setLastTranscript(text);
      onSpeechResult(text);
      setState('thinking');

      try {
        const voiceResp = await orVoiceAssistantMedicalQuery(text);
        if (!activeRef.current) return;
        setLastReply(voiceResp.textResponse);

        if (voiceResp.audioResponse) {
          if (!audioRef.current) {
            audioRef.current = new Audio();
          }
          audioRef.current.src = voiceResp.audioResponse;
          setState('speaking');
          audioRef.current.onended = () => {
            if (activeRef.current) {
              setState('idle');
              setTimeout(() => activeRef.current && startListening(), 600);
            }
          };
          audioRef.current.play();
        } else {
          setState('idle');
        }
      } catch (err) {
        console.error('Voice flow error:', err);
        setState('idle');
      }
    };

    recognition.onerror = () => {
      if (activeRef.current) setState('idle');
    };
    recognition.onend = () => {
      if (activeRef.current && state === 'listening') setState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setState('listening');
  }, [lang, onSpeechResult]);

  const toggleListening = () => {
    if (state === 'listening') {
      recognitionRef.current?.stop?.();
      setState('idle');
    } else if (state === 'idle') {
      startListening();
    }
  };

  const statusLabel = {
    idle: lang === 'ar' ? 'اضغط للتحدث' : 'TAP TO SPEAK',
    listening: t.listening || (lang === 'ar' ? 'يستمع...' : 'LISTENING...'),
    thinking: lang === 'ar' ? 'جاري التحليل...' : 'THINKING...',
    speaking: lang === 'ar' ? 'يتحدث...' : 'SPEAKING...',
  }[state];

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={onClose}>
        <X className="w-8 h-8" />
      </Button>

      <div className="flex flex-col items-center gap-8 max-w-md w-full text-center">
        <div className="relative">
          <div className={`absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 ${state !== 'idle' ? 'animate-pulse' : ''}`} />
          <div className="relative h-40 w-40 rounded-full border-2 border-accent/30 flex items-center justify-center bg-black/50 shadow-[0_0_50px_rgba(0,255,255,0.2)]">
            {state === 'thinking' ? (
              <Loader2 className="w-16 h-16 text-accent animate-spin" />
            ) : (
              <Volume2 className={`w-16 h-16 text-accent ${state !== 'idle' ? 'animate-pulse' : ''}`} />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-headline font-bold text-white uppercase tracking-widest">{t.liveAudio || 'Live Audio'}</h2>
          <p className="text-accent text-sm font-bold uppercase tracking-widest animate-pulse">
            {statusLabel}
          </p>
        </div>

        <div className="flex items-end justify-center gap-1 h-12 w-full">
          {dots.map((h, i) => (
            <div
              key={i}
              className="w-1 bg-accent rounded-full transition-all duration-100"
              style={{ height: `${h}px`, opacity: state === 'listening' || state === 'speaking' ? 1 : 0.2 }}
            />
          ))}
        </div>

        {(lastTranscript || lastReply) && (
          <div className="w-full space-y-2 text-left bg-white/5 rounded-xl p-4 max-h-32 overflow-y-auto">
            {lastTranscript && (
              <p className="text-xs text-white/70"><span className="text-accent font-bold">You: </span>{lastTranscript}</p>
            )}
            {lastReply && (
              <p className="text-xs text-white/90"><span className="text-accent font-bold">AI: </span>{lastReply}</p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            size="lg"
            disabled={state === 'thinking' || state === 'speaking'}
            className={`w-20 h-20 rounded-full shadow-2xl ${state === 'listening' ? 'bg-red-500' : 'bg-accent'}`}
            onClick={toggleListening}
          >
            {state === 'listening' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </Button>
        </div>

        <p className="text-white/40 text-xs italic">
          {lang === 'ar' ? 'محادثة مستمرة بدون استخدام اليدين. سيستمع تلقائياً بعد كل رد.' : 'Hands-free continuous discussion. Listens automatically after each reply.'}
        </p>
      </div>
    </div>
  );
}
