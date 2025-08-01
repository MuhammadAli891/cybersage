import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

const samplePosts = [
  {
    title: "How to Use MongoDB with Next.js: Complete Guide",
    slug: "how-to-use-mongodb-with-nextjs",
    content: "MongoDB is a powerful NoSQL database that works great with Next.js. In this comprehensive guide, we'll explore how to integrate MongoDB with your Next.js application, set up models, and perform CRUD operations.",
    excerpt: "Learn how to integrate MongoDB with Next.js for building scalable web applications with proper database management.",
    featuredImage: "https://picsum.photos/800/400?random=1",
    category: "Tech",
    tags: ["mongodb", "nextjs", "database", "web-development"],
    metaDescription: "Complete guide to using MongoDB with Next.js for building modern web applications",
    published: true,
    author: "Admin",
    views: 1250
  },
  {
    title: "Top 10 Social Media Marketing Strategies for 2024",
    slug: "social-media-marketing-strategies-2024",
    content: "Social media marketing is evolving rapidly. Discover the top 10 strategies that will help you grow your brand presence and engage with your audience effectively in 2024.",
    excerpt: "Discover the most effective social media marketing strategies to boost your brand presence in 2024.",
    featuredImage: "https://picsum.photos/800/400?random=2",
    category: "Social Media",
    tags: ["social-media", "marketing", "strategy", "branding"],
    metaDescription: "Top 10 social media marketing strategies for 2024 to grow your brand presence",
    published: true,
    author: "Admin",
    views: 2100
  },
  {
    title: "Best Gaming Accessories for Professional Gamers",
    slug: "best-gaming-accessories-professional",
    content: "Professional gaming requires the right equipment. From high-performance mice to mechanical keyboards, discover the essential gaming accessories that will give you the competitive edge.",
    excerpt: "Essential gaming accessories for professional gamers to enhance performance and gaming experience.",
    featuredImage: "https://picsum.photos/800/400?random=3",
    category: "Gaming",
    tags: ["gaming", "accessories", "professional", "equipment"],
    metaDescription: "Best gaming accessories for professional gamers to improve performance",
    published: true,
    author: "Admin",
    views: 890
  },
  {
    title: "E-commerce Business Trends: What's New in 2024",
    slug: "ecommerce-business-trends-2024",
    content: "The e-commerce landscape is constantly changing. Explore the latest trends in online business, from AI-powered recommendations to sustainable shopping practices.",
    excerpt: "Latest e-commerce business trends and innovations shaping the online retail industry in 2024.",
    featuredImage: "https://picsum.photos/800/400?random=4",
    category: "Business",
    tags: ["ecommerce", "business", "trends", "online-retail"],
    metaDescription: "Latest e-commerce business trends and innovations for 2024",
    published: true,
    author: "Admin",
    views: 1560
  },
  {
    title: "Internet Security: Protecting Your Digital Life",
    slug: "internet-security-protecting-digital-life",
    content: "In today's connected world, internet security is more important than ever. Learn about the best practices for protecting your personal information and staying safe online.",
    excerpt: "Essential internet security practices to protect your digital life and personal information online.",
    featuredImage: "https://picsum.photos/800/400?random=5",
    category: "Internet",
    tags: ["security", "internet", "privacy", "cybersecurity"],
    metaDescription: "Internet security guide to protect your digital life and personal information",
    published: true,
    author: "Admin",
    views: 980
  },
  {
    title: "Latest Tech News: AI Breakthroughs and Innovations",
    slug: "latest-tech-news-ai-breakthroughs",
    content: "Stay updated with the latest technology news, including AI breakthroughs, new software releases, and innovative tech solutions that are shaping our future.",
    excerpt: "Latest technology news covering AI breakthroughs, software updates, and innovative tech solutions.",
    featuredImage: "https://picsum.photos/800/400?random=6",
    category: "News",
    tags: ["tech-news", "ai", "innovation", "technology"],
    metaDescription: "Latest technology news and AI breakthroughs shaping the future",
    published: true,
    author: "Admin",
    views: 3200
  },
  {
    title: "Global Tech News: International Technology Updates",
    slug: "global-tech-news-international-updates",
    content: "Get the latest global technology news from around the world. From Silicon Valley to tech hubs in Asia and Europe, stay informed about international tech developments.",
    excerpt: "Latest global technology news and updates from international tech hubs and companies worldwide.",
    featuredImage: "https://picsum.photos/800/400?random=7",
    category: "Global Tech News",
    tags: ["global-tech", "international", "silicon-valley", "tech-hubs"],
    metaDescription: "Latest global technology news and international tech developments",
    published: true,
    author: "Admin",
    views: 1450
  },
  {
    title: "Instagram Algorithm Changes: What You Need to Know",
    slug: "instagram-algorithm-changes-2024",
    content: "Instagram's algorithm is constantly evolving. Learn about the latest changes and how to adapt your content strategy to maintain visibility and engagement.",
    excerpt: "Understanding Instagram algorithm changes and adapting your content strategy for better visibility.",
    featuredImage: "https://picsum.photos/800/400?random=8",
    category: "Social Media",
    tags: ["instagram", "algorithm", "social-media", "content-strategy"],
    metaDescription: "Latest Instagram algorithm changes and content strategy adaptation",
    published: true,
    author: "Admin",
    views: 2800
  },
  {
    title: "Cybersecurity Best Practices for Small Businesses",
    slug: "cybersecurity-best-practices-small-businesses",
    content: "Small businesses are increasingly targeted by cyber attacks. Learn essential cybersecurity practices to protect your business data and customer information.",
    excerpt: "Essential cybersecurity practices for small businesses to protect against cyber threats and data breaches.",
    featuredImage: "https://picsum.photos/800/400?random=9",
    category: "Tech",
    tags: ["cybersecurity", "small-business", "data-protection", "security"],
    metaDescription: "Cybersecurity best practices for small businesses to prevent cyber attacks",
    published: true,
    author: "Admin",
    views: 1100
  },
  {
    title: "YouTube SEO: Optimize Your Videos for Better Rankings",
    slug: "youtube-seo-optimize-videos-rankings",
    content: "YouTube SEO is crucial for video visibility. Learn how to optimize your video titles, descriptions, tags, and thumbnails to improve your YouTube rankings.",
    excerpt: "Complete guide to YouTube SEO optimization for better video rankings and visibility.",
    featuredImage: "https://picsum.photos/800/400?random=10",
    category: "Social Media",
    tags: ["youtube", "seo", "video-optimization", "rankings"],
    metaDescription: "YouTube SEO guide to optimize videos for better rankings and visibility",
    published: true,
    author: "Admin",
    views: 1900
  },
  {
    title: "Virtual Reality Gaming: The Future of Entertainment",
    slug: "virtual-reality-gaming-future-entertainment",
    content: "Virtual reality is revolutionizing the gaming industry. Explore the latest VR gaming technologies and how they're shaping the future of entertainment.",
    excerpt: "Exploring virtual reality gaming technologies and their impact on the future of entertainment.",
    featuredImage: "https://picsum.photos/800/400?random=11",
    category: "Gaming",
    tags: ["vr", "virtual-reality", "gaming", "entertainment"],
    metaDescription: "Virtual reality gaming technologies shaping the future of entertainment",
    published: true,
    author: "Admin",
    views: 750
  },
  {
    title: "Digital Marketing Strategies for E-commerce Success",
    slug: "digital-marketing-strategies-ecommerce-success",
    content: "Digital marketing is essential for e-commerce success. Discover effective strategies for driving traffic, increasing conversions, and building customer loyalty.",
    excerpt: "Effective digital marketing strategies to drive e-commerce success and increase conversions.",
    featuredImage: "https://picsum.photos/800/400?random=12",
    category: "Business",
    tags: ["digital-marketing", "ecommerce", "conversions", "traffic"],
    metaDescription: "Digital marketing strategies for e-commerce success and increased conversions",
    published: true,
    author: "Admin",
    views: 1680
  }
];

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Clear existing posts
    await Post.deleteMany({});
    
    // Insert sample posts
    const createdPosts = await Post.insertMany(samplePosts);
    
    return NextResponse.json({
      success: true,
      message: `${createdPosts.length} sample posts created successfully`,
      posts: createdPosts
    });
  } catch (error) {
    console.error('Error seeding posts:', error);
    return NextResponse.json(
      { error: 'Failed to seed posts' },
      { status: 500 }
    );
  }
} 