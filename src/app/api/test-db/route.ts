import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Post from '@/models/Post';

export async function GET() {
  try {
    await dbConnect();
    
    // Test database connection
    const categories = await Category.find({});
    const posts = await Post.find({ published: true }).limit(5);
    
    return NextResponse.json({ 
      success: true,
      categoriesCount: categories.length,
      postsCount: posts.length,
      categories: categories.map(cat => ({ name: cat.name, slug: cat.slug })),
      samplePosts: posts.map(post => ({ title: post.title, category: post.category }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 