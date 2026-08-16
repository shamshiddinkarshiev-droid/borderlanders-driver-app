import Image from "next/image";
import StartButton from "../components/StartButton";
import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('/images/hero.jpg')",
      }}
    >
      {/* TOP NAV */}
      <nav className="flex justify-end px-6 pt-6">
        <Link
          href="/admin/login"
          className="text-sm text-gray-400 hover:text-white transition-all border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg"
        >
          Admin Login
        </Link>
      </nav>

      {/* HERO */}
      <section className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center px-6 text-center">
        <Image
          src="/images/logo.jpg"
          alt="Borderlanders Logo"
          width={260}
          height={150}
          className="mb-8 object-contain"
        />
        <h1 className="text-6xl md:text-7xl font-black tracking-tight">Borderlanders</h1>
        <p className="mt-3 text-2xl font-semibold text-blue-400">Driver Onboarding Portal</p>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-gray-300">
          Join one of America's fastest-growing logistics companies. Complete your onboarding in minutes and start hauling loads with Borderlanders Inc.
        </p>
        <StartButton />
      </section>

      {/* Before You Begin */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-10 backdrop-blur-xl">
          <h2 className="mb-3 text-4xl font-bold">Before You Begin</h2>
          <p className="mb-10 text-gray-300">Please have the following documents ready.</p>
          <div className="grid gap-5 md:grid-cols-2 text-lg">
            <div className="rounded-xl bg-white/5 p-5">🪪 Driver's License</div>
            <div className="rounded-xl bg-white/5 p-5">🚚 Vehicle Registration</div>
            <div className="rounded-xl bg-white/5 p-5">🛡 Commercial Insurance</div>
            <div className="rounded-xl bg-white/5 p-5">🏦 Void Check</div>
            <div className="rounded-xl bg-white/5 p-5">📄 Driver Records</div>
            <div className="rounded-xl bg-white/5 p-5">📷 Vehicle Photos (Front • Side • Rear)</div>
          </div>
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-5 text-center text-2xl font-bold">
            ⏱ Estimated Time: 7–10 Minutes
          </div>
        </div>
      </section>
    </main>
  );
}