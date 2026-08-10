'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

function Modal({ type, onConfirm, onCancel }: { type: 'hire' | 'delete'; onConfirm: () => void; onCancel: () => void; }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative backdrop-blur-xl bg-slate-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        {type === 'hire' ? (
          <>
            <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🤝</span></div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Hire This Driver?</h2>
            <p className="text-gray-400 text-center mb-8">This driver will be moved to your hired drivers list.</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-semibold rounded-xl hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={onConfirm} className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all">Yes, Hire!</button>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><span className="text-4xl">🗑️</span></div>
            <h2 className="text-2xl font-bold text-white text-center mb-2">Delete Application?</h2>
            <p className="text-gray-400 text-center mb-2">This action <span className="text-red-400 font-semibold">cannot be undone</span>.</p>
            <p className="text-gray-500 text-sm text-center mb-8">All data will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-semibold rounded-xl hover:bg-white/10 transition-all">Cancel</button>
              <button onClick={onConfirm} className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-rose-700 transition-all">Delete Forever</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<'hire' | 'delete' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const hireDriver = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/applications/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'hired' })
      });
      const data = await response.json();
      if (data.success) { setModal(null); router.push('/admin/dashboard'); }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteApplication = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/applications/${params.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) { setModal(null); router.push('/admin/dashboard'); }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getVehicleIcon = (type: string) => {
    if (type === 'cargo-van') return '🚐';
    if (type === 'sprinter-van') return '🚌';
    return '🚛';
  };

  if (isLoading) return (<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" /></div>);
  if (!application) return (<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Application not found</p></div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {modal && <Modal type={modal} onConfirm={modal === 'hire' ? hireDriver : deleteApplication} onCancel={() => setModal(null)} />}
      <div className="px-6 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="text-gray-400 hover:text-white transition-all">← Back</button>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${application.status === 'hired' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>{application.status === 'hired' ? '✓ Hired' : '⏳ Pending'}</span>
        </div>
      </div>
      <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-3xl">{getVehicleIcon(application.vehicleType)}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{application.fullName}</h2>
              <p className="text-gray-400">{application.vehicleType}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-4"><p className="text-gray-400 text-xs mb-1">Email</p><p className="text-white font-medium">{application.email}</p></div>
            <div className="bg-slate-800/30 rounded-xl p-4"><p className="text-gray-400 text-xs mb-1">Phone</p><p className="text-white font-medium">{application.phoneNumber}</p></div>
            <div className="bg-slate-800/30 rounded-xl p-4"><p className="text-gray-400 text-xs mb-1">State</p><p className="text-white font-medium">{application.state}</p></div>
            <div className="bg-slate-800/30 rounded-xl p-4"><p className="text-gray-400 text-xs mb-1">Applied</p><p className="text-white font-medium">{new Date(application.submittedAt).toLocaleDateString()}</p></div>
          </div>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Documents</h2>
          <div className="space-y-3">
            {application.files && Object.entries(application.files).map(([key, file]: any) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center"><svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                  <span className="text-white font-medium capitalize">{key === 'ssn' ? 'SSN / EIN' : key}</span>
                </div>
                <span className="text-emerald-400 text-sm">✓ Uploaded</span>
              </div>
            ))}
          </div>
        </div>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
          {application.status === 'pending' && (<button onClick={() => setModal('hire')} disabled={isProcessing} className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg shadow-emerald-500/25 text-lg">🤝 Hire This Driver</button>)}
          <button onClick={() => setModal('delete')} disabled={isProcessing} className="w-full px-8 py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-all">🗑️ Delete Application</button>
        </div>
      </div>
    </div>
  );
}