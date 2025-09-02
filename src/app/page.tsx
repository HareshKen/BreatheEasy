import { Header } from '@/components/dashboard/header';
import { RiskScore } from '@/components/dashboard/risk-score';
import { AiCards } from '@/components/dashboard/ai-cards';
import { DataCharts } from '@/components/dashboard/data-charts';
import { AcousticMonitorCard } from '@/components/dashboard/acoustic-monitor-card';
import { EnvironmentCard } from '@/components/dashboard/environment-card';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1 md:col-span-2">
            <RiskScore />
          </div>
          <div className="lg:col-span-3 md:col-span-2">
            <AiCards />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <DataCharts />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <AcousticMonitorCard />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <EnvironmentCard />
          </div>
        </div>
      </main>
    </div>
  );
}
