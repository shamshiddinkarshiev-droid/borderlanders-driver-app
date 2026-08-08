'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get('applicationId');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
        <p className="text-gray-400 mb-6">Your application has been received. We will review it and get back to you soon!</p>
        <div className="bg-slate-800/50 rounded-lg p-4 mb-8">
          <p className="text-gray-400 text-sm">Application ID</p>
          <p className="text-cyan-400 font-mono font-bold text-lg">{applicationId}</p>
        </div>
        <button onClick={() => router.push('/')} className="w-full px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg transition-all">Back to Home</button>
      </div>
    </div>
  );
}
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}