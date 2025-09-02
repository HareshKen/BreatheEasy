import { Wind } from 'lucide-react';
import { SymptomLogger } from './symptom-logger';

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Wind className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-foreground">BreatheEasy</h1>
      </div>
      <div className="ml-auto">
        <SymptomLogger />
      </div>
    </header>
  );
}
