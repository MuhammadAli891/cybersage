import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    
    const settings = await Settings.findOne({});
    
    if (!settings) {
      return NextResponse.json({ maintenanceMode: false });
    }
    
    return NextResponse.json({ 
      maintenanceMode: settings.maintenanceMode || false,
      maintenanceMessage: settings.maintenanceMessage || 'We are currently performing maintenance. Please check back soon!'
    });
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return NextResponse.json({ maintenanceMode: false });
  }
} 