
'use client';

import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <Loader2 className="absolute h-full w-full animate-spin text-primary/50" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-10 w-10 text-primary"
          >
            <rect width="256" height="256" fill="none" />
            <path
              d="M128,216S28,176,28,112V64A12,12,0,0,1,40,52H216a12,12,0,0,1,12,12v48c0,64-100,104-100,104Z"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
            <path
              d="M176,100a48,48,0,0,1-96,0"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="16"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">RespiGuard</h1>
        <p className="text-muted-foreground">Loading your health dashboard...</p>
      </div>
    </div>
  );
}
