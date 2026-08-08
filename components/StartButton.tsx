"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StartButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const start = () => {
    if (loading) return;

    setLoading(true);

    let value = 0;

    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 10) + 6;

      if (value >= 100) {
        value = 100;
        setProgress(100);

        clearInterval(interval);

        router.push("/onboarding");
      } else {
        setProgress(value);
      }
    }, 120);
  };

  return (
    <>
      <button
        onClick={start}
        disabled={loading}
        className="
          group
          relative
          mt-12
          overflow-hidden
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          via-blue-500
          to-cyan-500
          px-10
          py-5
          text-xl
          font-bold
          text-white
          transition-all
          duration-500
          hover:scale-110
          active:scale-95
          shadow-2xl
          hover:shadow-blue-500/60
          disabled:cursor-not-allowed
        "
      >
        {/* Shine Effect */}
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

        <span className="relative z-10 flex items-center gap-2">
          🚛 {loading ? "Opening Portal..." : "Start Onboarding"}

          {!loading && (
            <span className="transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          )}
        </span>
      </button>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl">

          <div className="w-[520px] max-w-[90%] text-center">

            <img
              src="/images/logo.jpg"
              alt="Borderlanders Logo"
              className="mx-auto mb-8 h-32 object-contain"
            />

            <h2 className="text-4xl font-black text-white">
              Borderlanders
            </h2>

            <p className="mt-5 text-lg text-gray-300">
              Preparing your onboarding...
            </p>

            <div className="mt-10 h-4 overflow-hidden rounded-full bg-white/10">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 transition-all duration-150"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

            <div className="mt-5 text-3xl font-bold text-white">
              {progress}%
            </div>

          </div>

        </div>
      )}
    </>
  );
}