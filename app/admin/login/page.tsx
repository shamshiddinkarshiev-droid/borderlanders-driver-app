'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password === 'Borderlanders123') {
      localStorage.setItem('adminLoggedIn', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020818] text-white flex items-center justify-center">

      {/* =========================
          AMBIENT BACKGROUND
      ========================== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Large glowing orbs */}
        <div
          className="absolute -top-[280px] -left-[220px] h-[650px] w-[650px] rounded-full bg-[#60D5FF]/10 blur-[140px] animate-pulse"
          style={{ animationDuration: '6s' }}
        />

        <div
          className="absolute -bottom-[300px] -right-[200px] h-[700px] w-[700px] rounded-full bg-[#0EA5E9]/10 blur-[150px] animate-pulse"
          style={{ animationDuration: '8s' }}
        />

        <div
          className="absolute top-[35%] left-[45%] h-[350px] w-[350px] rounded-full bg-[#BAF0FF]/5 blur-[110px] animate-pulse"
          style={{ animationDuration: '5s' }}
        />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(#BAF0FF 1px, transparent 1px), linear-gradient(90deg, #BAF0FF 1px, transparent 1px)',
            backgroundSize: '55px 55px',
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#020818_90%)]" />
      </div>

      {/* =========================
          TOP BRAND
      ========================== */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-[#BAF0FF]/10 bg-[#020818]/50 px-6 py-5 backdrop-blur-xl md:px-10">

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-[#BAF0FF]/20 blur-lg" />

            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[#BAF0FF]/20 bg-white shadow-lg">
              <img
                src="/images/logo.jpg"
                alt="Borderlanders"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-white">
              Borderlanders
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-[0.35em] text-[#BAF0FF]/45">
              Inc.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[#BAF0FF]/15 bg-[#BAF0FF]/5 px-4 py-2 sm:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BAF0FF]/70">
            Secure Portal
          </span>
        </div>
      </div>

      {/* =========================
          LOGIN AREA
      ========================== */}
      <section className="relative z-10 w-full max-w-[480px] px-5 pt-20">

        {/* Floating decorative rings */}
        <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2">
          <div
            className="h-[430px] w-[430px] rounded-full border border-[#BAF0FF]/5 animate-[spin_30s_linear_infinite]"
          />
          <div
            className="absolute inset-[35px] rounded-full border border-dashed border-[#BAF0FF]/5 animate-[spin_20s_linear_infinite_reverse]"
          />
        </div>

        {/* Header */}
        <div className="relative mb-8 text-center">

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute h-24 w-24 rounded-3xl bg-[#BAF0FF]/10 blur-2xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-[#BAF0FF]/20 bg-white/5 p-3 shadow-[0_0_60px_rgba(96,213,255,0.12)] backdrop-blur-xl">
              <img
                src="/images/logo.jpg"
                alt="Borderlanders"
                className="h-full w-full rounded-2xl object-contain"
              />
            </div>
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#BAF0FF]/15 bg-[#BAF0FF]/5 px-4 py-2 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#60D5FF] shadow-[0_0_10px_#60D5FF]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#BAF0FF]/75">
              Administration
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-5xl">
            Welcome <span className="text-[#60D5FF]">Back.</span>
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Access the Borderlanders driver management command center.
          </p>
        </div>

        {/* =========================
            LOGIN CARD
        ========================== */}
        <div className="relative">

          {/* Card glow */}
          <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-[#60D5FF]/10 via-[#BAF0FF]/5 to-[#60D5FF]/10 blur-xl" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-7 shadow-2xl backdrop-blur-2xl md:p-9">

            {/* Top shine */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#BAF0FF]/60 to-transparent" />

            {/* Small card label */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  Admin Access
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Authorized personnel only
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <svg
                  className="h-5 w-5 text-[#60D5FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.7}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v1h8z"
                  />
                </svg>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2.5 block text-xs font-bold uppercase tracking-[0.16em] text-slate-400"
                >
                  Admin Password
                </label>

                <div className="group relative">

                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[#60D5FF]/5 opacity-0 blur-xl transition-opacity duration-300 group-focus-within:opacity-100" />

                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                      <svg
                        className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-[#60D5FF]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.7}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-11V7a4 4 0 00-8 0v1h8z"
                        />
                      </svg>
                    </div>

                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError('');
                      }}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 pl-12 pr-14 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-600 hover:border-white/15 focus:border-[#60D5FF]/50 focus:bg-black/30 focus:ring-4 focus:ring-[#60D5FF]/5"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-[#60D5FF]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.7}
                            d="M3 3l18 18M10.6 10.6a2 2 0 102.8 2.8M9.9 4.3A10.7 10.7 0 0112 4c5 0 8.5 4 9.5 8-.4 1.6-1.3 3.1-2.5 4.4M6.1 6.1C4.2 7.5 2.9 9.7 2.5 12c1 4 4.5 8 9.5 8 1 0 2-.1 2.9-.4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.7}
                            d="M2.5 12S6 5 12 5s9.5 7 9.5 7S18 19 12 19 2.5 12 2.5 12z"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                            strokeWidth="1.7"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-sm text-red-300">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v3m0 4h.01M10.3 3.8l-7.1 12.3A2 2 0 005 19h14a2 2 0 001.8-2.9L13.7 3.8a2 2 0 00-3.4 0z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="font-semibold">Access denied</p>
                    <p className="mt-0.5 text-xs text-red-300/60">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-2xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="absolute -inset-1 rounded-2xl bg-[#60D5FF]/30 blur-xl transition-all duration-300 group-hover:bg-[#60D5FF]/45" />

                <div className="relative flex h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#BAF0FF] via-[#60D5FF] to-[#38BDF8] text-sm font-black tracking-wide text-[#020818] transition-all duration-300 group-hover:brightness-110">

                  {isLoading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-90"
                          fill="currentColor"
                          d="M21 12a9 9 0 00-9-9v3a6 6 0 016 6h3z"
                        />
                      </svg>
                      AUTHENTICATING...
                    </>
                  ) : (
                    <>
                      ENTER COMMAND CENTER

                      <svg
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Security footer */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/5 pt-6">
              <svg
                className="h-3.5 w-3.5 text-emerald-400/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
                />
              </svg>

              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
                Protected Administration Environment
              </span>
            </div>
          </div>
        </div>

        {/* Bottom information */}
        <div className="mt-7 text-center">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-700">
            Borderlanders Inc. • Driver Operations
          </p>
        </div>
      </section>

      {/* Bottom glow */}
      <div className="pointer-events-none fixed bottom-0 left-1/2 h-[2px] w-1/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#60D5FF]/40 to-transparent blur-sm" />
    </main>
  );
}