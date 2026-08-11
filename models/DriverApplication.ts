import mongoose from 'mongoose';

interface IFileEntry {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: Date;
}

interface IDriverApplication {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: 'cargo-van' | 'sprinter-van' | 'box-truck';
  files: {
    ssn: IFileEntry;
    license: IFileEntry;
    registration: IFileEntry;
    insurance: IFileEntry;
    check: IFileEntry;
  };
  photos: {
    front: IFileEntry;
    driverSide: IFileEntry;
    passengerSide: IFileEntry;
    rear: IFileEntry;
  };
  status: 'pending' | 'hired' | 'rejected';
  submittedAt: Date;
  notes?: string;
}

const fileEntrySchema = {
  fileName: String,
  fileSize: Number,
  fileUrl: String,
  uploadedAt: Date,
};

const driverApplicationSchema = new mongoose.Schema<IDriverApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phoneNumber: { type: String, required: true },
    state: { type: String, required: true, trim: true },
    vehicleType: { type: String, enum: ['cargo-van', 'sprinter-van', 'box-truck'], required: true },
    files: {
      ssn: fileEntrySchema,
      license: fileEntrySchema,
      registration: fileEntrySchema,
      insurance: fileEntrySchema,
      check: fileEntrySchema,
    },
    photos: {
      front: fileEntrySchema,
      driverSide: fileEntrySchema,
      passengerSide: fileEntrySchema,
      rear: fileEntrySchema,
    },
    status: { type: String, enum: ['pending', 'hired', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.DriverApplication || mongoose.model<IDriverApplication>('DriverApplication', driverApplicationSchema);