import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    let applications = [];
    if (fs.existsSync(dataPath)) {
      const raw = fs.readFileSync(dataPath, 'utf-8');
      applications = JSON.parse(raw);
    }
    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error('GET error:', error.message);
    return NextResponse.json({ success: false, applications: [] }, { status: 500 });
  }
}