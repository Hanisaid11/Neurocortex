'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { 
  Send, 
  Mic, 
  Paperclip, 
  BookOpen,
  Loader2,
  BrainCircuit,
  FolderOpen,
  MessageSquare,
  Phone,
  FileDown,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { storage, type ChatSession, type ChatMessage } from '@/lib/storage';
import { unifiedMedicalChat } from '@/ai/flows/unified-medical-chat-flow';
import { translations } from '@/lib/translations';
import { LiveAudioSession } from '@/components/chat/live-audio-session';
import { detectRedFlags } from '@/lib/red-flag-detector';
import { RedFlagAlert } from '@/components/clinical/red-flag-alert';

export default function ChatWorkspace() {
  const { id } = useParams();
  const [chat, setChat] = React.useState<ChatSession | null>(null);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [showAudioMode, setShowAudioMode] = React.useState(false);
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');
  const [activeRedFlag, setActiveRedFlag] = React.useState<{title: string, protocol: string[], flag: string} | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const profile = storage.getProfile();
    setLang(profile.preferences.language);
    const chats = storage.getChats();
    const current = chats.find(c => c.id === id);
    if (current) setChat(current);
  }, [id]);

  const t = translations[lang];

  React.useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [chat?.messages]);

  const startDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + ' ' + transcript);
      setIsListening(false);
      // Real-time red flag check for voice input
      const flag = detectRedFlags(transcript);
      if (flag) {
        setActiveRedFlag({ title: flag.title, protocol: flag.protocol, flag: transcript });
      }
    };

    recognition.onerror = () => setIsListening(false);
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || !chat) return;

    // Check for red flags before sending
    const flag = detectRedFlags(text);
    if (flag) {
      setActiveRedFlag({ title: flag.title, protocol: flag.protocol, flag: text });
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    const updatedMessages = [...chat.messages, userMsg];
    const updatedChat = { ...chat, messages: updatedMessages, lastUpdated: Date.now() };

    setChat(updatedChat);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const profile = storage.getProfile();
      const response = await unifiedMedicalChat({
        message: text,
        history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        userProfile: {
          specialty: profile.specialty,
          longTermMemory: profile.longTermMemory
        }
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: Date.now()
      };

      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMsg],
        lastUpdated: Date.now()
      };

      setChat(finalChat);
      
      if (response.memoryUpdate) {
        profile.longTermMemory = [...new Set([...profile.longTermMemory, response.memoryUpdate])];
        storage.saveProfile(profile);
      }

      const allChats = storage.getChats().map(c => c.id === chat.id ? finalChat : c);
      storage.saveChats(allChats);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (!chat) return;
    const reportText = `
NEUROCORTEX PRO - CLINICAL HANDOVER REPORT
==========================================
Date: ${new Date().toLocaleString()}
Case: ${chat.title}
Type: ${chat.type.toUpperCase()}

CASE HISTORY SUMMARY:
${chat.messages.filter(m => m.role === 'user').map(m => `- ${m.content}`).slice(-5).join('\n')}

AI RECENT RECOMMENDATIONS:
${chat.messages.filter(m => m.role === 'assistant').map(m => `- ${m.content}`).slice(-3).join('\n')}

STABILIZATION PROTOCOLS (IF APPLICABLE):
- Maintain ICP < 20 mmHg
- Systolic BP Target: 120-140 mmHg
- Serial Pupil Checks q1h
    `.trim();

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `handover_report_${chat.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!chat) return <div className="p-8">Session not found.</div>;

  const isCase = chat.type === 'case';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-6xl mx-auto gap-4 relative">
      {activeRedFlag && (
        <RedFlagAlert 
          flag={activeRedFlag.flag}
          protocol={activeRedFlag.protocol}
          onClose={() => setActiveRedFlag(null)}
        />
      )}

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-card border border-border/50 shadow-sm ${isCase ? 'text-accent' : 'text-primary'}`}>
            {isCase ? <FolderOpen className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-2xl font-headline font-bold flex items-center gap-2">
              {chat.title}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <Badge variant="outline" className={`py-0 px-2 h-4 border-none text-[8px] ${isCase ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                {isCase ? t.patientCase : t.generalDiscussion}
              </Badge>
              {t.activeSince}: {new Date(chat.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isCase && (
            <Button 
              variant="outline" 
              className="gap-2 border-primary text-primary hover:bg-primary/10"
              onClick={handleGenerateReport}
            >
              <FileDown className="w-4 h-4" />
              {t.generateReport}
            </Button>
          )}
          <Button 
            variant="outline" 
            className="gap-2 border-accent text-accent hover:bg-accent/10"
            onClick={() => setShowAudioMode(true)}
          >
            <Phone className="w-4 h-4" />
            {t.liveAudio}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        <Card className="lg:col-span-3 flex flex-col bg-card/20 border-border/50 backdrop-blur-md overflow-hidden shadow-2xl relative">
          <ScrollArea ref={scrollRef} className="flex-1 p-6">
            <div className="space-y-6">
              {chat.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-30">
                  <BookOpen className="w-16 h-16 mb-4" />
                  <p className="text-xl font-headline font-bold">
                    {isCase ? 'Initiate Clinical Case Discussion' : 'Ask Any Neurosurgical Question'}
                  </p>
                </div>
              )}
              {chat.messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-2xl shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-card border border-border/50 rounded-tl-none font-medium leading-relaxed'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card/50 p-5 rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-4">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-[10px] font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Processing...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-background/60 border-t border-border/50">
            <div className="relative group/input">
              <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within/input:bg-primary/10 transition-all rounded-2xl" />
              <div className="relative flex items-center gap-2 p-2 bg-card/80 border border-border/50 rounded-2xl">
                <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.searchPlaceholder}
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm h-12"
                />
                <div className="flex gap-1 items-center px-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-10 w-10 ${isListening ? 'text-red-500 animate-pulse' : 'text-accent'}`}
                    onClick={startDictation}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button 
                    onClick={() => handleSend()}
                    disabled={loading || !input.trim()}
                    size="icon" 
                    className="h-10 w-10 bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 hidden md:block">
          <Card className="bg-primary/5 border-primary/20 shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                Context Bridge
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
               <p className="text-[11px] italic text-muted-foreground leading-relaxed">
                  Persistent clinical memory is active. AI will cross-reference historical patterns.
               </p>
               <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-[9px] font-bold text-red-500 uppercase flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Red Flag Monitoring
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-1">Real-time pattern recognition enabled for stabilization triggers.</p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAudioMode && (
        <LiveAudioSession 
          onClose={() => setShowAudioMode(false)} 
          onSpeechResult={(text) => handleSend(text)}
          lang={lang}
        />
      )}
    </div>
  );
}
