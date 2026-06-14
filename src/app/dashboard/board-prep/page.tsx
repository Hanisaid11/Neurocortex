"use client"

import { useState } from "react"
import { GraduationCap, Brain, Loader2, Play, ChevronRight, Check, X, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { generateMedicalQuizAndFlashcards, type MedicalQuizAndFlashcardGenerationOutput } from "@/ai/flows/medical-quiz-and-flashcard-generation"

export default function BoardPrepPage() {
  const [loading, setLoading] = useState(false)
  const [quizData, setQuizData] = useState<MedicalQuizAndFlashcardGenerationOutput | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const result = await generateMedicalQuizAndFlashcards({
        topic: "Vascular Neurosurgery",
        chapters: ["Subarachnoid Hemorrhage", "AVM Grading", "Aneurysm Morphology"],
        difficulty: "hard",
        numberOfQuestions: 5,
        numberOfFlashcards: 5
      })
      setQuizData(result)
      setCurrentQuestion(0)
      setScore(0)
      setSelectedOption(null)
      setShowExplanation(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return
    setSelectedOption(option)
    setShowExplanation(true)
    if (option === quizData?.multipleChoiceQuestions[currentQuestion].correctAnswer) {
      setScore(s => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < (quizData?.multipleChoiceQuestions.length || 0) - 1) {
      setCurrentQuestion(c => c + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Board Prep <span className="text-accent">Simulator</span></h1>
          <p className="text-muted-foreground">High-yield case reviews generated from your Knowledge Hub.</p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="gap-2 h-11 px-6">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Generate Board Cases
        </Button>
      </div>

      {!quizData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
          <Card className="bg-card/50 border-border/50 hover:border-primary/50 transition-all cursor-pointer group" onClick={handleGenerate}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-headline">Neurovascular Suite</CardTitle>
              <CardDescription>Complex aneurysms, AVMs, and stroke management scenarios.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-card/50 border-border/50 hover:border-accent/50 transition-all cursor-pointer group" onClick={handleGenerate}>
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="font-headline">Skull Base & Oncology</CardTitle>
              <CardDescription>Glioma grading, CPA tumors, and surgical approaches.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
            <Loader2 className="w-16 h-16 text-primary animate-spin relative" />
          </div>
          <div>
            <p className="text-xl font-headline font-bold">Synthesizing Clinical Scenarios</p>
            <p className="text-sm text-muted-foreground">Indexing textbooks and clinical guidelines for hard-difficulty cases...</p>
          </div>
        </div>
      )}

      {quizData && !loading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground uppercase font-bold mb-2">
                <span>Progress</span>
                <span>Question {currentQuestion + 1} of {quizData.multipleChoiceQuestions.length}</span>
              </div>
              <Progress value={((currentQuestion + 1) / quizData.multipleChoiceQuestions.length) * 100} className="h-2" />
            </div>
            <div className="px-4 py-2 bg-accent/10 rounded-lg border border-accent/20">
              <span className="text-xs text-muted-foreground block text-center uppercase font-bold">Score</span>
              <span className="text-xl font-headline font-bold text-accent">{score}</span>
            </div>
          </div>

          <Card className="bg-card/50 border-border/50 shadow-2xl overflow-hidden">
            <CardHeader className="bg-secondary/20 border-b border-border/50 px-8 py-10">
              <Badge className="mb-4 bg-primary text-primary-foreground">CASE SCENARIO</Badge>
              <CardTitle className="text-2xl font-headline font-bold leading-tight">
                {quizData.multipleChoiceQuestions[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {quizData.multipleChoiceQuestions[currentQuestion].options.map((option, i) => {
                  const isCorrect = option === quizData.multipleChoiceQuestions[currentQuestion].correctAnswer
                  const isSelected = selectedOption === option
                  
                  let variant = "outline"
                  if (isSelected) {
                    variant = isCorrect ? "bg-green-500/20 border-green-500/50" : "bg-red-500/20 border-red-500/50"
                  } else if (showExplanation && isCorrect) {
                    variant = "bg-green-500/20 border-green-500/50"
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(option)}
                      disabled={!!selectedOption}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                        variant === 'outline' ? 'bg-transparent border-border hover:border-primary/50' : variant
                      }`}
                    >
                      <span className="text-sm font-medium">{option}</span>
                      {isSelected && (isCorrect ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />)}
                      {showExplanation && isCorrect && !isSelected && <Check className="w-5 h-5 text-green-500" />}
                    </button>
                  )
                })}
              </div>

              {showExplanation && (
                <div className="mt-8 p-6 rounded-xl bg-accent/5 border border-accent/20 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-accent" />
                    <span className="text-xs font-headline font-bold text-accent uppercase tracking-widest">Clinical Explanation</span>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/90 italic">
                    {quizData.multipleChoiceQuestions[currentQuestion].explanation}
                  </p>
                  <Button className="mt-6 w-full gap-2 font-headline" onClick={nextQuestion}>
                    {currentQuestion === quizData.multipleChoiceQuestions.length - 1 ? 'Finish Case Review' : 'Next Case Study'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}