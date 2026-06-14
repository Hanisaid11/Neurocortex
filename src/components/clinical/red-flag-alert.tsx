'use client';

import * as React from 'react';
import { AlertTriangle, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RedFlagAlertProps {
  flag: string;
  protocol: string[];
  onClose: () => void;
}

export function RedFlagAlert({ flag, protocol, onClose }: RedFlagAlertProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="max-w-md w-full border-red-500 bg-card/90 shadow-[0_0_40px_rgba(239,68,68,0.3)] border-2">
        <CardHeader className="bg-red-500/10 border-b border-red-500/20 py-4">
          <div className="flex items-center gap-3 text-red-500">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            <div>
              <CardTitle className="text-lg font-headline font-bold uppercase tracking-tight">Clinical Red Flag Detected</CardTitle>
              <Badge variant="destructive" className="mt-1 text-[10px]">IMMEDIATE ACTION REQUIRED</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase">Trigger Pattern</p>
            <p className="text-sm font-medium bg-red-500/5 p-3 rounded-lg border border-red-500/10 italic">
              "{flag}"
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-red-500 uppercase flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Stabilization Protocol
            </p>
            <div className="space-y-2">
              {protocol.map((step, i) => (
                <div key={i} className="flex gap-3 text-sm items-start p-2 rounded-md hover:bg-secondary transition-colors group">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 text-[10px] flex items-center justify-center shrink-0 font-bold">
                    {i + 1}
                  </span>
                  <p className="leading-tight group-hover:text-red-400 transition-colors">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold gap-2">
            Acknowledge & Close Alert
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
