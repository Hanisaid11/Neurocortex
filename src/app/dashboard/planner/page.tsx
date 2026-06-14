'use client';

import * as React from 'react';
import { ClipboardList, Stethoscope, Scissors, Pill, ChevronRight, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage } from '@/lib/storage';
import { translations } from '@/lib/translations';

const PATHOLOGIES = [
  {
    id: "gbm",
    name: "Glioblastoma Multiforme",
    surgical: "Gross Total Resection (GTR)",
    medical: "Stupp Protocol: TMZ + Radiotherapy",
    pharmacology: ["Dexamethasone", "Levetiracetam"]
  },
  {
    id: "sah",
    name: "Subarachnoid Hemorrhage",
    surgical: "Aneurysm Clipping / Coiling",
    medical: "Triple-H Therapy, Nimodipine",
    pharmacology: ["Nimodipine", "Norepinephrine", "Mannitol"]
  },
  {
    id: "tbi",
    name: "Traumatic Brain Injury (Severe)",
    surgical: "Decompressive Craniectomy",
    medical: "Tiered ICP management",
    pharmacology: ["Mannitol", "3% Saline", "Propofol"]
  }
];

export default function PlannerPage() {
  const [selected, setSelected] = React.useState<string>('');
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');

  React.useEffect(() => {
    setLang(storage.getProfile().preferences.language);
  }, []);

  const t = translations[lang];
  const path = PATHOLOGIES.find(p => p.id === selected);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t.plannerTitle}</h1>
          <p className="text-muted-foreground">{t.plannerDesc}</p>
        </div>
        <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
          <Wand2 className="w-4 h-4" />
          {lang === 'ar' ? 'توليد بالذكاء الاصطناعي' : 'Generate AI Plan'}
        </Button>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Clinical Condition</label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Choose a pathology..." />
                </SelectTrigger>
                <SelectContent>
                  {PATHOLOGIES.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {path && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                      <Scissors className="w-4 h-4" />
                      Surgical Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm font-medium">
                    {path.surgical}
                  </CardContent>
                </Card>

                <Card className="bg-emerald-500/5 border-emerald-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4" />
                      Medical Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm font-medium">
                    {path.medical}
                  </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Pill className="w-4 h-4" /> Pharmacological Protocol
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {path.pharmacology.map((drug, idx) => (
                      <div key={idx} className="p-3 bg-secondary/30 rounded-xl border border-border/50 flex items-center justify-between group cursor-pointer hover:border-accent">
                        <span className="text-xs font-medium">{drug}</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-accent" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
