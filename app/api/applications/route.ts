import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';
import { Types } from 'mongoose';

type Params = { params: { id: string } }

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    const { status } = await request.json();
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    const application = await DriverApplication.findByIdAndUpdate(
      params.id, { status }, { new: true }
    );
    if (!application) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    await dbConnect();
    if (!Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    const deleted = await DriverApplication.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}