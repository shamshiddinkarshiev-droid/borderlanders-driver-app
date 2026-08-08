'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) { router.push('/admin/login'); return; }
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      const app = data.applications.find((a: any) => a._id === params.id);
      setApplication(app);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
  setApplication((prev: any) => ({ ...prev, status }));
  alert(`Application ${status}!`);
  router.push('/admin/dashboard');
}
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'approved': return 'text-emerald-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  if (!application) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Application not found</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="px-6 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="text-gray-400 hover:text-white transition-all flex items-center gap-2">← Back to Dashboard</button>
          <span className={`font-bold text-lg capitalize ${getStatusColor(application.status)}`}>{application.status}</span>
        </div>
      </div>

      <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <div><p className="text-gray-400 text-sm">Full Name</p><p className="text-white font-medium">{application.fullName}</p></div>
            <div><p className="text-gray-400 text-sm">Email</p><p className="text-white font-medium">{application.email}</p></div>
            <div><p className="text-gray-400 text-sm">Phone</p><p className="text-white font-medium">{application.phoneNumber}</p></div>
            <div><p className="text-gray-400 text-sm">State</p><p className="text-white font-medium">{application.state}</p></div>
            <div><p className="text-gray-400 text-sm">Vehicle Type</p><p className="text-white font-medium">{application.vehicleType}</p></div>
            <div><p className="text-gray-400 text-sm">Submitted</p><p className="text-white font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p></div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Documents</h2>
          <div className="space-y-3">
            {application.files && Object.entries(application.files).map(([key, file]: any) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <span className="text-gray-300 capitalize">{key === 'ssn' ? 'SSN/EIN' : key}</span>
                <span className="text-emerald-400 text-sm">{file?.name || 'Uploaded'} ✓</span>
              </div>
            ))}
          </div>
        </div>

        {application.status === 'pending' && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Actions</h2>
            <div className="flex gap-4">
              <button onClick={() => updateStatus('approved')} className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all">✓ Approve</button>
              <button onClick={() => updateStatus('rejected')} className="flex-1 px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-rose-600 transition-all">✗ Reject</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}