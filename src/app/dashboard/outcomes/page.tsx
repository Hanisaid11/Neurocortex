"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Activity, Award, TrendingUp, Info } from "lucide-react"

import { Badge } from "@/components/ui/badge";
const outcomeData = [
  { name: 'Glioma', rate: 92, patients: 45 },
  { name: 'Aneurysm', rate: 98, patients: 120 },
  { name: 'Spine', rate: 88, patients: 350 },
  { name: 'Functional', rate: 85, patients: 28 },
  { name: 'Trauma', rate: 76, patients: 85 },
]

export default function OutcomesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-foreground">Surgical Outcomes & Metrics</h1>
        <p className="text-muted-foreground">Departmental performance analytics based on longitudinal patient tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Award className="w-4 h-4" />
                Departmental Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">Top 5% National</div>
              <p className="text-xs text-muted-foreground mt-1">Based on morbidity/mortality benchmarks.</p>
            </CardContent>
         </Card>
         <Card className="bg-gradient-to-br from-accent/20 to-transparent border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Patient Satisfaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">4.9 / 5.0</div>
              <p className="text-xs text-muted-foreground mt-1">NPS average for post-operative recovery.</p>
            </CardContent>
         </Card>
         <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-green-500 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Survival Rate (Overall)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-headline font-bold">96.4%</div>
              <p className="text-xs text-muted-foreground mt-1">Adjusted for case complexity.</p>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Success Rate by Specialty</CardTitle>
            <CardDescription>Target: Above 90% for elective procedures.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                />
                <YAxis 
                  domain={[0, 100]}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                  unit="%"
                />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--secondary))'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px' }}
                />
                <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rate > 90 ? 'hsl(var(--primary))' : 'hsl(var(--accent))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Quality Indicators</CardTitle>
            <CardDescription>Active clinical trial metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: "Readmission (30-day)", value: "3.2%", status: "Good", color: "bg-green-500" },
              { label: "Surgical Site Infection", value: "0.8%", status: "Exceptional", color: "bg-green-500" },
              { label: "Mean Length of Stay", value: "4.2 days", status: "Neutral", color: "bg-yellow-500" },
              { label: "ICU Step-down Time", value: "18 hours", status: "Good", color: "bg-green-500" },
            ].map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">{metric.status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${metric.color} w-[70%]`} />
                  </div>
                  <span className="text-sm font-headline font-bold">{metric.value}</span>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-border mt-6">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Data is refreshed every 24 hours from the centralized Hospital Information System (HIS). Metrics follow the National Quality Forum (NQF) standards for surgical excellence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
