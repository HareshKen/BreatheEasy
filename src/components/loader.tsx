
'use client';

import { Loader2 } from 'lucide-react';

// Custom Lung icon component
const LungIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 21v-5" />
    <path d="M6.7 16H4.5C3 16 2 15 2 13.5c0-1 .5-2.5 3-3" />
    <path d="M17.3 16h2.2c1.5 0 2.5-1 2.5-2.5 0-1-.5-2.5-3-3" />
    <path d="M8 16s1.5-2 4-2 4 2 4 2" />
    <path d="M8 12c-3-2.5-3-5.5-1-7.5s4-2 5 0c1 2 0 5-1 6.5" />
    <path d="M16 12c3-2.5 3-5.5 1-7.5s-4-2-5 0c-1 2 0 5 1 6.5" />
  </svg>
);


export function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <Loader2 className="absolute h-full w-full animate-spin text-primary/50" />
          <LungIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">BreatheEasy</h1>
        <p className="text-muted-foreground">Loading your health dashboard...</p>
      </div>
    </div>
  );
}
