'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, isAuthenticated } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Already logged in → go to dashboard
  useEffect(() => {
    if (isAuthenticated()) router.replace('/');
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate brief network delay for UX
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        router.replace('/');
      } else {
        setError('Invalid email or password. Please try again.');
        setLoading(false);
      }
    }, 400);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #1a5276 60%, #1f618d 100%)' }}
    >
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header stripe */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ backgroundColor: '#0a3d62' }}>
          {/* Factory icon */}
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
          </div>
          <h1 className="text-white text-xl font-bold tracking-wide">VISA CNC INSIGHTS</h1>
          <p className="text-white/60 text-xs mt-1">Industrial Monitoring Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-4">
          <p className="text-sm font-semibold text-text-primary text-center -mt-1 mb-1">
            Sign in to your account
          </p>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Email
            </label>
            <div className="flex items-center border border-card-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-all">
              <span className="px-3 text-text-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="flex-1 py-2.5 pr-3 text-sm text-text-primary bg-transparent outline-none placeholder-gray-300"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
              Password
            </label>
            <div className="flex items-center border border-card-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent transition-all">
              <span className="px-3 text-text-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                className="flex-1 py-2.5 text-sm text-text-primary bg-transparent outline-none placeholder-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="px-3 text-text-secondary hover:text-text-primary transition-colors"
                tabIndex={-1}
              >
                {showPass ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all disabled:opacity-60"
            style={{ backgroundColor: '#0a3d62' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Signing in…
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-6 text-center">
          <p className="text-[11px] text-text-secondary">
            VISA CNC Insights · Factory Floor Monitoring
          </p>
        </div>
      </div>
    </div>
  );
}
