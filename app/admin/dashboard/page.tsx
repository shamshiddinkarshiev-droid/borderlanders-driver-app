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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      setIsLoading(true);

      const response = await fetch('/api/applications', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications || []);
      } else {
        console.error('Failed to load applications:', data.message);
      }
    } catch (error) {
      console.error('Fetch applications error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApplication = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Delete the application from ${name}?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete application');
      }

      // Immediately remove it from the screen
      setApplications((current) =>
        current.filter((application) => application._id !== id)
      );
    } catch (error: any) {
      console.error('Delete error:', error);

      alert(
        error?.message ||
          'Something went wrong while deleting the application.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getVehicleIcon = (type: string) => {
    if (type === 'cargo-van') return '🚐';
    if (type === 'sprinter-van') return '🚌';
    return '🚛';
  };

  const thisMonth = applications.filter((application) => {
    const date = new Date(application.submittedAt);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-white/5 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>

            <div>
              <h1 className="text-xl font-bold text-white">
                Borderlanders Admin
              </h1>

              <p className="text-gray-500 text-xs">
                Driver Management Portal
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('adminLoggedIn');
              router.push('/admin/login');
            }}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">
              Total Applications
            </p>

            <p className="text-3xl font-bold text-white mt-1">
              {applications.length}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">
              Applications This Month
            </p>

            <p className="text-3xl font-bold text-cyan-400 mt-1">
              {thisMonth}
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">
              Ready for Review
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-1">
              {applications.length}
            </p>
          </div>
        </div>

        {/* TITLE */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Applications
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Review submitted driver applications
            </p>
          </div>

          <button
            onClick={fetchApplications}
            className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-all text-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />

            <p className="text-gray-400 mt-4">
              Loading applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          /* EMPTY */
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
            <p className="text-5xl mb-4">🎉</p>

            <p className="text-white font-bold text-xl">
              No applications
            </p>

            <p className="text-gray-400 mt-2">
              New driver applications will appear here.
            </p>
          </div>
        ) : (
          /* APPLICATIONS */
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 hover:bg-white/8 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* LEFT SIDE */}
                  <div
                    onClick={() =>
                      router.push(`/admin/application/${app._id}`)
                    }
                    className="flex items-center gap-4 cursor-pointer group flex-1"
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center text-2xl">
                      {getVehicleIcon(app.vehicleType)}
                    </div>

                    <div>
                      <h3 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-all">
                        {app.fullName}
                      </h3>

                      <p className="text-gray-400 text-sm">
                        {app.email}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        <span>📱 {app.phoneNumber}</span>
                        <span>📍 {app.state}</span>
                        <span>🚗 {app.vehicleType}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-medium">
                      {app.status || 'Pending'}
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/admin/application/${app._id}`)
                      }
                      className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-all text-sm font-medium"
                    >
                      Review
                    </button>

                    <button
                      onClick={() =>
                        deleteApplication(app._id, app.fullName)
                      }
                      disabled={deletingId === app._id}
                      className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === app._id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>
                  </div>
                </div>

                {/* DOCUMENTS */}
                <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {app.files?.ssn && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        ✓ SSN
                      </span>
                    )}

                    {app.files?.license && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        ✓ License
                      </span>
                    )}

                    {app.files?.registration && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        ✓ Registration
                      </span>
                    )}

                    {app.files?.insurance && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        ✓ Insurance
                      </span>
                    )}

                    {app.files?.check && (
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs">
                        ✓ Check
                      </span>
                    )}
                  </div>

                  <p className="text-gray-500 text-xs">
                    {new Date(app.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}