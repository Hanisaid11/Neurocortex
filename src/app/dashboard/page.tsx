"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Brain, Users, ClipboardCheck } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Mon', surgeries: 4 },
  { name: 'Tue', surgeries: 7 },
  { name: 'Wed', surgeries: 5 },
  { name: 'Thu', surgeries: 8 },
  { name: 'Fri', surgeries: 6 },
  { name: 'Sat', surgeries: 2 },
  { name: 'Sun', surgeries: 1 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold text-foreground">Clinical Overview</h1>
        <p className="text-muted-foreground">Welcome back, Dr. Sterling. Here is your department's snapshot.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Cases", value: "12", icon: ClipboardCheck, trend: "+2 today", color: "text-primary" },
          { title: "Neural Research", value: "84%", icon: Brain, trend: "Target: 90%", color: "text-accent" },
          { title: "Patient Load", value: "28", icon: Users, trend: "-4 this week", color: "text-vivid-azure" },
          { title: "OR Utilization", value: "92%", icon: Activity, trend: "Peak efficiency", color: "text-green-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={1.5} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Surgical Volume</CardTitle>
            <CardDescription>Average weekly operative count per sub-specialty.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSurgeries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="surgeries" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSurgeries)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="font-headline">Recent Research Alerts</CardTitle>
            <CardDescription>New publications in your indexed library.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { topic: "Glioblastoma Multiforme", source: "JNS", date: "2h ago" },
                { topic: "Endoscopic Skull Base", source: "Neurosurgery", date: "5h ago" },
                { topic: "Aneurysm Coil Tech", source: "The Lancet", date: "1d ago" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary">
                    <Brain className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-accent transition-colors">{alert.topic}</p>
                    <p className="text-xs text-muted-foreground">{alert.source} • {alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}