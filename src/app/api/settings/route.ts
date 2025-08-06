import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    await dbConnect();
    
    // Get settings from database or create default
    let settings = await Settings.findOne({});
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings();
      await settings.save();
    }
    
    return NextResponse.json({ settings: settings.toObject() });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Find existing settings or create new ones
    let settings = await Settings.findOne({});
    
    if (!settings) {
      settings = new Settings();
    }
    
    // Update settings with new values
    Object.keys(body).forEach(key => {
      if (settings.schema.paths[key]) {
        settings[key] = body[key];
      }
    });
    
    await settings.save();
    
    console.log('Settings updated successfully:', settings.toObject());
    
    return NextResponse.json({ 
      message: 'Settings saved successfully',
      settings: settings.toObject()
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
} 