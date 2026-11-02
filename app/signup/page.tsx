'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtelierStore } from '@/lib/store';
import { User, Lock, Sparkles, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useAtelierStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      showToast('Patron Registered', `Welcome to Oi Dulavai, ${data.patron.name}`);
      router.push('/account');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-surface py-space-xl min-h-[85vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-surface-container-lowest border border-outline-variant/60 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2 border-b border-outline-variant/40 pb-4">
            <span className="font-spec-code-sm text-secondary uppercase font-bold tracking-widest text-[11px]">
              Sovereign Patron Registration
            </span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
              Create Atelier Vault
            </h1>
            <p className="font-body-sm text-on-surface-variant text-xs">
              Receive 500 Welcome Sovereign Points, priority loom reservation, and doorstep fitting services.
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
                Patron Full Legal Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Asif Mahmud Chowdhury"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 p-3 text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="patron@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 p-3 text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                Bangladeshi Mobile (for Chauffeur Dispatch) *
              </label>
              <input
                type="tel"
                required
                placeholder="+880 1711-000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant/60 p-3 text-on-surface focus:outline-none focus:border-secondary font-spec-code"
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant block mb-1">
                Vault Security Password (min 8 chars) *
              </label>
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
                className="w-full bg-secondary hover:bg-primary text-on-secondary py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Creating Vault...' : 'Register Sovereign Profile'}</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-outline-variant/40 text-center">
            <p className="font-body-sm text-xs text-on-surface-variant">
              Already have an Atelier account?{' '}
              <Link href="/login" className="text-secondary font-bold hover:underline">
                Sign In to Vault
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
