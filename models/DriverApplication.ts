import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export type VehicleType =
  | "cargo-van"
  | "sprinter-van"
  | "box-truck";

export type ApplicationStatus =
  | "pending"
  | "hired"
  | "rejected";

export interface IUploadedFile {
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: Date;
}

export interface IDriverApplication
  extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: VehicleType;

  files: {
    ssn: IUploadedFile;
    license: IUploadedFile;
    registration: IUploadedFile;
    insurance: IUploadedFile;
    check: IUploadedFile;
  };

  photos: {
    front: IUploadedFile;
    driverSide: IUploadedFile;
    passengerSide: IUploadedFile;
    rear: IUploadedFile;
  };

  status: ApplicationStatus;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const UploadedFileSchema =
  new Schema<IUploadedFile>(
    {
      fileName: {
        type: String,
        required: true,
      },

      fileSize: {
        type: Number,
        required: true,
      },

      fileUrl: {
        type: String,
        required: true,
      },

      uploadedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    {
      _id: false,
    }
  );

const DriverApplicationSchema =
  new Schema<IDriverApplication>(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phoneNumber: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      vehicleType: {
        type: String,
        required: true,
        enum: [
          "cargo-van",
          "sprinter-van",
          "box-truck",
        ],
      },

      files: {
        ssn: {
          type: UploadedFileSchema,
          required: true,
        },

        license: {
          type: UploadedFileSchema,
          required: true,
        },

        registration: {
          type: UploadedFileSchema,
          required: true,
        },

        insurance: {
          type: UploadedFileSchema,
          required: true,
        },

        check: {
          type: UploadedFileSchema,
          required: true,
        },
      },

      photos: {
        front: {
          type: UploadedFileSchema,
          required: true,
        },

        driverSide: {
          type: UploadedFileSchema,
          required: true,
        },

        passengerSide: {
          type: UploadedFileSchema,
          required: true,
        },

        rear: {
          type: UploadedFileSchema,
          required: true,
        },
      },

      status: {
        type: String,
        enum: [
          "pending",
          "hired",
          "rejected",
        ],
        default: "pending",
      },

      notes: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

export const DriverApplication: Model<IDriverApplication> =
  mongoose.models.DriverApplication ||
  mongoose.model<IDriverApplication>(
    "DriverApplication",
    DriverApplicationSchema
  );
  export default DriverApplication;