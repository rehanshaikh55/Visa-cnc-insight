'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    // Blank screen while checking — avoids flash of dashboard
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="#0a3d62" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <span className="text-sm text-text-secondary">Loading…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
