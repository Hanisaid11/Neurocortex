"use client"

import { useState } from "react"
import { Search, Loader2, BookOpen, Quote, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { smartMedicalLiteratureSearch, type SmartMedicalLiteratureSearchOutput } from "@/ai/flows/smart-medical-literature-search"

export default function KnowledgeHubPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SmartMedicalLiteratureSearchOutput | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await smartMedicalLiteratureSearch({ question: query })
      setResult(response)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">Knowledge <span className="text-primary">Hub</span></h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Query over 20+ core neurosurgery textbooks and journals using AI-powered RAG search for cited, evidence-based answers.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all rounded-full" />
        <div className="relative flex gap-2 p-2 bg-card border border-border rounded-full shadow-2xl">
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinical questions (e.g., 'Grade III meningioma management')..." 
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg px-6 h-12"
          />
          <Button type="submit" size="icon" className="rounded-full w-12 h-12 shrink-0" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          </Button>
        </div>
      </form>

      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-1/2 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-primary/20 bg-primary/5 shadow-inner overflow-hidden">
            <CardHeader className="border-b border-primary/10 bg-primary/10 px-6 py-4">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="w-5 h-5" />
                <span className="font-headline font-semibold">Evidence-Based Synthesis</span>
              </div>
            </CardHeader>
            <CardContent className="p-8 text-lg leading-relaxed text-foreground/90">
              {result.answer}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-headline font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Quote className="w-4 h-4" /> Supporting Citations
              </h3>
              <div className="space-y-2">
                {result.citations.map((cite, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card border border-border/50 text-sm font-code flex items-start gap-3 hover:border-accent transition-colors group">
                    <span className="text-accent group-hover:scale-110 transition-transform">[{i + 1}]</span>
                    <span>{cite}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-secondary/30 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Related Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {["Treatment protocols", "Prognostic factors", "Surgical approaches"].map((topic, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all">
                      <span>{topic}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12">
          {[
            { label: "Operative Guidelines", desc: "AANS/CNS protocols" },
            { label: "Pharmacology", desc: "Neuro-oncology dosages" },
            { label: "Anatomy", desc: "Microsurgical landmarks" }
          ].map((cat, i) => (
            <Card key={i} className="bg-card/30 border-dashed hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6">
                <p className="font-headline font-semibold group-hover:text-primary transition-colors">{cat.label}</p>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}