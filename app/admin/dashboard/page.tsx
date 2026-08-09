'use client';

import React, { useState, useEffect } from 'react';
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
}

export default function AdminDashboard() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    fetchApplications();
  }, [router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="px-6 py-4 border-b border-white/5 bg-gradient-to-r from-slate-950/80 to-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">Manage driver applications</p>
          </div>
          <button onClick={handleLogout} className="px-6 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">Logout</button>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full" />
              </div>
              <p className="text-gray-400 mt-4">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <p className="text-gray-400 text-lg">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} onClick={() => router.push(`/admin/application/${app._id}`)} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{app.fullName}</h3>
                      <p className="text-gray-400 text-sm mt-1">{app.email}</p>
                      <div className="flex gap-4 mt-3 text-sm text-gray-400">
                        <span>📱 {app.phoneNumber}</span>
                        <span>📍 {app.state}</span>
                        <span>🚗 {app.vehicleType}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-xs text-gray-500">{new Date(app.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-gray-400 mb-2">Documents:</p>
                    <div className="flex gap-2 flex-wrap">
                      {app.files?.ssn && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ SSN</span>}
                      {app.files?.license && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ License</span>}
                      {app.files?.registration && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ Registration</span>}
                      {app.files?.insurance && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ Insurance</span>}
                      {app.files?.check && <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">✓ Check</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}