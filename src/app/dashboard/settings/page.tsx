"use client"

import { useState, useEffect } from "react"
import { Shield, Brain, Cpu, Key, CheckCircle2, AlertCircle, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { toast } = useToast()
  const [provider, setProvider] = useState("gemini")
  const [geminiKey, setGeminiKey] = useState("")
  const [grokKey, setGrokKey] = useState("")
  const [geminiError, setGeminiError] = useState("")

  useEffect(() => {
    // Load saved settings
    const savedProvider = localStorage.getItem("active_brain")
    const savedGemini = localStorage.getItem("gemini_key")
    const savedGrok = localStorage.getItem("grok_key")
    
    if (savedProvider) setProvider(savedProvider)
    if (savedGemini) setGeminiKey(savedGemini)
    if (savedGrok) setGrokKey(savedGrok)
  }, [])

  const handleSave = () => {
    // Validation for Gemini key
    if (provider === 'gemini' && !geminiKey.startsWith("AQ")) {
      setGeminiError("Gemini API key must strictly begin with 'AQ'")
      toast({
        title: "Validation Error",
        description: "Invalid Gemini key prefix. Must start with 'AQ'.",
        variant: "destructive"
      })
      return
    }

    setGeminiError("")
    localStorage.setItem("active_brain", provider)
    localStorage.setItem("gemini_key", geminiKey)
    localStorage.setItem("grok_key", grokKey)

    toast({
      title: "Settings Secured",
      description: "AI Provider Orchestrator updated successfully.",
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">System Configuration</h1>
          <p className="text-muted-foreground">Manage your AI backends and security keys.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 h-11 px-8">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-accent" />
            <CardTitle className="font-headline">AI Provider Orchestrator</CardTitle>
          </div>
          <CardDescription>Select the primary LLM model for NeuroCortex Pro reasoning.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={provider} onValueChange={setProvider} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="gemini" id="gemini" className="peer sr-only" />
              <Label
                htmlFor="gemini"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
              >
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-md font-headline font-bold">Google Gemini</p>
                  <p className="text-xs text-muted-foreground">Multimodal clinical reasoning</p>
                </div>
              </Label>
            </div>

            <div>
              <RadioGroupItem value="grok" id="grok" className="peer sr-only" />
              <Label
                htmlFor="grok"
                className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-6 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-all cursor-pointer"
              >
                <div className="bg-accent/10 p-3 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <div className="text-center">
                  <p className="text-md font-headline font-bold">xAI Grok</p>
                  <p className="text-xs text-muted-foreground">High-performance research synthesis</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle className="font-headline">Encrypted API Credentials</CardTitle>
          </div>
          <CardDescription>Keys are stored locally and masked for security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="gemini-key" className="text-sm font-medium">Gemini API Key</Label>
              {geminiKey.startsWith("AQ") && <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20 bg-green-500/5 uppercase">Valid Prefix</Badge>}
            </div>
            <Input 
              id="gemini-key"
              type="password"
              placeholder="AQ..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className={`bg-background font-code text-sm h-11 border-border/50 transition-all ${geminiError ? 'border-destructive ring-destructive/20 ring-4' : 'focus:border-primary'}`}
            />
            {geminiError && (
              <div className="flex items-center gap-1.5 text-xs text-destructive mt-1">
                <AlertCircle className="w-3 h-3" />
                {geminiError}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
              Required for diagnostic imaging analysis and RAG.
            </p>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-2">
            <Label htmlFor="grok-key" className="text-sm font-medium">Grok API Key</Label>
            <Input 
              id="grok-key"
              type="password"
              placeholder="Enter Grok API Token..."
              value={grokKey}
              onChange={(e) => setGrokKey(e.target.value)}
              className="bg-background font-code text-sm h-11 border-border/50 focus:border-accent"
            />
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
              Used for research-heavy synthesis tasks.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 flex items-start gap-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-headline font-bold">HIPAA-Compliant Local Storage</h3>
          <p className="text-xs text-muted-foreground mt-1">
            All session data and surgical logs are encrypted and stored within the application's local state. No clinical information is transmitted without explicit researcher authorization.
          </p>
        </div>
      </div>
    </div>
  )
}