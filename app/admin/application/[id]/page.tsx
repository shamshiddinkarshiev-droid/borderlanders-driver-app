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

  const deleteApplication = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this application? This cannot be undone!');
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/applications/${params.id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        alert('Application deleted!');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Loading...</p></div>;
  if (!application) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Application not found</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="px-6 py-4 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/admin/dashboard')} className="text-gray-400 hover:text-white transition-all">← Back</button>
          <h1 className="text-white font-bold text-lg">Application Details</h1>
          <div />
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
            <div><p className="text-gray-400 text-sm">Submitted</p><p