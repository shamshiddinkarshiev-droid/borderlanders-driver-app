import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/mongodb";
import { DriverApplication } from "@/models/DriverApplication";

type UploadedFileInput = {
  name: string;
  size: number;
  url: string;
};

type SubmitData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  state: string;

  vehicleType:
    | "cargo-van"
    | "sprinter-van"
    | "box-truck";

  files: {
    ssn: UploadedFileInput;
    license: UploadedFileInput;
    registration: UploadedFileInput;
    insurance: UploadedFileInput;
    check: UploadedFileInput;
  };

  photos: {
    front: UploadedFileInput;
    driverSide: UploadedFileInput;
    passengerSide: UploadedFileInput;
    rear: UploadedFileInput;
  };
};

function isValidUploadedFile(
  file: unknown
): file is UploadedFileInput {
  if (!file || typeof file !== "object") {
    return false;
  }

  const value = file as Record<string, unknown>;

  return (
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.size === "number" &&
    value.size > 0 &&
    typeof value.url === "string" &&
    value.url.trim().length > 0
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      (await request.json()) as SubmitData;

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "No application data received.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !body.fullName?.trim() ||
      !body.email?.trim() ||
      !body.phoneNumber?.trim() ||
      !body.state?.trim() ||
      !body.vehicleType
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete all personal information.",
        },
        {
          status: 400,
        }
      );
    }

    const validVehicleTypes = [
      "cargo-van",
      "sprinter-van",
      "box-truck",
    ];

    if (
      !validVehicleTypes.includes(
        body.vehicleType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid vehicle type.",
        },
        {
          status: 400,
        }
      );
    }

    const requiredDocuments = [
      "ssn",
      "license",
      "registration",
      "insurance",
      "check",
    ] as const;

    for (const documentType of requiredDocuments) {
      if (
        !isValidUploadedFile(
          body.files?.[documentType]
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing uploaded document: ${documentType}`,
          },
          {
            status: 400,
          }
        );
      }
    }

    const requiredPhotos = [
      "front",
      "driverSide",
      "passengerSide",
      "rear",
    ] as const;

    for (const photoType of requiredPhotos) {
      if (
        !isValidUploadedFile(
          body.photos?.[photoType]
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `Missing uploaded vehicle photo: ${photoType}`,
          },
          {
            status: 400,
          }
        );
      }
    }

    await dbConnect();

    const now = new Date();

    const application =
      await DriverApplication.create({
        fullName:
          body.fullName.trim(),

        email:
          body.email.trim().toLowerCase(),

        phoneNumber:
          body.phoneNumber.trim(),

        state:
          body.state.trim(),

        vehicleType:
          body.vehicleType,

        files: {
          ssn: {
            fileName:
              body.files.ssn.name,

            fileSize:
              body.files.ssn.size,

            fileUrl:
              body.files.ssn.url,

            uploadedAt: now,
          },

          license: {
            fileName:
              body.files.license.name,

            fileSize:
              body.files.license.size,

            fileUrl:
              body.files.license.url,

            uploadedAt: now,
          },

          registration: {
            fileName:
              body.files.registration.name,

            fileSize:
              body.files.registration.size,

            fileUrl:
              body.files.registration.url,

            uploadedAt: now,
          },

          insurance: {
            fileName:
              body.files.insurance.name,

            fileSize:
              body.files.insurance.size,

            fileUrl:
              body.files.insurance.url,

            uploadedAt: now,
          },

          check: {
            fileName:
              body.files.check.name,

            fileSize:
              body.files.check.size,

            fileUrl:
              body.files.check.url,

            uploadedAt: now,
          },
        },

        photos: {
          front: {
            fileName:
              body.photos.front.name,

            fileSize:
              body.photos.front.size,

            fileUrl:
              body.photos.front.url,

            uploadedAt: now,
          },

          driverSide: {
            fileName:
              body.photos.driverSide.name,

            fileSize:
              body.photos.driverSide.size,

            fileUrl:
              body.photos.driverSide.url,

            uploadedAt: now,
          },

          passengerSide: {
            fileName:
              body.photos.passengerSide.name,

            fileSize:
              body.photos.passengerSide.size,

            fileUrl:
              body.photos.passengerSide.url,

            uploadedAt: now,
          },

          rear: {
            fileName:
              body.photos.rear.name,

            fileSize:
              body.photos.rear.size,

            fileUrl:
              body.photos.rear.url,

            uploadedAt: now,
          },
        },

        status: "pending",
      });

    return NextResponse.json(
      {
        success: true,
        applicationId:
          application._id.toString(),
        message:
          "Application submitted successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "SUBMIT APPLICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit application.",
      },
      {
        status: 500,
      }
    );
  }
}