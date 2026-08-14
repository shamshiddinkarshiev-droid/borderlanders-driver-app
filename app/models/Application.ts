import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUploadedFile {
  name: string;
  size: number;
  url: string;
}

export interface IApplication extends Document {
  applicationId: string;

  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;
  vehicleType: string;

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

  status: "pending" | "approved" | "rejected";

  createdAt: Date;
  updatedAt: Date;
}

const UploadedFileSchema = new Schema<IUploadedFile>(
  {
    name: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

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
        "approved",
        "rejected",
      ],
      default: "pending",
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>(
    "Application",
    ApplicationSchema
  );

export default Application;