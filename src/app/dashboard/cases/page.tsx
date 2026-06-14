"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  ChevronRight,
  ClipboardList,
  Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockCases = [
  { id: "NC-8221", date: "2024-03-10", specialty: "Neuro-Oncology", diagnosis: "Glioblastoma, Right Frontal", approach: "Craniotomy + Resection", outcome: "Total Gross Resection" },
  { id: "NC-8222", date: "2024-03-11", specialty: "Vascular", diagnosis: "ACOM Aneurysm (Ruptured)", approach: "Endovascular Coiling", outcome: "Successful Exclusion" },
  { id: "NC-8223", date: "2024-03-12", specialty: "Spine", diagnosis: "L4-L5 Disk Herniation", approach: "Microdiscectomy", outcome: "Immediate Pain Relief" },
  { id: "NC-8224", date: "2024-03-14", specialty: "Pediatrics", diagnosis: "Hydrocephalus", approach: "VP Shunt Insertion", outcome: "Stable ICP" },
]

export default function ClinicalLogPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Clinical Outcomes Log</h1>
          <p className="text-muted-foreground">Secure, anonymized surgical repository for research and auditing.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export Research Data
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Case Entry
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by diagnosis, ID, or specialty..." 
            className="pl-10 bg-card border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
      </div>

      <Card className="bg-card/50 border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="font-headline uppercase text-xs">Case ID</TableHead>
              <TableHead className="font-headline uppercase text-xs">Specialty</TableHead>
              <TableHead className="font-headline uppercase text-xs">Primary Diagnosis</TableHead>
              <TableHead className="font-headline uppercase text-xs">Surgical Approach</TableHead>
              <TableHead className="font-headline uppercase text-xs">Post-Op Outcome</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCases.map((item) => (
              <TableRow key={item.id} className="cursor-pointer group">
                <TableCell className="font-code text-accent">{item.id}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">{item.specialty}</Badge>
                </TableCell>
                <TableCell className="font-medium">{item.diagnosis}</TableCell>
                <TableCell className="text-sm text-muted-foreground italic">{item.approach}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-xs">{item.outcome}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/30 border-dashed border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-headline flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-primary" />
              Total Logged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-headline font-bold">1,482</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-dashed border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-headline flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              Data Integrity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-headline font-bold">99.8%</p>
          </CardContent>
        </Card>
        <Card className="bg-card/30 border-dashed border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-headline flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-vivid-azure" />
              Last Audit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-headline font-bold">Today, 08:00 AM</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}