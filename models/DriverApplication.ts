import mongoose from 'mongoose';

interface IDriverApplication {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: 'cargo-van' | 'sprinter-van' | 'box-truck';
  files: {
    ssn: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    license: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    registration: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    insurance: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    check: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
  };
  photos: {
    front: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    driverSide: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    passengerSide: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
    rear: {
      fileName: string;
      fileSize: number;
      uploadedAt: Date;
    };
  };
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: Date;
  notes?: string;
}

const driverApplicationSchema = new mongoose.Schema<IDriverApplication>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['cargo-van', 'sprinter-van', 'box-truck'],
      required: [true, 'Vehicle type is required'],
    },
    files: {
      ssn: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      license: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      registration: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      insurance: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      check: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
    },
    photos: {
      front: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      driverSide: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      passengerSide: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
      rear: {
        fileName: String,
        fileSize: Number,
        uploadedAt: Date,
      },
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected'],
      default: 'pending',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DriverApplication || mongoose.model<IDriverApplication>('DriverApplication', driverApplicationSchema);