"use client"

import { useState } from "react"
import { 
  Upload, 
  Search, 
  Maximize, 
  ZoomIn, 
  Sun, 
  Layers, 
  Play, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  Scan
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { medicalImageAnomalyDetection, type MedicalImageAnomalyDetectionOutput } from "@/ai/flows/medical-image-anomaly-detection"
import Image from "next/image"

export default function ImagingPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<MedicalImageAnomalyDetectionOutput | null>(null)
  const [currentView, setCurrentView] = useState("axial")
  const [slice, setSlice] = useState([50])
  const [windowing, setWindowing] = useState([50])

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      // Mock data URI for simulation
      const mockUri = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
      const result = await medicalImageAnomalyDetection({
        mediaDataUri: mockUri,
        context: "72yo male presenting with sudden onset left-sided weakness. Suspected CVA or space-occupying lesion."
      })
      setAnalysisResult(result)
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-3 flex flex-col gap-4">
        <Card className="flex-1 bg-black border-border/50 overflow-hidden relative group">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/20 text-white font-code">
              PATIENT: STERLING, J. | ID: NC-0922
            </Badge>
            <Badge variant="outline" className="bg-black/50 backdrop-blur-md border-white/20 text-white font-code uppercase">
              {currentView} view | slice {slice[0]}
            </Badge>
          </div>

          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="secondary" className="bg-black/50 border-white/10 hover:bg-accent hover:text-accent-foreground"><Maximize className="w-4 h-4" /></Button>
            <Button size="icon" variant="secondary" className="bg-black/50 border-white/10"><ZoomIn className="w-4 h-4" /></Button>
            <Button size="icon" variant="secondary" className="bg-black/50 border-white/10"><Sun className="w-4 h-4" /></Button>
            <Button size="icon" variant="secondary" className="bg-black/50 border-white/10"><Layers className="w-4 h-4" /></Button>
          </div>

          <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
             {/* Mock DICOM Viewer Area */}
             <div 
              className="relative w-full h-full flex items-center justify-center transition-all duration-300"
              style={{ filter: `brightness(${windowing[0] / 50}) contrast(${windowing[0] / 50})` }}
             >
                <Image 
                  src={`https://picsum.photos/seed/brain-${slice[0]}/800/800`} 
                  alt="MRI Scan" 
                  fill
                  className="object-contain"
                  data-ai-hint="medical MRI brain scan"
                />
                
                {analysisResult?.anomaliesDetected && analysisResult.anomalies.map((anomaly, idx) => (
                  <div 
                    key={idx}
                    className="absolute border-2 border-dashed border-red-500 rounded-full animate-pulse flex items-center justify-center"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      top: '40%', 
                      left: '45%' 
                    }}
                  >
                    <span className="text-[10px] bg-red-500 text-white px-1 absolute -top-4 rounded">{anomaly.type}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 space-y-2 bg-black/40 p-3 rounded-lg backdrop-blur-md border border-white/5">
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
              <span>Slice Navigation</span>
              <span>{slice[0]} / 256</span>
            </div>
            <Slider value={slice} onValueChange={setSlice} max={256} step={1} className="[&>span:first-child]:bg-accent" />
          </div>
        </Card>

        <div className="flex gap-4">
          <Card className="flex-1 bg-card/50 border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant={currentView === 'axial' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('axial')}>Axial</Button>
                <Button variant={currentView === 'sagittal' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('sagittal')}>Sagittal</Button>
                <Button variant={currentView === 'coronal' ? 'default' : 'outline'} size="sm" onClick={() => setCurrentView('coronal')}>Coronal</Button>
              </div>
              <div className="flex items-center gap-4 w-1/3">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Slider value={windowing} onValueChange={setWindowing} max={100} step={1} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Vision AI Analyst</CardTitle>
            <CardDescription>Automated anomaly detection for MRI, CT, and Video.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer group">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm font-medium">Upload DICOM / MP4</p>
              <p className="text-xs text-muted-foreground">Drag and drop or click</p>
            </div>
            <Button 
              className="w-full h-12 gap-2 text-md font-headline font-bold" 
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  AI Analyze
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <ScrollArea className="flex-1 rounded-xl border border-border bg-card/20">
          <div className="p-4 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Analysis Findings</h3>
            
            {analyzing && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-lg" />
                ))}
              </div>
            )}

            {!analyzing && !analysisResult && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="w-8 h-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Run analysis to view detailed clinical findings.</p>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                    <span className="text-sm font-bold text-accent uppercase">AI Confidence Score</span>
                  </div>
                  <p className="text-2xl font-headline font-bold">94.2%</p>
                </div>

                <div className="space-y-3">
                  {analysisResult.anomalies.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-all cursor-default group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-tighter">{item.type}</span>
                        <Badge variant="outline" className="text-[9px] uppercase">{item.severity}</Badge>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed mb-2">{item.description}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Scan className="w-3 h-3" />
                        <span>Loc: {item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-xs uppercase text-primary font-bold">Clinical Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 text-xs italic text-muted-foreground">
                    {analysisResult.overallReport}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}