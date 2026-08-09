'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Application {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: string;
  status: string;
  submittedAt: string;
  files: any;
  photos: any;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'applications' | 'hired'>('applications');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { router.push('/admin/login'); return; }
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications', { cache: 'no-store' });
      const data = await response.json();
      if (data.success) setApplications(data.applications);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const pending = applications.filter(a => a.status === 'pending');
  const hired = applications.filter(a => a.status === 'hired');

  const getVehicleIcon = (type: string) => {
    if (type === 'cargo-van') return '🚐';
    if (type === 'sprinter-van') return '🚌';
    return '🚛';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Borderlanders Admin</h1>
              <p className="text-gray-500 text-xs">Driver Management Portal</p>
            </div>
          </div>
          <button onClick={() => { localStorage.removeItem('adminLoggedIn'); router.push('/admin/login'); }} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm">Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Total Applications</p>
            <p className="text-3xl font-bold text-white mt-1">{applications.length}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Pending Review</p>
            <p className="text-3xl font-bold text-yellow-400 mt-1">{pending.length}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Hired Drivers</p>
            <p className="text-3xl font-bold text-emerald-400 mt-1">{hired.length}</p>
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">This Month</p>
            <p className="text-3xl font-bold text-cyan-400 mt-1">{applications.filter(a => new Date(a.submittedAt).getMonth() === new Date().getMonth()).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('applications')} className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${activeTab === 'applications' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            📋 Applications {pending.length > 0 && <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">{pending.length}</span>}
          </button>
          <button onClick={() => setActiveTab('hired')} className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${activeTab === 'hired' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
            👥 Hired Drivers {hired.length > 0 && <span className="ml-2 bg-emerald-500 text-black text-xs px-2 py-0.5 rounded-full">{hired.length}</span>}
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : activeTab === 'applications' ? (
          pending.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
              <p className="text-4xl mb-4">🎉</p>
              <p className="text-white font-bold text-xl">No pending applications!</p>
              <p className="text-gray-400 mt-2">All applications have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((app) => (
                <div key={app._id} onClick={() => router.push(`/admin/application/${app._id}`)} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-white/8 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center text-2xl">
                        {getVehicleIcon(app.vehicleType)}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-all">{app.fullName}</h3>
                        <p className="text-gray-400 text-sm">{app.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-gray-400 text-sm">📍 {app.state}</p>
                        <p className="text-gray-400 text-sm">📱 {app.phoneNumber}</p>
                      </div>
                      <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-medium">Pending</div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-cyan-400 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      {app.files?.ssn && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ SSN</span>}
                      {app.files?.license && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ License</span>}
                      {app.files?.registration && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ Registration</span>}
                      {app.files?.insurance && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ Insurance</span>}
                      {app.files?.check && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ Check</span>}
                    </div>
                    <p className="text-gray-500 text-xs">{new Date(app.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          hired.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
              <p className="text-4xl mb-4">👥</p>
              <p className="text-white font-bold text-xl">No hired drivers yet!</p>
              <p className="text-gray-400 mt-2">Hire drivers from the Applications tab</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hired.map((app) => (
                <div key={app._id} onClick={() => router.push(`/admin/application/${app._id}`)} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-2xl">
                      {getVehicleIcon(app.vehicleType)}
                    </div>
                    <div>
                      <h3 className="text-white font-bold group-hover:text-emerald-400 transition-all">{app.fullName}</h3>
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs">✓ Hired</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>📧 {app.email}</p>
                    <p>📱 {app.phoneNumber}</p>
                    <p>📍 {app.state}</p>
                    <p>🚗 {app.vehicleType}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
