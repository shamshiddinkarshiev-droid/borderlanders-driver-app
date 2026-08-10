import mongoose from 'mongoose';

interface IDriverApplication {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: 'cargo-van' | 'sprinter-van' | 'box-truck';
  files: {
    ssn: { fileName: string; fileSize: number; uploadedAt: Date; };
    license: { fileName: string; fileSize: number; uploadedAt: Date; };
    registration: { fileName: string; fileSize: number; uploadedAt: Date; };
    insurance: { fileName: string; fileSize: number; uploadedAt: Date; };
    check: { fileName: string; fileSize: number; uploadedAt: Date; };
  };
  photos: {
    front: { fileName: string; fileSize: number; uploadedAt: Date; };
    driverSide: { fileName: string; fileSize: number; uploadedAt: Date; };
    passengerSide: { fileName: string; fileSize: number; uploadedAt: Date; };
    rear: { fileName: string; fileSize: number; uploadedAt: Date; };
  };
  status: 'pending' | 'hired' | 'rejected';
  submittedAt: Date;
  notes?: string;
}

const driverApplicationSchema = new mongoose.Schema<IDriverApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true, trim: true },
    vehicleType: { type: String, enum: ['cargo-van', 'sprinter-van', 'box-truck'], required: true },
    files: {
      ssn: { fileName: String, fileSize: Number, uploadedAt: Date },
      license: { fileName: String, fileSize: Number, uploadedAt: Date },
      registration: { fileName: String, fileSize: Number, uploadedAt: Date },
      insurance: { fileName: String, fileSize: Number, uploadedAt: Date },
      check: { fileName: String, fileSize: Number, uploadedAt: Date },
    },
    photos: {
      front: { fileName: String, fileSize: Number, uploadedAt: Date },
      driverSide: { fileName: String, fileSize: Number, uploadedAt: Date },
      passengerSide: { fileName: String, fileSize: Number, uploadedAt: Date },
      rear: { fileName: String, fileSize: Number, uploadedAt: Date },
    },
    status: { type: String, enum: ['pending', 'hired', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.DriverApplication || mongoose.model<IDriverApplication>('DriverApplication', driverApplicationSchema);