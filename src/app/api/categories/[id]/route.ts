import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';
import Post from '@/models/Post';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    
    const category = await Category.findById(resolvedParams.id);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Get post count for this category
    const postCount = await Post.countDocuments({ 
      category: category.name,
      published: true 
    });
    
    const categoryWithPostCount = {
      ...category.toObject(),
      postCount
    };
    
    return NextResponse.json({ category: categoryWithPostCount });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const body = await request.json();
    
    // Check if category exists
    const existingCategory = await Category.findById(resolvedParams.id);
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if new name/slug conflicts with other categories
    if (body.name || body.slug) {
      const conflictCategory = await Category.findOne({
        _id: { $ne: resolvedParams.id },
        $or: [
          { name: body.name || existingCategory.name },
          { slug: body.slug || existingCategory.slug }
        ]
      });
      
      if (conflictCategory) {
        return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 400 });
      }
    }
    
    // Prepare update data with SEO fields
    const updateData = {
      ...body,
      metaTitle: body.metaTitle || body.name || existingCategory.name,
      metaDescription: body.metaDescription || body.description || existingCategory.description,
      metaKeywords: body.metaKeywords || existingCategory.metaKeywords || '',
      canonicalUrl: body.canonicalUrl || existingCategory.canonicalUrl || '',
      noIndex: body.noIndex !== undefined ? body.noIndex : existingCategory.noIndex,
    };
    
    const updatedCategory = await Category.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    // Get updated post count
    const postCount = await Post.countDocuments({ 
      category: updatedCategory.name,
      published: true 
    });
    
    const categoryWithPostCount = {
      ...updatedCategory.toObject(),
      postCount
    };
    
    return NextResponse.json({ category: categoryWithPostCount });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    
    // Check if category exists
    const category = await Category.findById(resolvedParams.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if category has posts
    const postCount = await Post.countDocuments({ category: category.name });
    if (postCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. It has ${postCount} posts. Please reassign or delete the posts first.` 
      }, { status: 400 });
    }
    
    await Category.findByIdAndDelete(resolvedParams.id);
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 