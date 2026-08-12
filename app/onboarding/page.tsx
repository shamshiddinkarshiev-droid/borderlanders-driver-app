'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';

type VehicleType = 'cargo-van' | 'sprinter-van' | 'box-truck' | null;

type FileType =
  | 'license'
  | 'registration'
  | 'insurance'
  | 'check'
  | 'ssn';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: VehicleType;

  files: {
    license: File | null;
    registration: File | null;
    insurance: File | null;
    check: File | null;
    ssn: File | null;
  };

  photos: {
    front: File | null;
    driverSide: File | null;
    passengerSide: File | null;
    rear: File | null;
  };

  photoPreviews: {
    front: string | null;
    driverSide: string | null;
    passengerSide: string | null;
    rear: string | null;
  };
}

const VEHICLES = [
  {
    id: 'cargo-van',
    label: 'Cargo Van',
  },
  {
    id: 'sprinter-van',
    label: 'Sprinter Van',
  },
  {
    id: 'box-truck',
    label: 'Box Truck (<16ft)',
  },
];

const DOCUMENT_TYPES = [
  {
    id: 'ssn',
    label: 'SSN or EIN Document',
    description: 'Photo of SSN card or EIN letter',
  },
  {
    id: 'license',
    label: 'Driver License',
    description: 'Valid government-issued ID',
  },
  {
    id: 'registration',
    label: 'Vehicle Registration',
    description: 'Current registration documents',
  },
  {
    id: 'insurance',
    label: 'Commercial Insurance',
    description: 'Active insurance policy',
  },
  {
    id: 'check',
    label: 'Void Check',
    description: 'For direct deposit setup',
  },
];

const PHOTO_POSITIONS = [
  {
    id: 'front',
    label: 'Front',
    description: 'Straight-on front view',
  },
  {
    id: 'driverSide',
    label: 'Driver Side',
    description: 'Left side profile',
  },
  {
    id: 'passengerSide',
    label: 'Passenger Side',
    description: 'Right side profile',
  },
  {
    id: 'rear',
    label: 'Rear',
    description: 'Back view',
  },
];

interface DocumentCardProps {
  type: FileType;
  label: string;
  description: string;
  isUploaded: boolean;
  fileName?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File | null) => void;
}

function DocumentCard({
  type,
  label,
  description,
  isUploaded,
  fileName,
  inputRef,
  onUpload,
}: DocumentCardProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    onUpload(file);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`w-full text-left transition-all p-4 rounded-lg border-2 ${
        isUploaded
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p
            className={`font-semibold ${
              isUploaded
                ? 'text-emerald-400'
                : 'text-white'
            }`}
          >
            {label}
          </p>

          <p className="text-sm text-gray-400 mt-1">
            {description}
          </p>

          {fileName && (
            <p className="text-xs text-gray-500 mt-2 truncate">
              {fileName}
            </p>
          )}
        </div>

        <div className="ml-4 flex-shrink-0">
          {isUploaded ? (
            <svg
              className="w-6 h-6 text-emerald-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
      />
    </button>
  );
}

interface PhotoCardProps {
  position: keyof FormData['photoPreviews'];
  label: string;
  description: string;
  preview: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File | null) => void;
}

function PhotoCard({
  position,
  label,
  description,
  preview,
  inputRef,
  onUpload,
}: PhotoCardProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] || null;
    onUpload(file);
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`relative overflow-hidden rounded-xl border-2 transition-all aspect-square ${
        preview
          ? 'border-emerald-500/30'
          : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600/50'
      }`}
    >
      {preview ? (
        <>
          <img
            src={preview}
            alt={label}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-emerald-500/20 flex flex-col items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-400 mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>

            <p className="text-xs text-white font-semibold bg-black/40 px-2 py-1 rounded">
              {label}
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <svg
            className="w-8 h-8 text-gray-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <p className="text-sm font-semibold text-gray-400">
            {label}
          </p>

          <p className="text-xs text-gray-500 mt-1 text-center">
            {description}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] =
    useState<1 | 2 | 3 | 4>(1);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState('');

  const [formData, setFormData] =
    useState<FormData>({
      fullName: '',
      email: '',
      phoneNumber: '',
      state: '',
      vehicleType: null,

      files: {
        license: null,
        registration: null,
        insurance: null,
        check: null,
        ssn: null,
      },

      photos: {
        front: null,
        driverSide: null,
        passengerSide: null,
        rear: null,
      },

      photoPreviews: {
        front: null,
        driverSide: null,
        passengerSide: null,
        rear: null,
      },
    });

  const {
    startUpload: startDocUpload,
  } = useUploadThing('documentUploader');

  const {
    startUpload: startPhotoUpload,
  } = useUploadThing('photoUploader');

  const ssnRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const registrationRef =
    useRef<HTMLInputElement>(null);
  const insuranceRef =
    useRef<HTMLInputElement>(null);
  const checkRef = useRef<HTMLInputElement>(null);

  const frontPhotoRef =
    useRef<HTMLInputElement>(null);
  const driverPhotoRef =
    useRef<HTMLInputElement>(null);
  const passengerPhotoRef =
    useRef<HTMLInputElement>(null);
  const rearPhotoRef =
    useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleSelect = (
    vehicleId: VehicleType
  ) => {
    setFormData((prev) => ({
      ...prev,
      vehicleType: vehicleId,
    }));
  };

  const handleFileUpload = (
    fileType: FileType,
    file: File | null
  ) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [fileType]: file,
      },
    }));
  };

  const handlePhotoUpload = (
    photoType: keyof FormData['photos'],
    file: File | null
  ) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const preview =
        e.target?.result as string;

      setFormData((prev) => ({
        ...prev,

        photos: {
          ...prev.photos,
          [photoType]: file,
        },

        photoPreviews: {
          ...prev.photoPreviews,
          [photoType]: preview,
        },
      }));
    };

    reader.readAsDataURL(file);
  };

  const isStep1Valid = () => {
    return (
      formData.fullName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.vehicleType !== null
    );
  };

  const isStep2Valid = () => {
    return (
      formData.files.ssn !== null &&
      formData.files.license !== null &&
      formData.files.registration !== null &&
      formData.files.insurance !== null &&
      formData.files.check !== null
    );
  };

  const isStep3Valid = () => {
    return (
      formData.photos.front !== null &&
      formData.photos.driverSide !== null &&
      formData.photos.passengerSide !== null &&
      formData.photos.rear !== null
    );
  };

  const handleContinue = () => {
    if (
      currentStep === 1 &&
      isStep1Valid()
    ) {
      setCurrentStep(2);
    } else if (
      currentStep === 2 &&
      isStep2Valid()
    ) {
      setCurrentStep(3);
    } else if (
      currentStep === 3 &&
      isStep3Valid()
    ) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(
        (prev) =>
          (prev - 1) as 1 | 2 | 3 | 4
      );
    }
  };

  /*
   * UploadThing can return the uploaded file
   * URL as `ufsUrl` or `url`, depending on the
   * UploadThing version/configuration.
   *
   * We support both.
   */
  const getUploadedUrl = (result: any) => {
    return (
      result?.[0]?.ufsUrl ||
      result?.[0]?.url ||
      result?.[0]?.fileUrl ||
      ''
    );
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (
      !isStep1Valid() ||
      !isStep2Valid() ||
      !isStep3Valid()
    ) {
      alert(
        'Please complete all required information before submitting.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      /*
       * DOCUMENT UPLOADS
       */

      setUploadProgress(
        'Uploading documents...'
      );

      const [
        ssnRes,
        licenseRes,
        regRes,
        insRes,
        checkRes,
      ] = await Promise.all([
        startDocUpload([
          formData.files.ssn!,
        ]),

        startDocUpload([
          formData.files.license!,
        ]),

        startDocUpload([
          formData.files.registration!,
        ]),

        startDocUpload([
          formData.files.insurance!,
        ]),

        startDocUpload([
          formData.files.check!,
        ]),
      ]);

      /*
       * PHOTO UPLOADS
       */

      setUploadProgress(
        'Uploading vehicle photos...'
      );

      const [
        frontRes,
        driverRes,
        passengerRes,
        rearRes,
      ] = await Promise.all([
        startPhotoUpload([
          formData.photos.front!,
        ]),

        startPhotoUpload([
          formData.photos.driverSide!,
        ]),

        startPhotoUpload([
          formData.photos.passengerSide!,
        ]),

        startPhotoUpload([
          formData.photos.rear!,
        ]),
      ]);

      /*
       * Make sure every upload actually
       * returned a URL.
       */

      const uploadedUrls = {
        ssn: getUploadedUrl(ssnRes),
        license: getUploadedUrl(
          licenseRes
        ),
        registration: getUploadedUrl(
          regRes
        ),
        insurance: getUploadedUrl(
          insRes
        ),
        check: getUploadedUrl(checkRes),

        front: getUploadedUrl(frontRes),
        driverSide: getUploadedUrl(
          driverRes
        ),
        passengerSide: getUploadedUrl(
          passengerRes
        ),
        rear: getUploadedUrl(rearRes),
      };

      console.log(
        'UPLOAD URLS:',
        uploadedUrls
      );

      /*
       * If UploadThing didn't give us URLs,
       * don't create a broken application.
       */

      const missingUrls = Object.entries(
        uploadedUrls
      )
        .filter(
          ([, value]) => !value
        )
        .map(([key]) => key);

      if (missingUrls.length > 0) {
        console.error(
          'Missing uploaded URLs:',
          missingUrls
        );

        throw new Error(
          `Some files failed to upload: ${missingUrls.join(
            ', '
          )}`
        );
      }

      /*
       * SUBMIT TO MONGODB
       */

      setUploadProgress(
        'Submitting application...'
      );

      const submitData = {
        fullName:
          formData.fullName.trim(),

        email:
          formData.email.trim(),

        phoneNumber:
          formData.phoneNumber.trim(),

        state:
          formData.state.trim(),

        vehicleType:
          formData.vehicleType,

        files: {
          ssn: {
            name:
              formData.files.ssn!.name,

            size:
              formData.files.ssn!.size,

            url:
              uploadedUrls.ssn,
          },

          license: {
            name:
              formData.files.license!.name,

            size:
              formData.files.license!.size,

            url:
              uploadedUrls.license,
          },

          registration: {
            name:
              formData.files.registration!
                .name,

            size:
              formData.files.registration!
                .size,

            url:
              uploadedUrls.registration,
          },

          insurance: {
            name:
              formData.files.insurance!
                .name,

            size:
              formData.files.insurance!
                .size,

            url:
              uploadedUrls.insurance,
          },

          check: {
            name:
              formData.files.check!.name,

            size:
              formData.files.check!.size,

            url:
              uploadedUrls.check,
          },
        },

        photos: {
          front: {
            name:
              formData.photos.front!.name,

            size:
              formData.photos.front!.size,

            url:
              uploadedUrls.front,
          },

          driverSide: {
            name:
              formData.photos.driverSide!
                .name,

            size:
              formData.photos.driverSide!
                .size,

            url:
              uploadedUrls.driverSide,
          },

          passengerSide: {
            name:
              formData.photos
                .passengerSide!.name,

            size:
              formData.photos
                .passengerSide!.size,

            url:
              uploadedUrls.passengerSide,
          },

          rear: {
            name:
              formData.photos.rear!.name,

            size:
              formData.photos.rear!.size,

            url:
              uploadedUrls.rear,
          },
        },
      };

      console.log(
        'SUBMIT DATA:',
        submitData
      );

      const response = await fetch(
        '/api/submit',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            submitData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to submit application'
        );
      }

      if (!data.success) {
        throw new Error(
          data.message ||
            'Application submission failed'
        );
      }

      /*
       * SUCCESS
       */

      router.push(
        `/onboarding/success?applicationId=${data.applicationId}`
      );
    } catch (error: any) {
      console.error(
        'SUBMISSION ERROR:',
        error
      );

      alert(
        error?.message ||
          'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const progressPercentage =
    ((currentStep - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">

        {/* HEADER */}

        <div className="pt-6 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Borderlanders Onboarding
            </h1>

            <p className="text-gray-400 text-sm sm:text-base">
              Complete your profile to start
              working with us
            </p>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-2xl mx-auto">

            <div className="flex items-center justify-between mb-3">
              {[1, 2, 3, 4].map(
                (step) => (
                  <div
                    key={step}
                    className="flex flex-col items-center flex-1"
                  >
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all duration-300 ${
                        step <= currentStep
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-800/50 text-gray-400 border border-slate-700/50'
                      }`}
                    >
                      {step}
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 mt-2 text-center">
                      {step === 1 &&
                        'Personal'}

                      {step === 2 &&
                        'Documents'}

                      {step === 3 &&
                        'Photos'}

                      {step === 4 &&
                        'Review'}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="h-1 bg-slate-800/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </div>

          </div>
        </div>

        {/* CONTENT */}

        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-2xl mx-auto">

            {/* STEP 1 */}

            {currentStep === 1 && (
              <div className="animate-fadeIn">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                    Personal Information
                  </h2>

                  <div className="space-y-6">

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={
                          formData.fullName
                        }
                        onChange={
                          handleInputChange
                        }
                        className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={
                          formData.email
                        }
                        onChange={
                          handleInputChange
                        }
                        className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phoneNumber"
                        value={
                          formData.phoneNumber
                        }
                        onChange={
                          handleInputChange
                        }
                        className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={
                          formData.state
                        }
                        onChange={
                          handleInputChange
                        }
                        className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all"
                        placeholder="California"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-4">
                        Vehicle Type
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {VEHICLES.map(
                          (vehicle) => (
                            <button
                              type="button"
                              key={
                                vehicle.id
                              }
                              onClick={() =>
                                handleVehicleSelect(
                                  vehicle.id as VehicleType
                                )
                              }
                              className={`p-4 rounded-lg border-2 transition-all font-medium text-center ${
                                formData.vehicleType ===
                                vehicle.id
                                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/25'
                                  : 'bg-slate-800/30 border-slate-700/50 text-gray-400 hover:border-slate-600/50'
                              }`}
                            >
                              {
                                vehicle.label
                              }
                            </button>
                          )
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}

            {currentStep === 2 && (
              <div className="animate-fadeIn">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                    Upload Documents
                  </h2>

                  <p className="text-gray-400 mb-8">
                    All five documents are
                    required to proceed
                  </p>

                  <div className="space-y-4">

                    <DocumentCard
                      type="ssn"
                      label={
                        DOCUMENT_TYPES[0]
                          .label
                      }
                      description={
                        DOCUMENT_TYPES[0]
                          .description
                      }
                      isUploaded={
                        formData.files
                          .ssn !== null
                      }
                      fileName={
                        formData.files.ssn
                          ?.name
                      }
                      inputRef={ssnRef}
                      onUpload={(file) => {
                        handleFileUpload(
                          'ssn',
                          file
                        );

                        if (
                          ssnRef.current
                        ) {
                          ssnRef.current.value =
                            '';
                        }
                      }}
                    />

                    <DocumentCard
                      type="license"
                      label={
                        DOCUMENT_TYPES[1]
                          .label
                      }
                      description={
                        DOCUMENT_TYPES[1]
                          .description
                      }
                      isUploaded={
                        formData.files
                          .license !== null
                      }
                      fileName={
                        formData.files
                          .license?.name
                      }
                      inputRef={
                        licenseRef
                      }
                      onUpload={(file) => {
                        handleFileUpload(
                          'license',
                          file
                        );

                        if (
                          licenseRef.current
                        ) {
                          licenseRef.current.value =
                            '';
                        }
                      }}
                    />

                    <DocumentCard
                      type="registration"
                      label={
                        DOCUMENT_TYPES[2]
                          .label
                      }
                      description={
                        DOCUMENT_TYPES[2]
                          .description
                      }
                      isUploaded={
                        formData.files
                          .registration !==
                        null
                      }
                      fileName={
                        formData.files
                          .registration
                          ?.name
                      }
                      inputRef={
                        registrationRef
                      }
                      onUpload={(file) => {
                        handleFileUpload(
                          'registration',
                          file
                        );

                        if (
                          registrationRef.current
                        ) {
                          registrationRef.current.value =
                            '';
                        }
                      }}
                    />

                    <DocumentCard
                      type="insurance"
                      label={
                        DOCUMENT_TYPES[3]
                          .label
                      }
                      description={
                        DOCUMENT_TYPES[3]
                          .description
                      }
                      isUploaded={
                        formData.files
                          .insurance !== null
                      }
                      fileName={
                        formData.files
                          .insurance?.name
                      }
                      inputRef={
                        insuranceRef
                      }
                      onUpload={(file) => {
                        handleFileUpload(
                          'insurance',
                          file
                        );

                        if (
                          insuranceRef.current
                        ) {
                          insuranceRef.current.value =
                            '';
                        }
                      }}
                    />

                    <DocumentCard
                      type="check"
                      label={
                        DOCUMENT_TYPES[4]
                          .label
                      }
                      description={
                        DOCUMENT_TYPES[4]
                          .description
                      }
                      isUploaded={
                        formData.files
                          .check !== null
                      }
                      fileName={
                        formData.files.check
                          ?.name
                      }
                      inputRef={checkRef}
                      onUpload={(file) => {
                        handleFileUpload(
                          'check',
                          file
                        );

                        if (
                          checkRef.current
                        ) {
                          checkRef.current.value =
                            '';
                        }
                      }}
                    />

                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}

            {currentStep === 3 && (
              <div className="animate-fadeIn">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
                    Vehicle Photos
                  </h2>

                  <p className="text-gray-400 mb-8">
                    Upload four photos of
                    your vehicle
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <PhotoCard
                      position="front"
                      label={
                        PHOTO_POSITIONS[0]
                          .label
                      }
                      description={
                        PHOTO_POSITIONS[0]
                          .description
                      }
                      preview={
                        formData
                          .photoPreviews
                          .front
                      }
                      inputRef={
                        frontPhotoRef
                      }
                      onUpload={(file) => {
                        handlePhotoUpload(
                          'front',
                          file
                        );

                        if (
                          frontPhotoRef.current
                        ) {
                          frontPhotoRef.current.value =
                            '';
                        }
                      }}
                    />

                    <PhotoCard
                      position="driverSide"
                      label={
                        PHOTO_POSITIONS[1]
                          .label
                      }
                      description={
                        PHOTO_POSITIONS[1]
                          .description
                      }
                      preview={
                        formData
                          .photoPreviews
                          .driverSide
                      }
                      inputRef={
                        driverPhotoRef
                      }
                      onUpload={(file) => {
                        handlePhotoUpload(
                          'driverSide',
                          file
                        );

                        if (
                          driverPhotoRef.current
                        ) {
                          driverPhotoRef.current.value =
                            '';
                        }
                      }}
                    />

                    <PhotoCard
                      position="passengerSide"
                      label={
                        PHOTO_POSITIONS[2]
                          .label
                      }
                      description={
                        PHOTO_POSITIONS[2]
                          .description
                      }
                      preview={
                        formData
                          .photoPreviews
                          .passengerSide
                      }
                      inputRef={
                        passengerPhotoRef
                      }
                      onUpload={(file) => {
                        handlePhotoUpload(
                          'passengerSide',
                          file
                        );

                        if (
                          passengerPhotoRef.current
                        ) {
                          passengerPhotoRef.current.value =
                            '';
                        }
                      }}
                    />

                    <PhotoCard
                      position="rear"
                      label={
                        PHOTO_POSITIONS[3]
                          .label
                      }
                      description={
                        PHOTO_POSITIONS[3]
                          .description
                      }
                      preview={
                        formData
                          .photoPreviews
                          .rear
                      }
                      inputRef={
                        rearPhotoRef
                      }
                      onUpload={(file) => {
                        handlePhotoUpload(
                          'rear',
                          file
                        );

                        if (
                          rearPhotoRef.current
                        ) {
                          rearPhotoRef.current.value =
                            '';
                        }
                      }}
                    />

                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}

            {currentStep === 4 && (
              <div className="animate-fadeIn space-y-6">

                {/* PERSONAL REVIEW */}

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

                  <h3 className="text-xl font-bold text-white mb-6">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Full Name
                      </p>

                      <p className="text-white font-medium">
                        {formData.fullName}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Email
                      </p>

                      <p className="text-white font-medium break-all">
                        {formData.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Phone Number
                      </p>

                      <p className="text-white font-medium">
                        {
                          formData.phoneNumber
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        State
                      </p>

                      <p className="text-white font-medium">
                        {formData.state}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Vehicle Type
                      </p>

                      <p className="text-white font-medium">
                        {
                          VEHICLES.find(
                            (v) =>
                              v.id ===
                              formData.vehicleType
                          )?.label
                        }
                      </p>
                    </div>

                  </div>
                </div>

                {/* DOCUMENT REVIEW */}

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

                  <h3 className="text-xl font-bold text-white mb-6">
                    Documents
                  </h3>

                  <div className="space-y-3">

                    {(
                      [
                        'ssn',
                        'license',
                        'registration',
                        'insurance',
                        'check',
                      ] as const
                    ).map(
                      (
                        docType,
                        idx
                      ) => (
                        <div
                          key={docType}
                          className="flex items-center justify-between gap-4 p-4 bg-slate-800/30 rounded-lg"
                        >
                          <span className="text-gray-300">
                            {
                              DOCUMENT_TYPES[
                                idx
                              ].label
                            }
                          </span>

                          {formData.files[
                            docType
                          ] && (
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm text-gray-400 truncate max-w-[200px]">
                                {
                                  formData
                                    .files[
                                    docType
                                  ]?.name
                                }
                              </span>

                              <svg
                                className="w-5 h-5 text-emerald-500 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      )
                    )}

                  </div>
                </div>

                {/* PHOTOS REVIEW */}

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

                  <h3 className="text-xl font-bold text-white mb-6">
                    Vehicle Photos
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                    {(
                      [
                        'front',
                        'driverSide',
                        'passengerSide',
                        'rear',
                      ] as const
                    ).map(
                      (pos) =>
                        formData
                          .photoPreviews[
                          pos
                        ] && (
                          <div
                            key={pos}
                            className="relative"
                          >
                            <img
                              src={
                                formData
                                  .photoPreviews[
                                  pos
                                ]!
                              }
                              alt={pos}
                              className="w-full h-32 object-cover rounded-lg"
                            />

                            <div className="absolute inset-0 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-6 h-6 text-emerald-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 001.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        )
                    )}

                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* FOOTER CONTROLS */}

        <div className="px-4 sm:px-6 lg:px-8 pb-8 border-t border-white/5 bg-gradient-to-r from-slate-950/80 to-slate-900/80 backdrop-blur">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 pt-6">

            <button
              type="button"
              onClick={handleBack}
              disabled={
                currentStep === 1 ||
                isSubmitting
              }
              className="px-6 py-3 text-white font-semibold rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  isSubmitting ||
                  (currentStep === 1 &&
                    !isStep1Valid()) ||
                  (currentStep === 2 &&
                    !isStep2Valid()) ||
                  (currentStep === 3 &&
                    !isStep3Valid())
                }
                className="flex-1 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/25"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isSubmitting
                }
                className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/25"
              >
                {isSubmitting
                  ? uploadProgress ||
                    'Submitting...'
                  : 'Submit Application'}
              </button>
            )}

          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}