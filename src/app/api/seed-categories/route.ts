import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Category from '@/models/Category';

const sampleCategories = [
  {
    name: "Tech",
    slug: "tech",
    description: "Latest technology insights, tutorials, and innovations in the tech world. Stay updated with cutting-edge developments and practical guides.",
    color: "#3B82F6"
  },
  {
    name: "Social Media",
    slug: "social-media",
    description: "Social media strategies, platform updates, and digital marketing tips to boost your online presence and engagement.",
    color: "#8B5CF6"
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "Gaming industry news, reviews, and insights for both casual and professional gamers. Discover the latest in gaming technology.",
    color: "#10B981"
  },
  {
    name: "Business",
    slug: "business",
    description: "Business strategies, entrepreneurship tips, and industry insights to help you grow your business and career.",
    color: "#F59E0B"
  },
  {
    name: "Internet",
    slug: "internet",
    description: "Internet trends, web development, and digital tools to enhance your online experience and productivity.",
    color: "#EF4444"
  },
  {
    name: "News",
    slug: "news",
    description: "Breaking technology news, industry updates, and important developments in the digital world.",
    color: "#06B6D4"
  },
  {
    name: "Global Tech News",
    slug: "global-tech-news",
    description: "International technology news and updates from around the world, covering global tech trends and innovations.",
    color: "#EC4899"
  }
];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Clear existing categories
    await Category.deleteMany({});
    
    // Insert sample categories
    const createdCategories = await Category.insertMany(sampleCategories);
    
    return NextResponse.json({
      success: true,
      message: `${createdCategories.length} categories created successfully`,
      categories: createdCategories
    });
  } catch (error) {
    console.error('Error seeding categories:', error);
    return NextResponse.json(
      { error: 'Failed to seed categories' },
      { status: 500 }
    );
  }
} 