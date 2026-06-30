"use client"

import { useState, useRef } from "react"
import { 
  Mic, 
  MicOff, 
  Volume2, 
  History, 
  Terminal, 
  Zap,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { orVoiceAssistantMedicalQuery } from "@/ai/flows/or-voice-assistant-medical-query"

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'assistant', text: string}[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert("المتصفح لا يدعم التعرف على الصوت. استخدم Chrome.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'ar-SA'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      handleSendMessage(text)
    }

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  const handleSendMessage = async (text: string) => {
    setIsListening(false)
    setIsProcessing(true)
    setChatHistory(prev => [...prev, { role: 'user', text }])
    
    try {
      const response = await orVoiceAssistantMedicalQuery(text)
      setChatHistory(prev => [...prev, { role: 'assistant', text: response.textResponse }])
      
      if (response.audioResponse) {
        if (!audioRef.current) {
          audioRef.current = new Audio(response.audioResponse)
        } else {
          audioRef.current.src = response.audioResponse
        }
        audioRef.current.play()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-12rem)] max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold">OR Assistant</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live & Scrubbed
            </Badge>
            <span className="text-xs text-muted-foreground italic">تكلم بالعربي أو الإنجليزي</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <History className="w-4 h-4" />
            Session History
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-vivid-azure">
            <Volume2 className="w-4 h-4" />
            Audio Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="md:col-span-2 flex flex-col gap-4">
          <Card className="flex-1 bg-card/20 border-border/50 backdrop-blur-md overflow-hidden flex flex-col">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                    <Mic className="w-12 h-12 mb-4" />
                    <p className="text-lg font-headline">في انتظار أمر صوتي...</p>
                    <p className="text-sm">اضغط الزر وتكلم بالعربي أو الإنجليزي</p>
                  </div>
                )}
                
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-secondary/50 border border-border rounded-tl-none font-headline font-medium'
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 p-4 rounded-2xl rounded-tl-none border border-border flex items-center gap-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-xs text-muted-foreground">جاري التحليل...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="p-6 bg-card/40 border-t border-border/50">
               <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    {isListening && (
                      <div className="absolute inset-0 -m-4 rounded-full bg-accent/20 animate-ping" />
                    )}
                    <Button 
                      onClick={handleToggleListening}
                      size="lg" 
                      variant={isListening ? 'destructive' : 'default'}
                      className="w-20 h-20 rounded-full shadow-2xl transition-all duration-500 scale-100 active:scale-90"
                    >
                      {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    </Button>
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-headline font-bold transition-all ${isListening ? 'text-accent' : 'text-muted-foreground'}`}>
                      {isListening ? 'يستمع... تكلم الآن' : 'اضغط للبدء'}
                    </p>
                    {transcript && (
                      <p className="text-xs text-muted-foreground mt-1">"{transcript}"</p>
                    )}
                  </div>
               </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-headline flex items-center gap-2">
                <Activity className="w-4 h-4 text-accent" />
                Live Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Signal Strength</span>
                    <span className="text-accent">Excellent</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[92%]" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Latency</p>
                    <p className="text-lg font-code text-accent">42ms</p>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Vocal Clarity</p>
                    <p className="text-lg font-code text-green-500">98%</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-headline flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" className="w-full justify-start gap-2 h-9 text-xs" onClick={() => handleSendMessage("ابدأ تسجيل الملاحظات الجراحية")}>
                <Zap className="w-3 h-3" /> تسجيل ملاحظة جراحية
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 h-9 text-xs" onClick={() => handleSendMessage("سجل حدث داخل العملية: نجح التثبيت")}>
                <Zap className="w-3 h-3" /> تسجيل حدث جراحي
              </Button>
              <Button variant="secondary" className="w-full justify-start gap-2 h-9 text-xs" onClick={() => handleSendMessage("اطلب مراجعة بالذكاء الاصطناعي")}>
                <Zap className="w-3 h-3" /> AI Visual Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
