'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Layers, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('superadmin@oidulavai.com');
  const [password, setPassword] = useState('DulavaiAdmin2025!');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Administrative access denied.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setPreset = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
  };

  return (
    <div className="w-full bg-[#070C14] text-[#F7F4EE] py-space-xl min-h-[90vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-[#0B1320] border border-[#1C2638] shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2 border-b border-[#1C2638] pb-4">
            <div className="w-12 h-12 rounded-full bg-[#133327] text-[#D8B467] flex items-center justify-center mx-auto border border-[#D8B467]/40 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-spec-code-sm text-[#D8B467] uppercase font-bold tracking-widest text-[10px]">
              Security Protocol Level 4 • Restricted Console
            </span>
            <h1 className="font-headline-lg text-headline-lg text-white uppercase tracking-tight">
              Atelier Operations Hub
            </h1>
            <p className="font-body-sm text-gray-400 text-xs">
              Direct access to Gross Merchandise Value (GMV), loom capacity allocation, and chauffeur dispatch.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/80 text-red-200 border border-red-800 text-xs font-spec-code">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-body-sm">
            <div>
              <label className="font-label-caps text-label-caps uppercase text-gray-400 block mb-1">
                Administrative Staff Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070C14] border border-[#1C2638] p-3 text-white focus:outline-none focus:border-[#D8B467] font-spec-code text-xs"
              />
            </div>

            <div>
              <label className="font-label-caps text-label-caps uppercase text-gray-400 block mb-1">
                Security Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070C14] border border-[#1C2638] p-3 text-white focus:outline-none focus:border-[#D8B467]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#D8B467] text-[#070C14] hover:bg-white py-3.5 font-label-caps text-label-caps uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{isLoading ? 'Authorizing Session...' : 'Authenticate Into Console'}</span>
              </button>
            </div>
          </form>

          {/* Quick Preset Selector */}
          <div className="space-y-2 pt-2 border-t border-[#1C2638] font-spec-code text-[11px]">
            <span className="text-gray-400 block text-[10px] uppercase font-bold">
              Quick Role Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreset('superadmin@oidulavai.com', 'DulavaiAdmin2025!')}
                className="p-2 border border-[#1C2638] bg-[#070C14] hover:border-[#D8B467] text-left text-xs"
              >
                <span className="text-[#D8B467] font-bold block">Super Admin</span>
                <span className="text-gray-400 text-[10px]">Syed Mansoor Rahman</span>
              </button>

              <button
                type="button"
                onClick={() => setPreset('manager@oidulavai.com', 'LoomManager2025!')}
                className="p-2 border border-[#1C2638] bg-[#070C14] hover:border-[#D8B467] text-left text-xs"
              >
                <span className="text-[#D8B467] font-bold block">Loom Manager</span>
                <span className="text-gray-400 text-[10px]">Tariq Al-Amin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
