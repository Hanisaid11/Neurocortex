'use client';

import * as React from 'react';
import { Pill, Search, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { translations } from '@/lib/translations';

const DRUGS = [
  {
    name: "Mannitol (20%)",
    class: "Osmotic Diuretic",
    dosage: "0.25 to 1.0 g/kg IV bolus",
    indication: "Increased ICP, Brain Herniation",
    sideEffects: "Electrolyte imbalance, Pulmonary edema",
    interactions: "Nephrotoxic agents",
    color: "text-blue-500"
  },
  {
    name: "Levetiracetam (Keppra)",
    class: "Anticonvulsant",
    dosage: "500mg to 1500mg BID",
    indication: "Seizure prophylaxis (Post-trauma/Post-op)",
    sideEffects: "Sedation, Irritability",
    interactions: "Minimal enzymatic interaction",
    color: "text-emerald-500"
  },
  {
    name: "Dexamethasone",
    class: "Corticosteroid",
    dosage: "4mg to 10mg q6h IV/PO",
    indication: "Vasogenic edema, Brain tumors",
    sideEffects: "Hyperglycemia, GI ulceration",
    interactions: "NSAIDs (GI risk)",
    color: "text-orange-500"
  },
  {
    name: "Norepinephrine",
    class: "Vasopressor",
    dosage: "0.01-3.0 mcg/kg/min",
    indication: "CPP Maintenance in SAH/TBI",
    sideEffects: "Tachycardia, Peripheral ischemia",
    interactions: "MAOIs, TCAs",
    color: "text-red-500"
  }
];

export default function PharmacologyPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');

  React.useEffect(() => {
    setLang(storage.getProfile().preferences.language);
  }, []);

  const t = translations[lang];

  const filtered = DRUGS.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-headline font-bold">{t.pharmacologyTitle}</h1>
        <p className="text-muted-foreground">{t.pharmacologyDesc}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-10 h-12 bg-card border-border/50" 
          placeholder="Search by drug name or class..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((drug, i) => (
          <Card key={i} className="bg-card/50 border-border/50 overflow-hidden group hover:border-primary/50 transition-all">
            <CardHeader className="bg-secondary/20 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className={`text-xl font-headline ${drug.color}`}>{drug.name}</CardTitle>
                  <CardDescription className="text-xs uppercase font-bold tracking-widest mt-1">{drug.class}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">Active Reference</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.dosage}</p>
                  <p className="text-sm font-medium">{drug.dosage}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.indication}</p>
                  <p className="text-sm font-medium">{drug.indication}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-orange-500 uppercase">{t.interactions}</p>
                  <p className="text-xs italic text-muted-foreground">{drug.interactions}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 flex gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">Side Effects</p>
                  <p className="text-xs italic text-muted-foreground">{drug.sideEffects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
