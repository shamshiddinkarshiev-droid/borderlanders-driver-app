import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';

function makeFileEntry(file: any) {
  return {
    fileName: file?.name || 'unknown',
    fileSize: file?.size || 0,
    fileUrl: file?.url || file?.ufsUrl || file?.fileUrl || '',
    uploadedAt: new Date(),
  };
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const {
      fullName,
      email,
      phoneNumber,
      state,
      vehicleType,
      files,
      photos,
    } = body;

    const application = await DriverApplication.create({
      fullName,
      email,
      phoneNumber,
      state,
      vehicleType,

      files: {
        ssn: makeFileEntry(files?.ssn),
        license: makeFileEntry(files?.license),
        registration: makeFileEntry(files?.registration),
        insurance: makeFileEntry(files?.insurance),
        check: makeFileEntry(files?.check),
      },

      photos: {
        front: makeFileEntry(photos?.front),
        driverSide: makeFileEntry(photos?.driverSide),
        passengerSide: makeFileEntry(photos?.passengerSide),
        rear: makeFileEntry(photos?.rear),
      },

      status: 'pending',
      submittedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        applicationId: application._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('SUBMIT ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to submit application',
      },
      { status: 500 }
    );
  }
}