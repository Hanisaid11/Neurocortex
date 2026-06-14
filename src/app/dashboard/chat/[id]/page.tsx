'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { 
  Send, 
  Mic, 
  Paperclip, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Database,
  BookOpen,
  History,
  Info,
  ExternalLink,
  Loader2,
  BrainCircuit,
  FolderOpen,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { storage, type ChatSession, type ChatMessage } from '@/lib/storage';
import { unifiedMedicalChat } from '@/ai/flows/unified-medical-chat-flow';

export default function ChatWorkspace() {
  const { id } = useParams();
  const [chat, setChat] = React.useState<ChatSession | null>(null);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const chats = storage.getChats();
    const current = chats.find(c => c.id === id);
    if (current) setChat(current);
  }, [id]);

  React.useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [chat?.messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const updatedChat = {
      ...chat,
      messages: [...chat.messages, userMsg],
      lastUpdated: Date.now()
    };

    setChat(updatedChat);
    setInput('');
    setLoading(true);

    try {
      const profile = storage.getProfile();
      const response = await unifiedMedicalChat({
        message: input,
        history: updatedChat.messages.map(m => ({ role: m.role, content: m.content })),
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

  if (!chat) return <div className="p-8">Session not found.</div>;

  const isCase = chat.type === 'case';

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-6xl mx-auto gap-4">
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
                {isCase ? 'CLINICAL CASE' : 'GENERAL DISCUSSION'}
              </Badge>
              Active Since: {new Date(chat.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary hidden md:flex">
            <History className="w-3 h-3 mr-1" /> Persistent State
          </Badge>
          <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent">
            <BrainCircuit className="w-3 h-3 mr-1" /> Multi-modal Context
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 min-h-0">
        <Card className="lg:col-span-3 flex flex-col bg-card/20 border-border/50 backdrop-blur-md overflow-hidden shadow-2xl">
          <ScrollArea ref={scrollRef} className="flex-1 p-6">
            <div className="space-y-6">
              {chat.messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-30">
                  <BookOpen className="w-16 h-16 mb-4" />
                  <p className="text-xl font-headline font-bold">
                    {isCase ? 'Initiate Clinical Case Discussion' : 'Ask Any Neurosurgical Question'}
                  </p>
                  <p className="text-sm max-w-md">
                    {isCase 
                      ? 'Upload DICOM scans, pathology reports, or ask complex surgical management questions.'
                      : 'Everyday Q&A, theoretical concepts, or literature summaries.'
                    }
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
                    {m.role === 'assistant' && (
                      <div className="mt-4 pt-4 border-t border-border/20 flex gap-2">
                        <Badge variant="secondary" className="text-[9px]">Verified Source</Badge>
                        <Badge variant="secondary" className="text-[9px]">AANS/CNS Guidelines</Badge>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-card/50 p-5 rounded-2xl rounded-tl-none border border-border/30 flex items-center gap-4">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-[10px] font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Synthesizing clinical data...</span>
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
                  placeholder={isCase ? "Analyze case or upload files..." : "Ask a general question..."}
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm h-12"
                />
                <div className="flex gap-1 items-center px-1">
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-accent hover:bg-accent/10">
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    size="icon" 
                    className="h-10 w-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            {isCase && (
              <div className="flex gap-4 mt-3 px-3">
                <button className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 hover:text-accent transition-colors">
                  <ImageIcon className="w-3 h-3" /> Add MRI/CT
                </button>
                <button className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 hover:text-accent transition-colors">
                  <Video className="w-3 h-3" /> Surgical Video
                </button>
                <button className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5 hover:text-accent transition-colors">
                  <FileText className="w-3 h-3" /> Pathology Report
                </button>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4 hidden md:block">
          <Card className="bg-primary/5 border-primary/20 shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                Case Context Bridge
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="p-3 bg-card border border-border/30 rounded-lg group cursor-pointer hover:border-primary/50 transition-all">
                <p className="text-[9px] text-muted-foreground font-bold uppercase mb-1">Historical Correlation</p>
                <p className="text-[11px] font-medium text-foreground group-hover:text-primary">Meningioma Study #242</p>
                <p className="text-[9px] text-accent mt-1 flex items-center gap-1">
                  Reference Logic <ExternalLink className="w-2 h-2" />
                </p>
              </div>
              <div className="p-3 bg-card border border-border/30 rounded-lg">
                <p className="text-[9px] text-muted-foreground font-bold uppercase mb-1">AI Adaptive Preference</p>
                <p className="text-[11px] italic text-muted-foreground leading-relaxed">
                  "You prioritize conservative management for small ACOM aneurysms."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20 shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <Info className="w-4 h-4" />
                Clinical Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-foreground/80">
                  <div className="w-1 h-1 rounded-full bg-accent shadow-[0_0_5px_cyan]" />
                  <span>Suspected Grade II Astrocytoma</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-foreground/80">
                  <div className="w-1 h-1 rounded-full bg-accent shadow-[0_0_5px_cyan]" />
                  <span>Wait-and-scan recommended</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
