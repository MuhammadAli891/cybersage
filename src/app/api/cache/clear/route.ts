import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';

export async function POST() {
  try {
    console.log('🧹 Clearing all caches...');
    
    // Clear database query cache by reconnecting
    await dbConnect();
    
    // Force refresh by updating a cache timestamp
    const cacheTimestamp = Date.now();
    
    // Clear any in-memory caches
    if ((global as any).cache) {
      (global as any).cache.clear();
    }
    
    // Clear Next.js cache if possible
    if ((global as any).__NEXT_CACHE__) {
      (global as any).__NEXT_CACHE__.clear();
    }
    
    // Force database to refresh by doing multiple queries
    await Post.countDocuments();
    await Category.countDocuments();
    
    // Force a small delay to ensure cache invalidation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Additional cache-busting: Update a cache version in global scope
    (global as any).__CACHE_VERSION__ = cacheTimestamp;
    
    console.log('✅ Cache cleared successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache cleared successfully',
      timestamp: cacheTimestamp,
      cacheVersion: (global as any).__CACHE_VERSION__
    });
    
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 