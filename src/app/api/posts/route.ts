import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const showOnHomepage = searchParams.get('showOnHomepage');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const all = searchParams.get('all'); // For admin panel
    
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
    
    // Add cache headers only for public requests, but not for homepage requests
    const response = NextResponse.json({ posts });
    if (all !== 'true' && showOnHomepage !== 'true') {
      response.headers.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
      response.headers.set('ETag', `posts-${posts.length}-${Date.now()}`);
    } else if (showOnHomepage === 'true') {
      // No caching for homepage requests to ensure dynamic updates
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
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