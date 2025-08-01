import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const maintenancePath = path.join(process.cwd(), 'maintenance.json');
    
    if (fs.existsSync(maintenancePath)) {
      const maintenanceData = JSON.parse(fs.readFileSync(maintenancePath, 'utf8'));
      return NextResponse.json({ maintenanceMode: maintenanceData.maintenanceMode });
    }
    
    return NextResponse.json({ maintenanceMode: false });
  } catch (error) {
    console.error('Error reading maintenance mode:', error);
    return NextResponse.json({ maintenanceMode: false });
  }
} 