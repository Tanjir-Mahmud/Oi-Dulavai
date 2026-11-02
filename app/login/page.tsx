'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/account';
  const { showToast } = useAtelierStore();

  const [email, setEmail] = useState('asif@patron.oidulavai.com');
  const [password, setPassword] = useState('PatronPass2025!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      showToast('Patron Authenticated', `Welcome back, ${data.patron.name}`);
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/60 shadow-2xl p-8 space-y-6">
      <div className="text-center space-y-2 border-b border-outline-variant/40 pb-4">
        <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-[11px]">
          Patron Vault Identification
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
          Sign In To Atelier
        </h1>
        <p className="font-body-sm text-on-surface-variant text-xs">
          Access your personal measurements vault, order milestones, and sovereign privilege points.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-error-container text-on-error-container border border-error/30 text-xs font-spec-code">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-body-sm">
        <div>
          <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
            Patron Email or Mobile *
          </label>
          <input
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/60 p-3 text-on-surface focus:outline-none focus:border-secondary"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block">
              Password *
            </label>
            <a href="#" className="font-spec-code-sm text-[10px] text-secondary hover:underline">
              Forgot Password?
            </a>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/60 p-3 text-on-surface focus:outline-none focus:border-secondary"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-secondary text-on-primary py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>{isLoading ? 'Verifying Identity...' : 'Sign In To Vault'}</span>
          </button>
        </div>
      </form>

      {/* Demo credentials hint */}
      <div className="bg-secondary-fixed/20 p-3 border border-secondary/30 text-xs font-spec-code space-y-1">
        <span className="font-bold text-secondary block uppercase text-[10px]">
          Demo Patron Credentials Pre-filled:
        </span>
        <p className="text-on-surface-variant text-[11px]">
          Email: <strong>asif@patron.oidulavai.com</strong>
        </p>
        <p className="text-on-surface-variant text-[11px]">
          Password: <strong>PatronPass2025!</strong>
        </p>
      </div>

      <div className="pt-4 border-t border-outline-variant/40 text-center space-y-2">
        <p className="font-body-sm text-xs text-on-surface-variant">
          New to Oi Dulavai Atelier?{' '}
          <Link href="/signup" className="text-secondary font-bold hover:underline">
            Register Patron Profile
          </Link>
        </p>

        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1 font-spec-code-sm text-[10px] text-outline hover:text-secondary"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Administrative Operations Portal Login</span>
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full bg-surface py-space-xl min-h-[85vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <Suspense fallback={<div className="text-center font-spec-code text-xs">Loading Atelier Login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
