import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import DriverApplication from '@/models/DriverApplication';

export async function GET() {
  try {
    await dbConnect();
    const applications = await DriverApplication.find().sort({ submittedAt: -1 }).lean();
    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error('GET error:', error.message);
    return NextResponse.json({ success: false, applications: [] }, { status: 500 });
  }
}
