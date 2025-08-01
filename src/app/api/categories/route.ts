import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Post from '@/models/Post';

export async function GET() {
  try {
    console.log('🔍 Categories API called');
    console.log('📡 MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await dbConnect();
    console.log('✅ Database connected successfully');
    
    // Get categories with post count
    const categories = await Category.find({}).sort({ name: 1 });
    console.log('📂 Found categories:', categories.length);
    console.log('📂 Categories data:', categories);
    
    // Get post count for each category
    const categoriesWithPostCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await Post.countDocuments({ 
          category: category.name,
          published: true 
        });
        
        return {
          ...category.toObject(),
          postCount
        };
      })
    );
    
    console.log('📊 Categories with post count:', categoriesWithPostCount);
    
    return NextResponse.json({ categories: categoriesWithPostCount });
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch categories', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      $or: [{ name: body.name }, { slug: body.slug }] 
    });
    
    if (existingCategory) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }
    
    // Prepare category data with SEO fields
    const categoryData = {
      ...body,
      metaTitle: body.metaTitle || body.name, // Use name as fallback
      metaDescription: body.metaDescription || body.description, // Use description as fallback
      metaKeywords: body.metaKeywords || '',
      canonicalUrl: body.canonicalUrl || '',
      noIndex: body.noIndex || false,
    };
    
    const category = new Category(categoryData);
    await category.save();
    
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 