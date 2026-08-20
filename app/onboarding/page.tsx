'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { genUploader } from 'uploadthing/client';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

const { uploadFiles } = genUploader<OurFileRouter>();

type VehicleType = 'cargo-van' | 'sprinter-van' | 'box-truck' | null;
type FileType = 'license' | 'registration' | 'insurance' | 'check' | 'ssn';
type PhotoType = 'front' | 'driverSide' | 'passengerSide' | 'rear';

type FormState = {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: VehicleType;
  files: Record<FileType, File | null>;
  photos: Record<PhotoType, File | null>;
  photoPreviews: Record<PhotoType, string | null>;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const VEHICLES: { id: Exclude<VehicleType, null>; label: string }[] = [
  { id: 'cargo-van', label: 'Cargo Van' },
  { id: 'sprinter-van', label: 'Sprinter Van' },
  { id: 'box-truck', label: 'Box Truck (<16ft)' },
];

const DOCUMENTS: { id: FileType; label: string; description: string }[] = [
  { id: 'ssn', label: 'SSN or EIN', description: 'Upload your SSN or EIN document' },
  { id: 'license', label: 'Driver License', description: 'Valid government-issued ID' },
  { id: 'registration', label: 'Vehicle Registration', description: 'Current registration document' },
  { id: 'insurance', label: 'Commercial Insurance', description: 'Active insurance policy' },
  { id: 'check', label: 'Void Check', description: 'For direct deposit setup' },
];

const PHOTOS: { id: PhotoType; label: string; description: string }[] = [
  { id: 'front', label: 'Front', description: 'Straight-on front view' },
  { id: 'driverSide', label: 'Driver Side', description: 'Left side profile' },
  { id: 'passengerSide', label: 'Passenger Side', description: 'Right side profile' },
  { id: 'rear', label: 'Rear', description: 'Back view' },
];

const initialState: FormState = {
  fullName: '',
  email: '',
  phoneNumber: '',
  state: '',
  vehicleType: null,
  files: { license: null, registration: null, insurance: null, check: null, ssn: null },
  photos: { front: null, driverSide: null, passengerSide: null, rear: null },
  photoPreviews: { front: null, driverSide: null, passengerSide: null, rear: null },
};

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, index)).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function CheckIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
    </svg>
  );
}

function UploadIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12v5a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-5" />
    </svg>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState('Preparing your application…');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState(1);

  const licenseRef = useRef<HTMLInputElement>(null);
  const registrationRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);
  const checkRef = useRef<HTMLInputElement>(null);
  const ssnRef = useRef<HTMLInputElement>(null);
  const frontRef = useRef<HTMLInputElement>(null);
  const driverSideRef = useRef<HTMLInputElement>(null);
  const passengerSideRef = useRef<HTMLInputElement>(null);
  const rearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      Object.values(form.photoPreviews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [form.photoPreviews]);

  const updateField = (name: 'fullName' | 'email' | 'phoneNumber' | 'state', value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setDocument = (type: FileType, file: File | null) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) { setError(`${file.name} is larger than 5 MB.`); return; }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { setError(`${file.name} is not supported. Use PDF, JPG, PNG, or WebP.`); return; }
    setError('');
    setForm((prev) => ({ ...prev, files: { ...prev.files, [type]: file } }));
  };

  const setPhoto = (type: PhotoType, file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Vehicle photos must be image files.'); return; }
    if (file.size > MAX_FILE_SIZE) { setError(`${file.name} is larger than 5 MB.`); return; }
    setError('');
    const oldPreview = form.photoPreviews[type];
    if (oldPreview) URL.revokeObjectURL(oldPreview);
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, photos: { ...prev.photos, [type]: file }, photoPreviews: { ...prev.photoPreviews, [type]: preview } }));
  };

  const validStep1 = form.fullName.trim() !== '' && form.email.trim() !== '' && form.phoneNumber.trim() !== '' && form.state.trim() !== '' && form.vehicleType !== null;
  const validStep2 = Object.values(form.files).every(Boolean);
  const validStep3 = Object.values(form.photos).every(Boolean);

  const moveToStep = (nextStep: 1 | 2 | 3 | 4) => {
    if (nextStep === step || transitioning || uploading) return;
    setDirection(nextStep > step ? 1 : -1);
    setTransitioning(true);
    window.setTimeout(() => { setStep(nextStep); setTransitioning(false); }, 220);
  };

  const handleContinue = () => {
    setError('');
    if (step === 1) { if (!validStep1) { setError('Please complete all required fields.'); return; } moveToStep(2); return; }
    if (step === 2) { if (!validStep2) { setError('Please upload all five required documents.'); return; } moveToStep(3); return; }
    if (step === 3) { if (!validStep3) { setError('Please upload all four vehicle photos.'); return; } moveToStep(4); }
  };

  const uploadDocument = async (file: File, label: string, startingProgress: number, progressRange: number) => {
    setUploadStage(`Uploading ${label}…`);
    const result = await uploadFiles('documentUploader', {
      files: [file],
      onUploadProgress: (progress) => {
        setUploadProgress(Math.min(99, startingProgress + (progress / 100) * progressRange));
      },
    });
    return result[0];
  };

  const submitApplication = async () => {
    if (!validStep1 || !validStep2 || !validStep3 || !form.vehicleType) {
      setError('Please complete all required information before submitting.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(1);
    setUploadStage('Preparing your application…');

    try {
      const documentEntries = Object.entries(form.files) as [FileType, File][];
      const documentUrls: Record<string, string> = {};

      for (let i = 0; i < documentEntries.length; i++) {
        const [type, file] = documentEntries[i];
        const doc = DOCUMENTS.find((d) => d.id === type);
        const uploaded = await uploadDocument(file, doc?.label ?? type, 5 + i * 13, 12);
        if (!uploaded?.url) throw new Error(`Upload failed for ${doc?.label ?? type}.`);
        documentUrls[type] = uploaded.url;
      }

      const photoEntries = Object.entries(form.photos) as [PhotoType, File][];
      const photoUrls: Record<string, string> = {};

      for (let i = 0; i < photoEntries.length; i++) {
        const [type, file] = photoEntries[i];
        const photo = PHOTOS.find((p) => p.id === type);
        setUploadStage(`Uploading ${photo?.label ?? type} photo…`);
        const uploaded = await uploadFiles('photoUploader', {
          files: [file],
          onUploadProgress: (progress) => {
            setUploadProgress(Math.min(98, 70 + i * 7 + (progress / 100) * 7));
          },
        });
        if (!uploaded?.[0]?.url) throw new Error(`Photo upload failed for ${photo?.label ?? type}.`);
        photoUrls[type] = uploaded[0].url;
      }

      setUploadStage('Saving your application…');
      setUploadProgress(98);

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          state: form.state.trim(),
          vehicleType: form.vehicleType,
          files: {
            ssn: { name: form.files.ssn!.name, size: form.files.ssn!.size, url: documentUrls.ssn },
            license: { name: form.files.license!.name, size: form.files.license!.size, url: documentUrls.license },
            registration: { name: form.files.registration!.name, size: form.files.registration!.size, url: documentUrls.registration },
            insurance: { name: form.files.insurance!.name, size: form.files.insurance!.size, url: documentUrls.insurance },
            check: { name: form.files.check!.name, size: form.files.check!.size, url: documentUrls.check },
          },
          photos: {
            front: { name: form.photos.front!.name, size: form.photos.front!.size, url: photoUrls.front },
            driverSide: { name: form.photos.driverSide!.name, size: form.photos.driverSide!.size, url: photoUrls.driverSide },
            passengerSide: { name: form.photos.passengerSide!.name, size: form.photos.passengerSide!.size, url: photoUrls.passengerSide },
            rear: { name: form.photos.rear!.name, size: form.photos.rear!.size, url: photoUrls.rear },
          },
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || data?.message || 'Application submission failed.');

      setUploadProgress(100);
      setUploadStage('Application submitted successfully.');
      setApplicationId(String(data?.applicationId || data?.id || ''));
      setShowSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong while submitting.');
      setUploadStage('Submission paused — your information is still here.');
    } finally {
      setUploading(false);
    }
  };

  if (showSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
            <CheckIcon className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-black">Application Submitted!</h1>
          <p className="mt-4 text-lg text-slate-400">Your application has been received. We will review it and get back to you soon!</p>
          {applicationId && (
            <div className="mt-8 rounded-2xl bg-slate-800/70 p-6">
              <p className="text-sm text-slate-400">Application ID</p>
              <p className="mt-2 break-all font-mono text-xl font-bold text-cyan-400">{applicationId}</p>
            </div>
          )}
          <button type="button" onClick={() => router.push('/')} className="mt-8 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-4 text-lg font-bold shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]">
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  const progress = step === 1 ? 25 : step === 2 ? 50 : step === 3 ? 75 : 100;
  const stepLabels = ['Personal', 'Documents', 'Photos', 'Review'];

  const getDocRef = (id: FileType) => {
    if (id === 'license') return licenseRef;
    if (id === 'registration') return registrationRef;
    if (id === 'insurance') return insuranceRef;
    if (id === 'check') return checkRef;
    return ssnRef;
  };

  const getPhotoRef = (id: PhotoType) => {
    if (id === 'front') return frontRef;
    if (id === 'driverSide') return driverSideRef;
    if (id === 'passengerSide') return passengerSideRef;
    return rearRef;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-black tracking-[0.35em] text-cyan-400">BORDERLANDERS</div>
          <h1 className="text-3xl font-black sm:text-4xl">Driver Onboarding</h1>
          <p className="mt-2 text-slate-400">Complete your profile to start working with us</p>
        </header>

        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            {stepLabels.map((label, index) => {
              const number = index + 1;
              return (
                <button key={label} type="button" disabled={uploading || transitioning || number > step} onClick={() => { if (number <= step) moveToStep(number as 1 | 2 | 3 | 4); }} className="flex flex-col items-center gap-2 disabled:cursor-default">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full font-bold transition-all duration-500 ${number <= step ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30' : 'border border-white/10 bg-white/5 text-slate-500'}`}>
                    {number < step ? <CheckIcon className="h-5 w-5" /> : number}
                  </span>
                  <span className="text-xs text-slate-400">{label}</span>
                </button>
              );
            })}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {uploading && (
          <div className="mb-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold">{uploadStage}</p>
                <p className="mt-1 text-sm text-slate-400">Please keep this window open while your application is being submitted.</p>
              </div>
              <span className="font-black text-cyan-400">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
        )}

        <section className={`flex-1 transition-all duration-200 ${transitioning ? direction > 0 ? 'translate-x-8 opacity-0' : '-translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>

          {step === 1 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="mb-7 text-2xl font-black">Personal Information</h2>
              <div className="space-y-5">
                {[
                  { label: 'Full Name', name: 'fullName' as const, type: 'text', placeholder: 'John Doe' },
                  { label: 'Email Address', name: 'email' as const, type: 'email', placeholder: 'john@example.com' },
                  { label: 'Phone Number', name: 'phoneNumber' as const, type: 'tel', placeholder: '(555) 123-4567' },
                  { label: 'State', name: 'state' as const, type: 'text', placeholder: 'California' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">{field.label}</label>
                    <input type={field.type} value={form[field.name]} onChange={(e) => updateField(field.name, e.target.value)} placeholder={field.placeholder} className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3.5 text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10" />
                  </div>
                ))}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-300">Vehicle Type</label>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {VEHICLES.map((vehicle) => (
                      <button key={vehicle.id} type="button" onClick={() => setForm((prev) => ({ ...prev, vehicleType: vehicle.id }))} className={`rounded-xl border p-4 text-sm font-bold transition-all ${form.vehicleType === vehicle.id ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20'}`}>
                        {vehicle.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="text-2xl font-black">Upload Documents</h2>
              <p className="mb-7 mt-2 text-slate-400">PDF or image files up to 5 MB each.</p>
              <div className="space-y-3">
                {DOCUMENTS.map((document) => {
                  const file = form.files[document.id];
                  const inputRef = getDocRef(document.id);
                  return (
                    <div key={document.id} className={`relative flex w-full items-center justify-between rounded-2xl border p-5 transition-all ${file ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/30'}`}>
                      <button type="button" onClick={() => inputRef.current?.click()} className="flex flex-1 items-center justify-between text-left">
                        <div>
                          <p className={`font-bold ${file ? 'text-emerald-300' : 'text-white'}`}>{document.label}</p>
                          <p className="mt-1 text-sm text-slate-500">{file ? `${file.name} · ${formatBytes(file.size)}` : document.description}</p>
                          {!file && <p className="mt-2 text-xs text-slate-600">Maximum file size: 5 MB</p>}
                        </div>
                        {file ? <CheckIcon className="ml-4 h-6 w-6 shrink-0 text-emerald-400" /> : <UploadIcon className="ml-4 h-6 w-6 shrink-0 text-slate-600" />}
                      </button>
                      <input ref={inputRef} hidden type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(e) => { setDocument(document.id, e.target.files?.[0] ?? null); e.currentTarget.value = ''; }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <h2 className="text-2xl font-black">Vehicle Photos</h2>
              <p className="mb-7 mt-2 text-slate-400">Upload original vehicle photos. Each photo can be up to 5 MB.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {PHOTOS.map((photo) => {
                  const preview = form.photoPreviews[photo.id];
                  const inputRef = getPhotoRef(photo.id);
                  return (
                    <div key={photo.id} className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
                      <button type="button" onClick={() => inputRef.current?.click()} className="absolute inset-0 h-full w-full text-left">
                        {preview ? (
                          <img src={preview} alt={photo.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center">
                            <div className="mb-2 text-3xl text-slate-600">+</div>
                            <p className="font-bold text-slate-300">{photo.label}</p>
                            <p className="mt-1 text-xs text-slate-500">{photo.description}</p>
                            <p className="mt-2 text-xs text-slate-600">Max 5 MB</p>
                          </div>
                        )}
                        {preview && (
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                            <p className="font-bold">{photo.label} <span className="text-emerald-400">✓</span></p>
                            {form.photos[photo.id] && <p className="mt-1 text-xs text-slate-300">{formatBytes(form.photos[photo.id]!.size)}</p>}
                          </div>
                        )}
                      </button>
                      <input ref={inputRef} hidden type="file" accept="image/*" onChange={(e) => { setPhoto(photo.id, e.target.files?.[0] ?? null); e.currentTarget.value = ''; }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl">
                <h2 className="mb-6 text-2xl font-black">Review Application</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { label: 'Full Name', value: form.fullName },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phoneNumber },
                    { label: 'State', value: form.state },
                    { label: 'Vehicle', value: VEHICLES.find((v) => v.id === form.vehicleType)?.label },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs uppercase tracking-wider text-slate-500">{item.label}</p>
                      <p className="mt-1 font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl">
                <h3 className="mb-4 text-lg font-black">Documents & Photos</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {DOCUMENTS.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
                      <span className="text-sm text-slate-300">{doc.label}</span>
                      <CheckIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                  ))}
                  {PHOTOS.map((photo) => (
                    <div key={photo.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3">
                      <span className="text-sm text-slate-300">{photo.label} photo</span>
                      <CheckIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        <footer className="mt-8 flex gap-3">
          <button type="button" disabled={step === 1 || uploading || transitioning} onClick={() => moveToStep((step - 1) as 1 | 2 | 3 | 4)} className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3.5 font-bold text-slate-300 transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40">
            Back
          </button>
          {step < 4 ? (
            <button type="button" disabled={uploading || transitioning} onClick={handleContinue} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3.5 font-black shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:opacity-50">
              Continue
            </button>
          ) : (
            <button type="button" disabled={uploading || transitioning} onClick={submitApplication} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 font-black shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50">
              {uploading ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}