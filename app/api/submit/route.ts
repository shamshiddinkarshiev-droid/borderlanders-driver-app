import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { fullName, email, phoneNumber, state, vehicleType, files, photos } = body;

    const application = await DriverApplication.create({
      fullName, email, phoneNumber, state, vehicleType,
      files: {
        ssn: { fileName: files?.ssn?.name || 'unknown', fileSize: files?.ssn?.size || 0, uploadedAt: new Date() },
        license: { fileName: files?.license?.name || 'unknown', fileSize: files?.license?.size || 0, uploadedAt: new Date() },
        registration: { fileName: files?.registration?.name || 'unknown', fileSize: files?.registration?.size || 0, uploadedAt: new Date() },
        insurance: { fileName: files?.insurance?.name || 'unknown', fileSize: files?.insurance?.size || 0, uploadedAt: new Date() },
        check: { fileName: files?.check?.name || 'unknown', fileSize: files?.check?.size || 0, uploadedAt: new Date() }
      },
      photos: {
        front: { fileName: photos?.front?.name || 'unknown', fileSize: photos?.front?.size || 0, uploadedAt: new Date() },
        driverSide: { fileName: photos?.driverSide?.name || 'unknown', fileSize: photos?.driverSide?.size || 0, uploadedAt: new Date() },
        passengerSide: { fileName: photos?.passengerSide?.name || 'unknown', fileSize: photos?.passengerSide?.size || 0, uploadedAt: new Date() },
        rear: { fileName: photos?.rear?.name || 'unknown', fileSize: photos?.rear?.size || 0, uploadedAt: new Date() }
      },
      status: 'pending',
      submittedAt: new Date()
    });

    return NextResponse.json({ success: true, applicationId: application._id }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}