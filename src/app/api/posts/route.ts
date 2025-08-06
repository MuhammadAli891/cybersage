import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Posts API called');
    console.log('📡 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await dbConnect();
    console.log('✅ Database connected successfully');
    
    const { searchParams } = new URL(request.url);
    const showOnHomepage = searchParams.get('showOnHomepage');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const all = searchParams.get('all'); // For admin panel
    const timestamp = searchParams.get('t'); // Cache busting
    
    console.log('🔍 Query params:', { showOnHomepage, limit, category, all, timestamp });
    
    // Build query object
    const query: any = {};
    
    // If not admin request, only show published posts
    if (all !== 'true') {
      query.published = true;
    }
    
    if (showOnHomepage === 'true') {
      query.showOnHomepage = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    console.log('🔍 Final query:', query);
    
    // Build the query
    let postsQuery = Post.find(query).sort({ createdAt: -1 });
    
    // Only apply limit if not admin request or if limit is explicitly set
    if (all !== 'true' || searchParams.get('limit')) {
      postsQuery = postsQuery.limit(limit);
    }
    
    // Optimize: Use lean() for faster queries and add caching
    const posts = await postsQuery
      .lean()
      .select('title slug excerpt featuredImage category author createdAt views published showOnHomepage');
    
    console.log('📝 Found posts:', posts.length);
    console.log('📝 Posts data:', posts);
    
    // Ensure we return the posts array properly
    const responseData = { posts: posts || [] };
    console.log('📤 Response data:', responseData);
    
    // Add cache headers based on request type
    const response = NextResponse.json(responseData);
    
    if (showOnHomepage === 'true') {
      // Aggressive no-caching for homepage requests to ensure dynamic updates
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      response.headers.set('Surrogate-Control', 'no-store');
      response.headers.set('ETag', `posts-homepage-${posts.length}-${Date.now()}`);
      response.headers.set('Last-Modified', new Date().toUTCString());
    } else if (all !== 'true') {
      // Cache for 5 minutes for regular requests
      response.headers.set('Cache-Control', 'public, max-age=300');
      response.headers.set('ETag', `posts-${posts.length}-${Date.now()}`);
    } else {
      // No caching for admin requests
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Check if slug already exists
    const existingPost = await Post.findOne({ slug: body.slug });
    if (existingPost) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Prepare post data with SEO fields
    const postData = {
      ...body,
      // Ensure SEO fields are properly handled
      metaTitle: body.metaTitle || body.title, // Use title as fallback
      metaDescription: body.metaDescription || body.excerpt, // Use excerpt as fallback
      metaKeywords: body.metaKeywords || '',
      canonicalUrl: body.canonicalUrl || '',
      noIndex: body.noIndex || false,
    };

    // Create new post
    const post = new Post(postData);
    await post.save();

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
} 