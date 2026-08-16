import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020818] text-white overflow-hidden">

      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#BAF0FF]/8 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#BAF0FF]/6 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-[#BAF0FF]/4 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '4s'}} />
        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#BAF0FF 1px, transparent 1px), linear-gradient(90deg, #BAF0FF 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[#BAF0FF]/10 backdrop-blur-xl bg-[#020818]/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-[#BAF0FF]/20 rounded-xl blur-md" />
            <Image src="/images/logo.jpg" alt="Logo" width={44} height={44} className="relative rounded-xl object-contain" />
          </div>
          <div>
            <span className="font-black text-lg tracking-widest text-white uppercase">Borderlanders</span>
            <p className="text-[#BAF0FF]/50 text-[10px] tracking-[0.3em] uppercase">Inc.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin/login" className="relative group">
            <div className="absolute inset-0 bg-[#BAF0FF]/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative px-5 py-2.5 border border-[#BAF0FF]/30 rounded-xl text-[#BAF0FF] text-sm font-semibold hover:border-[#BAF0FF]/60 transition-all duration-300 tracking-wider">
              Admin Portal
            </div>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6 text-center">

        {/* BADGE */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#BAF0FF]/20 bg-[#BAF0FF]/5 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-[#BAF0FF] animate-pulse" />
          <span className="text-[#BAF0FF] text-xs font-semibold tracking-[0.2em] uppercase">Now Hiring — All 48 States</span>
        </div>

        {/* LOGO */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#BAF0FF]/20 rounded-3xl blur-3xl scale-150" />
          <div className="relative p-4 rounded-3xl border border-[#BAF0FF]/20 bg-white/5 backdrop-blur-xl">
            <Image src="/images/logo.jpg" alt="Borderlanders" width={140} height={140} className="relative object-contain" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 leading-none">
          <span className="text-white">Border</span>
          <span style={{background: 'linear-gradient(135deg, #BAF0FF, #60D5FF, #BAF0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>landers</span>
        </h1>

        <p className="text-[#BAF0FF]/60 text-sm tracking-[0.4em] uppercase font-medium mb-6">
          Driver Onboarding Portal
        </p>

        <p className="max-w-2xl text-gray-400 text-lg leading-relaxed mb-12">
          Join America's most trusted logistics company. Complete your onboarding in minutes and start hauling loads across all 48 states.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/onboarding" className="group relative">
            <div className="absolute inset-0 bg-[#BAF0FF]/30 rounded-2xl blur-xl group-hover:bg-[#BAF0FF]/50 transition-all duration-300" />
            <div className="relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg tracking-wide" style={{background: 'linear-gradient(135deg, #BAF0FF, #60D5FF)'}}>
              <span className="text-[#020818]">🚛 Start Onboarding</span>
              <svg className="w-5 h-5 text-[#020818] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="w-4 h-4 text-[#BAF0FF]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Takes only 7–10 minutes
          </div>
        </div>

        {/* STATS */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg">
          {[
            { value: '48', label: 'States Covered' },
            { value: '24/7', label: 'Support' },
            { value: '10min', label: 'To Onboard' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black" style={{background: 'linear-gradient(135deg, #BAF0FF, #60D5FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1 tracking-wider uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

      </section>

      {/* DOCUMENTS SECTION */}
      <section className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#BAF0FF]/20" />
          <span className="text-[#BAF0FF]/40 text-xs tracking-[0.3em] uppercase font-medium">Before You Begin</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#BAF0FF]/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🪪', title: "Driver's License", desc: 'Valid government-issued ID' },
            { icon: '🚚', title: 'Vehicle Registration', desc: 'Current registration docs' },
            { icon: '🛡', title: 'Commercial Insurance', desc: 'Active insurance policy' },
            { icon: '🏦', title: 'Void Check', desc: 'For direct deposit setup' },
            { icon: '📄', title: 'Driver Records', desc: 'MVR and driving history' },
            { icon: '📷', title: 'Vehicle Photos', desc: 'Front • Side • Rear views' },
          ].map((item) => (
            <div key={item.title} className="group relative p-5 rounded-2xl border border-[#BAF0FF]/10 bg-[#BAF0FF]/3 hover:border-[#BAF0FF]/30 hover:bg-[#BAF0FF]/8 transition-all duration-300 cursor-default backdrop-blur-sm">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#BAF0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="relative">
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TIME BADGE */}
        <div className="mt-10 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#BAF0FF]/10 to-[#60D5FF]/10 rounded-2xl blur-xl" />
          <div className="relative flex items-center justify-center gap-4 py-6 px-8 rounded-2xl border border-[#BAF0FF]/20 bg-[#BAF0FF]/5 backdrop-blur-xl">
            <div className="w-3 h-3 rounded-full bg-[#BAF0FF] animate-pulse" />
            <span className="text-[#BAF0FF] font-bold text-lg tracking-wider">⏱ Estimated Time: 7–10 Minutes</span>
            <div className="w-3 h-3 rounded-full bg-[#BAF0FF] animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#BAF0FF]/10 px-8 py-6 flex items-center justify-between">
        <p className="text-gray-600 text-xs tracking-wider">© 2025 Borderlanders Inc. All rights reserved.</p>
        <Link href="/admin/login" className="text-gray-600 hover:text-[#BAF0FF] text-xs transition-colors tracking-wider">Admin Portal</Link>
      </footer>

    </main>
  );
}