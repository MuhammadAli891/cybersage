import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    console.log('🏠 Homepage posts API called');
    console.log('📡 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await dbConnect();
    console.log('✅ Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    const timestamp = searchParams.get('t');
    const cacheVersion = searchParams.get('cv');
    
    console.log('🔍 Homepage query params:', { limit, timestamp, cacheVersion });
    
    // Build query for homepage posts
    const query = {
      published: true,
      showOnHomepage: true
    };
    
    console.log('🔍 Homepage query:', query);
    
    // Get posts for homepage
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .select('title slug excerpt featuredImage category author createdAt views published showOnHomepage');
    
    console.log('📝 Found homepage posts:', posts.length);
    
    // Ensure we return the posts array properly
    const responseData = { posts: posts || [] };
    
    // Create response with aggressive no-cache headers
    const response = NextResponse.json(responseData);
    
    // Set aggressive no-cache headers for homepage
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    response.headers.set('X-Accel-Expires', '0');
    response.headers.set('ETag', `homepage-posts-${posts.length}-${Date.now()}`);
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('X-Cache-Status', 'BYPASS');
    
    console.log('✅ Homepage posts response created with no-cache headers');
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching homepage posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 