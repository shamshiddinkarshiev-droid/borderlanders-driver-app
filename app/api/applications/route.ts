import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';

export async function GET() {
  try {
    await dbConnect();
    const applications = await DriverApplication.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}