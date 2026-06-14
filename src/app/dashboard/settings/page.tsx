"use client"

import { useState, useEffect } from "react"
import { Shield, Brain, Cpu, Key, Globe, Layout, Palette, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { storage, type UserProfile } from "@/lib/storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations } from "@/lib/translations"

export default function SettingsPage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(storage.getProfile())
  }, [])

  const handleSave = () => {
    if (profile) {
      storage.saveProfile(profile)
      const html = document.documentElement;
      html.className = `dark theme-${profile.preferences.theme}`;
      html.dir = profile.preferences.language === 'ar' ? 'rtl' : 'ltr';
      html.lang = profile.preferences.language;

      toast({
        title: profile.preferences.language === 'ar' ? "تم حفظ الإعدادات" : "Settings Secured",
        description: profile.preferences.language === 'ar' ? "تم تحديث تكوين النظام بنجاح." : "Global system configuration updated successfully.",
      })
      
      // Refresh to apply language change across all components
      window.location.reload();
    }
  }

  if (!profile) return null;
  const t = translations[profile.preferences.language];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t.settings}</h1>
          <p className="text-muted-foreground">Manage multi-lingual support, themes, and AI orchestrators.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 h-11 px-8">
          <Save className="w-4 h-4" />
          {t.saveChanges}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle className="font-headline text-lg">{t.systemLanguage}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              value={profile.preferences.language} 
              onValueChange={(val: 'en' | 'ar') => setProfile({ ...profile, preferences: { ...profile.preferences, language: val } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (LTR)</SelectItem>
                <SelectItem value="ar">العربية (RTL)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              <CardTitle className="font-headline text-lg">{t.activeTheme}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select 
              value={profile.preferences.theme} 
              onValueChange={(val: 'dark' | 'light' | 'cyber') => setProfile({ ...profile, preferences: { ...profile.preferences, theme: val } })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Medical Dark</SelectItem>
                <SelectItem value="light">Clinical Light</SelectItem>
                <SelectItem value="cyber">Cyber Grok</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle className="font-headline">{t.clinicalMemory}</CardTitle>
          </div>
          <CardDescription>Manage the AI's long-term understanding of your surgical style.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {profile.longTermMemory.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No persistent memory entries yet.</p>
            ) : (
              profile.longTermMemory.map((mem, i) => (
                <div key={i} className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-xs flex items-center justify-between group">
                  <span>{mem}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => {
                    const updated = profile.longTermMemory.filter((_, idx) => idx !== i);
                    setProfile({ ...profile, longTermMemory: updated });
                  }}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
