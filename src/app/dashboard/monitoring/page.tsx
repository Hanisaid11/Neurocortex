'use client';

import * as React from 'react';
import { 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ClipboardCheck,
  TrendingUp,
  Droplets,
  Eye,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/storage';
import { translations } from '@/lib/translations';

const MOCK_CHECKLIST = [
  { id: 1, task: "GCS + Pupil Symmetry Check", interval: "q1h", lastDone: "15 mins ago", status: "completed" },
  { id: 2, task: "ICP Monitoring (Target < 20)", interval: "continuous", lastDone: "Live", status: "active" },
  { id: 3, task: "Levetiracetam (Keppra) 1g IV", interval: "q12h", lastDone: "10h ago", status: "pending" },
  { id: 4, task: "EVD Drainage Tracking", interval: "q2h", lastDone: "1h ago", status: "completed" },
  { id: 5, task: "Electrolyte Panel (Stat Sodium)", interval: "q6h", lastDone: "4h ago", status: "completed" },
];

export default function MonitoringHubPage() {
  const [lang, setLang] = React.useState<'en' | 'ar'>('en');

  React.useEffect(() => {
    setLang(storage.getProfile().preferences.language);
  }, []);

  const t = translations[lang];

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t.monitoringTitle}</h1>
          <p className="text-muted-foreground">{t.monitoringDesc}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 animate-pulse h-8 px-4 flex items-center gap-2">
            <Zap className="w-3 h-3" /> ICU Live Sync Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border/50 shadow-xl">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-accent" />
                  Neurological Observation Schedule
                </CardTitle>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Shift: 08:00 - 20:00</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {MOCK_CHECKLIST.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        item.status === 'completed' ? 'bg-green-500/20 text-green-500' : 
                        item.status === 'active' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-muted text-muted-foreground'
                      }`}>
                        {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : 
                         item.status === 'active' ? <Activity className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.task}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                          <span className="bg-muted px-1.5 rounded">{item.interval}</span>
                          <span>Last: {item.lastDone}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant={item.status === 'completed' ? 'ghost' : 'outline'} className="text-xs h-8">
                      {item.status === 'completed' ? 'Logged' : 'Log Task'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> ICP Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-32 w-full flex items-end gap-1 px-2">
                  {[12, 14, 18, 22, 19, 15, 14, 13, 11, 10, 12, 14, 16].map((h, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-t-sm transition-all duration-500 ${h > 20 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary/60'}`} 
                      style={{ height: `${(h / 25) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] text-muted-foreground font-bold uppercase">
                  <span>Target: &lt; 20 mmHg</span>
                  <span className="text-primary">Avg: 14.8</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                  <Droplets className="w-4 h-4" /> CPP Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Mean CPP</span>
                    <span className="text-accent">68 mmHg</span>
                  </div>
                  <Progress value={75} className="h-1.5 bg-muted [&>div]:bg-accent" />
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  Cerebral Perfusion Pressure is within optimal range (60-70 mmHg). Vasopressor titration stable at 0.05 mcg/kg/min.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-secondary/20 border-border/50 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm font-headline flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" /> 
                Pupillary Response Hub
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-around items-center py-4 bg-black/20 rounded-xl">
                 <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full border-2 border-primary bg-black flex items-center justify-center">
                       <div className="w-4 h-4 rounded-full bg-white blur-[1px]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase">Left (3mm)</p>
                 </div>
                 <div className="h-8 w-px bg-border/50" />
                 <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full border-2 border-primary bg-black flex items-center justify-center">
                       <div className="w-4 h-4 rounded-full bg-white blur-[1px]" />
                    </div>
                    <p className="text-[10px] font-bold uppercase">Right (3mm)</p>
                 </div>
              </div>
              <Button variant="secondary" className="w-full text-xs font-bold uppercase tracking-widest gap-2">
                <Activity className="w-3 h-3" /> Record Visual Check
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-red-500/5 border-red-500/20">
            <CardHeader className="pb-2">
               <CardTitle className="text-xs font-bold uppercase text-red-500 flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" /> Emergency Triggers
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               {[
                 "Drop in GCS > 2 points",
                 "ICP spike > 25 for 5+ mins",
                 "New anisocoria detected",
                 "MAP < 80 mmHg consistently"
               ].map((trigger, i) => (
                 <div key={i} className="flex items-start gap-2 text-[11px] font-medium leading-tight border-l-2 border-red-500/30 pl-2">
                    {trigger}
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
