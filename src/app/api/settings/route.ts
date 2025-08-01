import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

// In-memory settings storage (in production, you'd use a database)
let settings = {
  siteName: 'CyberSage',
  siteDescription: 'Find the Answers Just When you Think of the Questions',
  siteUrl: 'https://cybersage.com',
  adminEmail: 'admin@cybersage.com',
  postsPerPage: 10,
  enableComments: true,
  enableSocialSharing: true,
  enableNewsletter: false,
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon!'
};

export async function GET() {
  try {
    await dbConnect();
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Update settings
    settings = { ...settings, ...body };
    
    // Update maintenance mode file
    if (typeof body.maintenanceMode === 'boolean') {
      const maintenancePath = path.join(process.cwd(), 'maintenance.json');
      const maintenanceData = { maintenanceMode: body.maintenanceMode };
      fs.writeFileSync(maintenancePath, JSON.stringify(maintenanceData, null, 2));
      console.log('Maintenance mode updated in file:', body.maintenanceMode);
      console.log('File written to:', maintenancePath);
      console.log('File content:', JSON.stringify(maintenanceData, null, 2));
    }
    
    console.log('Settings updated:', settings);
    
    return NextResponse.json({ 
      message: 'Settings saved successfully',
      settings 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
} 