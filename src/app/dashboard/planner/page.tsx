'use client';

import * as React from 'react';
import { ClipboardList, Stethoscope, Scissors, Pill, ChevronRight, Wand2, User, Loader2, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/storage';
import { translations } from '@/lib/translations';
import { advancedTreatmentPlanner, type AdvancedTreatmentPlannerOutput } from '@/ai/flows/advanced-treatment-planner';
import { Badge } from '@/components/ui/badge';

export default function PlannerPage() {
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AdvancedTreatmentPlannerOutput | null>(null);
  
  const [form, setForm] = React.useState({
    history: '',
    complaints: '',
    age: 45,
    sex: 'male' as 'male' | 'female' | 'other'
  });

  React.useEffect(() => {
    setLang(storage.getProfile().preferences.language);
  }, []);

  const t = translations[lang];

  const handleGenerate = async () => {
    if (!form.history || !form.complaints) return;
    setLoading(true);
    try {
      const output = await advancedTreatmentPlanner(form);
      setResult(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t.plannerTitle}</h1>
          <p className="text-muted-foreground">{t.plannerDesc}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Sidebar */}
        <Card className="bg-card/50 border-border/50 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-headline flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {t.clinicalHistory}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">{t.complaints}</label>
              <Textarea 
                value={form.complaints}
                onChange={(e) => setForm({...form, complaints: e.target.value})}
                placeholder="Sudden onset headache, left-sided hemiparesis..." 
                className="h-24 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Medical/Surgical History</label>
              <Textarea 
                value={form.history}
                onChange={(e) => setForm({...form, history: e.target.value})}
                placeholder="HTN, DM2, previous appendectomy..." 
                className="h-24 bg-background/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">{t.age}</label>
                <Input 
                  type="number" 
                  value={form.age}
                  onChange={(e) => setForm({...form, age: parseInt(e.target.value)})}
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">{t.sex}</label>
                <Select value={form.sex} onValueChange={(val: any) => setForm({...form, sex: val})}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t.male}</SelectItem>
                    <SelectItem value="female">{t.female}</SelectItem>
                    <SelectItem value="other">{t.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              className="w-full h-12 mt-4 gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {t.generatePlan}
            </Button>
          </CardContent>
        </Card>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 text-center">
              <ClipboardList className="w-24 h-24 mb-4" />
              <p className="text-xl font-headline font-bold uppercase tracking-widest">Awaiting Case Submission</p>
            </div>
          )}

          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-32 bg-secondary/30 rounded-xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 bg-secondary/20 rounded-xl" />
                <div className="h-64 bg-secondary/20 rounded-xl" />
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <Badge variant="outline" className="w-fit mb-2 text-primary border-primary/30">CLINICAL SUMMARY</Badge>
                  <CardTitle className="text-lg leading-relaxed">{result.clinicalSummary}</CardTitle>
                </CardHeader>
              </Card>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-accent" />
                  Proposed Management Frameworks
                </h3>
                
                {result.pathways.map((path, i) => (
                  <Card key={i} className="bg-card/50 border-border/50 overflow-hidden group hover:border-accent/50 transition-all">
                    <CardHeader className="bg-secondary/20 py-4 border-b border-border/50">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-headline text-accent">{path.title}</CardTitle>
                        <Badge variant="secondary" className="bg-accent/10 text-accent uppercase text-[10px]">Pathway {i+1}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex gap-4">
                        <div className="mt-1"><Scissors className="w-5 h-5 text-muted-foreground" /></div>
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Interventional Strategy</p>
                          <p className="text-sm leading-relaxed">{path.strategy}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-emerald-500" />
                          <p className="text-[10px] font-bold text-emerald-500 uppercase">Pharmaceutical Schedule</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {path.pharmacology.map((p, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                              <p className="text-sm font-bold text-emerald-500">{p.drug}</p>
                              <div className="flex justify-between text-[11px] mt-1 font-medium">
                                <span>{p.dosage}</span>
                                <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> {p.duration}</span>
                              </div>
                              <p className="text-[10px] italic text-muted-foreground mt-2 border-t border-emerald-500/10 pt-1">{p.rationale}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] font-bold text-primary uppercase mb-1">Follow-up Protocol</p>
                        <p className="text-xs italic leading-relaxed text-muted-foreground">{path.followUp}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                  <BookOpen className="w-4 h-4" />
                  Verified References & Evidence Base
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {result.evidenceBase.map((ev, idx) => (
                    <div key={idx} className="p-3 text-[10px] font-code bg-secondary/30 rounded-lg border border-border/50">
                      {ev}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
