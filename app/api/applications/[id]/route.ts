import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';

export async function PATCH(request: Request, context: any) {
  try {
    await dbConnect();
    const { status } = await request.json();
    const application = await DriverApplication.findByIdAndUpdate(context.params.id, { status }, { new: true });
    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await dbConnect();
    await DriverApplication.findByIdAndDelete(context.params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}