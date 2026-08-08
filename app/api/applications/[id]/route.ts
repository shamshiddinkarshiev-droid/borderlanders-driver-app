import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PATCH(request: Request, context: any) {
  try {
    const id = context.params.id;
    const { status } = await request.json();
    const dataPath = path.join(process.cwd(), 'data.json');
    
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const applications = JSON.parse(raw);

    const updated = applications.map((app: any) => {
      if (String(app._id) === String(id)) {
        return { ...app, status };
      }
      return app;
    });

    fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('PATCH error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}