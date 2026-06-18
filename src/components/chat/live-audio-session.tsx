'use client';

import * as React from 'react';
import { X, Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';

interface LiveAudioSessionProps {
  onClose: () => void;
  onSpeechResult: (text: string) => void;
  lang: 'en' | 'ar';
}

export function LiveAudioSession({ onClose, onSpeechResult, lang }: LiveAudioSessionProps) {
  const [isListening, setIsListening] = React.useState(false);
  const [dots, setDots] = React.useState<number[]>([]);
  const recognitionRef = React.useRef<any>(null);
  const t = translations[lang];

  React.useEffect(() => {
    // Simulated waveform for visual feedback
    const interval = setInterval(() => {
      setDots(Array.from({ length: 20 }, () => Math.random() * 40 + 5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }

    if (!isListening) {
      const recognition = new SpeechRecognition();
      // FORCE CORRECT LANGUAGE SUPPORT
      recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        onSpeechResult(text);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech Recognition Error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
      <Button variant="ghost" size="icon" className="absolute top-6 right-6 text-white/50 hover:text-white" onClick={onClose}>
        <X className="w-8 h-8" />
      </Button>

      <div className="flex flex-col items-center gap-12 max-w-md w-full text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative h-40 w-40 rounded-full border-2 border-accent/30 flex items-center justify-center bg-black/50 shadow-[0_0_50px_rgba(0,255,255,0.2)]">
            <Volume2 className={`w-16 h-16 text-accent ${isListening ? 'animate-pulse' : ''}`} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-headline font-bold text-white uppercase tracking-widest">{t.liveAudio}</h2>
          <p className="text-accent text-sm font-bold uppercase tracking-widest animate-pulse">
            {isListening ? t.listening : (lang === 'ar' ? 'جاهز للإملاء' : 'READY FOR DICTATION')}
          </p>
        </div>

        <div className="flex items-end justify-center gap-1 h-12 w-full">
          {dots.map((h, i) => (
            <div 
              key={i} 
              className="w-1 bg-accent rounded-full transition-all duration-100" 
              style={{ height: `${isListening ? h : 5}px`, opacity: isListening ? 1 : 0.2 }}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <Button 
            size="lg" 
            className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${isListening ? 'bg-red-500 scale-110' : 'bg-accent'}`}
            onClick={toggleListening}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </Button>
        </div>

        <p className="text-white/40 text-xs italic">
          {lang === 'ar' ? 'تم تفعيل النقاش السريري بدون استخدام اليدين.' : 'Hands-free clinical discussion enabled.'}
        </p>
      </div>
    </div>
  );
}
