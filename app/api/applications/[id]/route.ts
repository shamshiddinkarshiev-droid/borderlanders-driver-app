import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';
import { Types } from 'mongoose';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET - Get one application
export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const application = await DriverApplication.findById(id).lean();

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('GET application error:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// PATCH - Update application
export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const application = await DriverApplication.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('PATCH application error:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete application
export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    const deleted = await DriverApplication.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error: any) {
    console.error('DELETE application error:', error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}