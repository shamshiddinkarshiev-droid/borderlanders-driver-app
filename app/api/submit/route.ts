import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phoneNumber, state, vehicleType, files, photos } = body;

    const application = {
      _id: Date.now().toString(),
      fullName,
      email,
      phoneNumber,
      state,
      vehicleType,
      files,
      photos,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    const dataPath = path.join(process.cwd(), 'data.json');
    let applications = [];
    
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      applications = JSON.parse(raw);
    }
    
    applications.push(application);
    fs.writeFileSync(dataPath, JSON.stringify(applications, null, 2));

    return NextResponse.json({ success: true, applicationId: application._id }, { status: 201 });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}