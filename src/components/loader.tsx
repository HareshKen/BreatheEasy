
'use client';

import { Loader2, Waves } from 'lucide-react';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <Loader2 className="absolute h-full w-full animate-spin text-primary/50" />
          <Waves className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">BreatheEasy</h1>
        <p className="text-muted-foreground">Loading your health dashboard...</p>
      </div>
    </div>
  );
}
