'use client';

import { Header } from '@/components/Header';
import { FactoryFloor } from '@/components/FactoryFloor';
import { AuthGuard } from '@/components/AuthGuard';
import { useMachineSocket } from '@/hooks/useMachineSocket';

// Separate component so useMachineSocket only runs AFTER AuthGuard confirms auth
function DashboardContent() {
  useMachineSocket();
  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Header />
      <main className="flex-1 overflow-auto">
        <FactoryFloor />
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
