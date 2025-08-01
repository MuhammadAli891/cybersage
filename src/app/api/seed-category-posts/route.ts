import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';

const categoryPosts = {
  'tech': [
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
      title: "Cybersecurity Best Practices for Small Businesses",
      slug: "cybersecurity-best-practices-small-businesses",
      content: "Small businesses are increasingly targeted by cyber attacks. Learn essential cybersecurity practices to protect your business data and customer information.",
      excerpt: "Essential cybersecurity practices for small businesses to protect against cyber threats and data breaches.",
      featuredImage: "https://picsum.photos/800/400?random=2",
      category: "Tech",
      tags: ["cybersecurity", "small-business", "data-protection", "security"],
      metaDescription: "Cybersecurity best practices for small businesses to prevent cyber attacks",
      published: true,
      author: "Admin",
      views: 1100
    },
    {
      title: "React vs Vue.js: Which Framework to Choose in 2024",
      slug: "react-vs-vuejs-framework-choice-2024",
      content: "Choosing between React and Vue.js can be challenging. This comprehensive comparison will help you understand the differences and make an informed decision for your next project.",
      excerpt: "Detailed comparison of React and Vue.js frameworks to help you choose the right one for your project in 2024.",
      featuredImage: "https://picsum.photos/800/400?random=3",
      category: "Tech",
      tags: ["react", "vuejs", "javascript", "frontend"],
      metaDescription: "React vs Vue.js comparison guide for choosing the right framework in 2024",
      published: true,
      author: "Admin",
      views: 980
    },
    {
      title: "Docker Containerization: A Beginner's Guide",
      slug: "docker-containerization-beginners-guide",
      content: "Docker has revolutionized how we deploy applications. Learn the basics of containerization and how to get started with Docker for your development workflow.",
      excerpt: "Complete beginner's guide to Docker containerization and how to implement it in your development workflow.",
      featuredImage: "https://picsum.photos/800/400?random=4",
      category: "Tech",
      tags: ["docker", "containerization", "devops", "deployment"],
      metaDescription: "Docker containerization guide for beginners to understand and implement",
      published: true,
      author: "Admin",
      views: 850
    },
    {
      title: "Machine Learning Basics: Getting Started with Python",
      slug: "machine-learning-basics-python-guide",
      content: "Machine learning is transforming industries. Learn the fundamentals of ML using Python and popular libraries like scikit-learn and TensorFlow.",
      excerpt: "Comprehensive guide to machine learning basics using Python and popular ML libraries.",
      featuredImage: "https://picsum.photos/800/400?random=5",
      category: "Tech",
      tags: ["machine-learning", "python", "ai", "data-science"],
      metaDescription: "Machine learning basics guide using Python for beginners",
      published: true,
      author: "Admin",
      views: 1200
    },
    {
      title: "Cloud Computing: AWS vs Azure vs Google Cloud",
      slug: "cloud-computing-aws-azure-google-cloud-comparison",
      content: "Cloud computing platforms offer different services and pricing models. Compare AWS, Azure, and Google Cloud to find the best fit for your business needs.",
      excerpt: "Comprehensive comparison of major cloud computing platforms: AWS, Azure, and Google Cloud.",
      featuredImage: "https://picsum.photos/800/400?random=6",
      category: "Tech",
      tags: ["cloud-computing", "aws", "azure", "google-cloud"],
      metaDescription: "Cloud computing platform comparison: AWS vs Azure vs Google Cloud",
      published: true,
      author: "Admin",
      views: 950
    }
  ],
  'social-media': [
    {
      title: "Top 10 Social Media Marketing Strategies for 2024",
      slug: "social-media-marketing-strategies-2024",
      content: "Social media marketing is evolving rapidly. Discover the top 10 strategies that will help you grow your brand presence and engage with your audience effectively in 2024.",
      excerpt: "Discover the most effective social media marketing strategies to boost your brand presence in 2024.",
      featuredImage: "https://picsum.photos/800/400?random=7",
      category: "Social Media",
      tags: ["social-media", "marketing", "strategy", "branding"],
      metaDescription: "Top 10 social media marketing strategies for 2024 to grow your brand presence",
      published: true,
      author: "Admin",
      views: 2100
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
      title: "YouTube SEO: Optimize Your Videos for Better Rankings",
      slug: "youtube-seo-optimize-videos-rankings",
      content: "YouTube SEO is crucial for video visibility. Learn how to optimize your video titles, descriptions, tags, and thumbnails to improve your YouTube rankings.",
      excerpt: "Complete guide to YouTube SEO optimization for better video rankings and visibility.",
      featuredImage: "https://picsum.photos/800/400?random=9",
      category: "Social Media",
      tags: ["youtube", "seo", "video-optimization", "rankings"],
      metaDescription: "YouTube SEO guide to optimize videos for better rankings and visibility",
      published: true,
      author: "Admin",
      views: 1900
    },
    {
      title: "TikTok Marketing: How to Go Viral in 2024",
      slug: "tiktok-marketing-viral-strategies-2024",
      content: "TikTok has become a powerful marketing platform. Learn proven strategies to create viral content and grow your brand presence on TikTok.",
      excerpt: "Proven TikTok marketing strategies to create viral content and grow your brand in 2024.",
      featuredImage: "https://picsum.photos/800/400?random=10",
      category: "Social Media",
      tags: ["tiktok", "marketing", "viral", "content-creation"],
      metaDescription: "TikTok marketing strategies to create viral content and grow your brand",
      published: true,
      author: "Admin",
      views: 1600
    },
    {
      title: "LinkedIn Content Strategy for B2B Marketing",
      slug: "linkedin-content-strategy-b2b-marketing",
      content: "LinkedIn is the premier platform for B2B marketing. Discover effective content strategies to build your professional brand and generate leads.",
      excerpt: "Effective LinkedIn content strategies for B2B marketing and professional brand building.",
      featuredImage: "https://picsum.photos/800/400?random=11",
      category: "Social Media",
      tags: ["linkedin", "b2b", "marketing", "content-strategy"],
      metaDescription: "LinkedIn content strategy guide for B2B marketing and lead generation",
      published: true,
      author: "Admin",
      views: 1400
    },
    {
      title: "Twitter Marketing: Building Your Brand in 280 Characters",
      slug: "twitter-marketing-brand-building-280-characters",
      content: "Twitter's character limit challenges marketers to be concise and creative. Learn how to build your brand effectively within Twitter's constraints.",
      excerpt: "Effective Twitter marketing strategies to build your brand within the 280-character limit.",
      featuredImage: "https://picsum.photos/800/400?random=12",
      category: "Social Media",
      tags: ["twitter", "marketing", "branding", "social-media"],
      metaDescription: "Twitter marketing strategies to build your brand effectively",
      published: true,
      author: "Admin",
      views: 1100
    }
  ],
  'gaming': [
    {
      title: "Best Gaming Accessories for Professional Gamers",
      slug: "best-gaming-accessories-professional",
      content: "Professional gaming requires the right equipment. From high-performance mice to mechanical keyboards, discover the essential gaming accessories that will give you the competitive edge.",
      excerpt: "Essential gaming accessories for professional gamers to enhance performance and gaming experience.",
      featuredImage: "https://picsum.photos/800/400?random=13",
      category: "Gaming",
      tags: ["gaming", "accessories", "professional", "equipment"],
      metaDescription: "Best gaming accessories for professional gamers to improve performance",
      published: true,
      author: "Admin",
      views: 890
    },
    {
      title: "Virtual Reality Gaming: The Future of Entertainment",
      slug: "virtual-reality-gaming-future-entertainment",
      content: "Virtual reality is revolutionizing the gaming industry. Explore the latest VR gaming technologies and how they're shaping the future of entertainment.",
      excerpt: "Exploring virtual reality gaming technologies and their impact on the future of entertainment.",
      featuredImage: "https://picsum.photos/800/400?random=14",
      category: "Gaming",
      tags: ["vr", "virtual-reality", "gaming", "entertainment"],
      metaDescription: "Virtual reality gaming technologies shaping the future of entertainment",
      published: true,
      author: "Admin",
      views: 750
    },
    {
      title: "Esports Industry: The Rise of Competitive Gaming",
      slug: "esports-industry-rise-competitive-gaming",
      content: "Esports has grown into a billion-dollar industry. Learn about the evolution of competitive gaming and its impact on the gaming landscape.",
      excerpt: "Exploring the rise of esports and its impact on the competitive gaming industry.",
      featuredImage: "https://picsum.photos/800/400?random=15",
      category: "Gaming",
      tags: ["esports", "competitive-gaming", "industry", "gaming"],
      metaDescription: "Esports industry growth and its impact on competitive gaming",
      published: true,
      author: "Admin",
      views: 1200
    },
    {
      title: "Mobile Gaming Trends: What's Hot in 2024",
      slug: "mobile-gaming-trends-2024",
      content: "Mobile gaming continues to dominate the industry. Discover the latest trends, popular games, and what's driving the mobile gaming revolution.",
      excerpt: "Latest mobile gaming trends and popular games driving the industry in 2024.",
      featuredImage: "https://picsum.photos/800/400?random=16",
      category: "Gaming",
      tags: ["mobile-gaming", "trends", "games", "mobile"],
      metaDescription: "Mobile gaming trends and popular games in 2024",
      published: true,
      author: "Admin",
      views: 950
    },
    {
      title: "Game Development: From Concept to Launch",
      slug: "game-development-concept-to-launch",
      content: "Game development is a complex process. Learn about the stages from initial concept to final launch, including planning, development, testing, and marketing.",
      excerpt: "Complete guide to game development process from concept to successful launch.",
      featuredImage: "https://picsum.photos/800/400?random=17",
      category: "Gaming",
      tags: ["game-development", "concept", "launch", "development"],
      metaDescription: "Game development guide from concept to successful launch",
      published: true,
      author: "Admin",
      views: 1100
    },
    {
      title: "Gaming Streaming: How to Build Your Audience",
      slug: "gaming-streaming-build-audience",
      content: "Gaming streaming has become a lucrative career. Learn how to build your audience, choose the right platform, and monetize your gaming content.",
      excerpt: "Guide to building a successful gaming streaming career and monetizing your content.",
      featuredImage: "https://picsum.photos/800/400?random=18",
      category: "Gaming",
      tags: ["streaming", "gaming", "audience", "monetization"],
      metaDescription: "Gaming streaming guide to build audience and monetize content",
      published: true,
      author: "Admin",
      views: 850
    }
  ],
  'business': [
    {
      title: "E-commerce Business Trends: What's New in 2024",
      slug: "ecommerce-business-trends-2024",
      content: "The e-commerce landscape is constantly changing. Explore the latest trends in online business, from AI-powered recommendations to sustainable shopping practices.",
      excerpt: "Latest e-commerce business trends and innovations shaping the online retail industry in 2024.",
      featuredImage: "https://picsum.photos/800/400?random=19",
      category: "Business",
      tags: ["ecommerce", "business", "trends", "online-retail"],
      metaDescription: "Latest e-commerce business trends and innovations for 2024",
      published: true,
      author: "Admin",
      views: 1560
    },
    {
      title: "Digital Marketing Strategies for E-commerce Success",
      slug: "digital-marketing-strategies-ecommerce-success",
      content: "Digital marketing is essential for e-commerce success. Discover effective strategies for driving traffic, increasing conversions, and building customer loyalty.",
      excerpt: "Effective digital marketing strategies to drive e-commerce success and increase conversions.",
      featuredImage: "https://picsum.photos/800/400?random=20",
      category: "Business",
      tags: ["digital-marketing", "ecommerce", "conversions", "traffic"],
      metaDescription: "Digital marketing strategies for e-commerce success and increased conversions",
      published: true,
      author: "Admin",
      views: 1680
    },
    {
      title: "Startup Funding: Complete Guide for Entrepreneurs",
      slug: "startup-funding-guide-entrepreneurs",
      content: "Securing funding is crucial for startup success. Learn about different funding options, from bootstrapping to venture capital, and how to pitch your business effectively.",
      excerpt: "Comprehensive guide to startup funding options and effective pitching strategies.",
      featuredImage: "https://picsum.photos/800/400?random=21",
      category: "Business",
      tags: ["startup", "funding", "entrepreneurship", "venture-capital"],
      metaDescription: "Startup funding guide for entrepreneurs seeking investment",
      published: true,
      author: "Admin",
      views: 1350
    },
    {
      title: "Remote Work Management: Leading Teams from Afar",
      slug: "remote-work-management-leading-teams",
      content: "Remote work has become the new normal. Learn effective strategies for managing remote teams, maintaining productivity, and building strong company culture.",
      excerpt: "Effective strategies for managing remote teams and maintaining productivity in distributed work environments.",
      featuredImage: "https://picsum.photos/800/400?random=22",
      category: "Business",
      tags: ["remote-work", "management", "productivity", "team-leadership"],
      metaDescription: "Remote work management strategies for leading distributed teams",
      published: true,
      author: "Admin",
      views: 1450
    },
    {
      title: "Business Analytics: Data-Driven Decision Making",
      slug: "business-analytics-data-driven-decisions",
      content: "Data analytics is transforming business decision-making. Learn how to collect, analyze, and use data to drive business growth and improve performance.",
      excerpt: "Guide to using business analytics for data-driven decision making and business growth.",
      featuredImage: "https://picsum.photos/800/400?random=23",
      category: "Business",
      tags: ["analytics", "data", "decision-making", "business-intelligence"],
      metaDescription: "Business analytics guide for data-driven decision making",
      published: true,
      author: "Admin",
      views: 1200
    },
    {
      title: "Customer Experience: Building Loyal Relationships",
      slug: "customer-experience-building-loyalty",
      content: "Customer experience is the key to business success. Learn how to create exceptional customer experiences that build loyalty and drive growth.",
      excerpt: "Strategies for building exceptional customer experiences that drive loyalty and business growth.",
      featuredImage: "https://picsum.photos/800/400?random=24",
      category: "Business",
      tags: ["customer-experience", "loyalty", "growth", "service"],
      metaDescription: "Customer experience strategies to build loyalty and drive growth",
      published: true,
      author: "Admin",
      views: 1100
    }
  ],
  'internet': [
    {
      title: "Internet Security: Protecting Your Digital Life",
      slug: "internet-security-protecting-digital-life",
      content: "In today's connected world, internet security is more important than ever. Learn about the best practices for protecting your personal information and staying safe online.",
      excerpt: "Essential internet security practices to protect your digital life and personal information online.",
      featuredImage: "https://picsum.photos/800/400?random=25",
      category: "Internet",
      tags: ["security", "internet", "privacy", "cybersecurity"],
      metaDescription: "Internet security guide to protect your digital life and personal information",
      published: true,
      author: "Admin",
      views: 980
    },
    {
      title: "Web Development: Modern Tools and Technologies",
      slug: "web-development-modern-tools-technologies",
      content: "Web development is constantly evolving. Explore the latest tools, frameworks, and technologies that are shaping the future of web development.",
      excerpt: "Latest web development tools and technologies for building modern websites and applications.",
      featuredImage: "https://picsum.photos/800/400?random=26",
      category: "Internet",
      tags: ["web-development", "tools", "frameworks", "technologies"],
      metaDescription: "Modern web development tools and technologies guide",
      published: true,
      author: "Admin",
      views: 1150
    },
    {
      title: "VPN Services: Choosing the Right Provider",
      slug: "vpn-services-choosing-right-provider",
      content: "VPN services are essential for online privacy and security. Learn how to choose the right VPN provider based on your needs and requirements.",
      excerpt: "Guide to choosing the right VPN service provider for your privacy and security needs.",
      featuredImage: "https://picsum.photos/800/400?random=27",
      category: "Internet",
      tags: ["vpn", "privacy", "security", "online-protection"],
      metaDescription: "VPN service selection guide for privacy and security",
      published: true,
      author: "Admin",
      views: 920
    },
    {
      title: "Internet of Things (IoT): Smart Home Setup",
      slug: "internet-of-things-iot-smart-home-setup",
      content: "The Internet of Things is transforming our homes. Learn how to set up a smart home system and integrate various IoT devices for convenience and efficiency.",
      excerpt: "Complete guide to setting up a smart home with IoT devices and automation.",
      featuredImage: "https://picsum.photos/800/400?random=28",
      category: "Internet",
      tags: ["iot", "smart-home", "automation", "connected-devices"],
      metaDescription: "IoT smart home setup guide for automation and convenience",
      published: true,
      author: "Admin",
      views: 1050
    },
    {
      title: "5G Technology: What You Need to Know",
      slug: "5g-technology-what-you-need-to-know",
      content: "5G technology is revolutionizing internet connectivity. Learn about the benefits, applications, and impact of 5G on various industries and daily life.",
      excerpt: "Comprehensive guide to 5G technology, its benefits, and impact on various industries.",
      featuredImage: "https://picsum.photos/800/400?random=29",
      category: "Internet",
      tags: ["5g", "technology", "connectivity", "wireless"],
      metaDescription: "5G technology guide: benefits, applications, and impact",
      published: true,
      author: "Admin",
      views: 1350
    },
    {
      title: "Web Hosting: Choosing the Right Platform",
      slug: "web-hosting-choosing-right-platform",
      content: "Choosing the right web hosting platform is crucial for website success. Compare different hosting options and find the best fit for your website needs.",
      excerpt: "Guide to choosing the right web hosting platform for your website requirements.",
      featuredImage: "https://picsum.photos/800/400?random=30",
      category: "Internet",
      tags: ["web-hosting", "platforms", "websites", "hosting"],
      metaDescription: "Web hosting platform selection guide for website needs",
      published: true,
      author: "Admin",
      views: 980
    }
  ],
  'news': [
    {
      title: "Latest Tech News: AI Breakthroughs and Innovations",
      slug: "latest-tech-news-ai-breakthroughs",
      content: "Stay updated with the latest technology news, including AI breakthroughs, new software releases, and innovative tech solutions that are shaping our future.",
      excerpt: "Latest technology news covering AI breakthroughs, software updates, and innovative tech solutions.",
      featuredImage: "https://picsum.photos/800/400?random=31",
      category: "News",
      tags: ["tech-news", "ai", "innovation", "technology"],
      metaDescription: "Latest technology news and AI breakthroughs shaping the future",
      published: true,
      author: "Admin",
      views: 3200
    },
    {
      title: "Breaking: Major Tech Company Acquisitions in 2024",
      slug: "breaking-major-tech-acquisitions-2024",
      content: "The tech industry is witnessing major acquisitions and mergers. Stay informed about the latest corporate moves and their impact on the technology landscape.",
      excerpt: "Latest news on major tech company acquisitions and their impact on the industry in 2024.",
      featuredImage: "https://picsum.photos/800/400?random=32",
      category: "News",
      tags: ["acquisitions", "tech-companies", "mergers", "industry-news"],
      metaDescription: "Breaking news on major tech company acquisitions in 2024",
      published: true,
      author: "Admin",
      views: 2800
    },
    {
      title: "Cybersecurity Threats: Latest Vulnerabilities and Solutions",
      slug: "cybersecurity-threats-latest-vulnerabilities-solutions",
      content: "Cybersecurity threats are evolving rapidly. Learn about the latest vulnerabilities, attack vectors, and security solutions to protect your digital assets.",
      excerpt: "Latest cybersecurity threats, vulnerabilities, and security solutions to protect digital assets.",
      featuredImage: "https://picsum.photos/800/400?random=33",
      category: "News",
      tags: ["cybersecurity", "threats", "vulnerabilities", "security"],
      metaDescription: "Latest cybersecurity threats and security solutions",
      published: true,
      author: "Admin",
      views: 2100
    },
    {
      title: "Software Updates: What's New in Popular Applications",
      slug: "software-updates-whats-new-popular-applications",
      content: "Stay updated with the latest software releases and updates from major tech companies. Learn about new features, improvements, and bug fixes.",
      excerpt: "Latest software updates and new features from popular applications and platforms.",
      featuredImage: "https://picsum.photos/800/400?random=34",
      category: "News",
      tags: ["software-updates", "applications", "features", "releases"],
      metaDescription: "Latest software updates and new features from popular applications",
      published: true,
      author: "Admin",
      views: 1800
    },
    {
      title: "Tech Industry Layoffs: Impact and Future Trends",
      slug: "tech-industry-layoffs-impact-future-trends",
      content: "The tech industry is experiencing significant layoffs. Understand the impact on the job market and what this means for the future of technology employment.",
      excerpt: "Analysis of tech industry layoffs and their impact on the job market and future employment trends.",
      featuredImage: "https://picsum.photos/800/400?random=35",
      category: "News",
      tags: ["layoffs", "tech-industry", "job-market", "employment"],
      metaDescription: "Tech industry layoffs analysis and future employment trends",
      published: true,
      author: "Admin",
      views: 2500
    },
    {
      title: "Digital Privacy Laws: New Regulations and Compliance",
      slug: "digital-privacy-laws-new-regulations-compliance",
      content: "Digital privacy laws are changing globally. Stay informed about new regulations, compliance requirements, and their impact on businesses and individuals.",
      excerpt: "Latest digital privacy laws, regulations, and compliance requirements for businesses and individuals.",
      featuredImage: "https://picsum.photos/800/400?random=36",
      category: "News",
      tags: ["privacy-laws", "regulations", "compliance", "digital-rights"],
      metaDescription: "Digital privacy laws and compliance requirements",
      published: true,
      author: "Admin",
      views: 1900
    }
  ],
  'global-tech-news': [
    {
      title: "Global Tech News: International Technology Updates",
      slug: "global-tech-news-international-updates",
      content: "Get the latest global technology news from around the world. From Silicon Valley to tech hubs in Asia and Europe, stay informed about international tech developments.",
      excerpt: "Latest global technology news and updates from international tech hubs and companies worldwide.",
      featuredImage: "https://picsum.photos/800/400?random=37",
      category: "Global Tech News",
      tags: ["global-tech", "international", "silicon-valley", "tech-hubs"],
      metaDescription: "Latest global technology news and international tech developments",
      published: true,
      author: "Admin",
      views: 1450
    },
    {
      title: "European Tech Scene: Startups and Innovation Hubs",
      slug: "european-tech-scene-startups-innovation-hubs",
      content: "Europe is emerging as a major tech hub. Explore the vibrant startup ecosystem, innovation centers, and technological breakthroughs happening across European countries.",
      excerpt: "Exploring the European tech scene, startups, and innovation hubs across the continent.",
      featuredImage: "https://picsum.photos/800/400?random=38",
      category: "Global Tech News",
      tags: ["european-tech", "startups", "innovation", "europe"],
      metaDescription: "European tech scene and startup ecosystem overview",
      published: true,
      author: "Admin",
      views: 1200
    },
    {
      title: "Asian Tech Giants: Innovation and Market Dominance",
      slug: "asian-tech-giants-innovation-market-dominance",
      content: "Asian tech companies are leading innovation in many sectors. Learn about the major players, their strategies, and their impact on the global technology market.",
      excerpt: "Analysis of Asian tech giants and their innovation strategies in the global market.",
      featuredImage: "https://picsum.photos/800/400?random=39",
      category: "Global Tech News",
      tags: ["asian-tech", "innovation", "market-dominance", "tech-giants"],
      metaDescription: "Asian tech giants and their global market impact",
      published: true,
      author: "Admin",
      views: 1350
    },
    {
      title: "African Tech Revolution: Digital Transformation",
      slug: "african-tech-revolution-digital-transformation",
      content: "Africa is experiencing a digital transformation. Discover how technology is revolutionizing various sectors across the continent and creating new opportunities.",
      excerpt: "Exploring Africa's tech revolution and digital transformation across various sectors.",
      featuredImage: "https://picsum.photos/800/400?random=40",
      category: "Global Tech News",
      tags: ["african-tech", "digital-transformation", "innovation", "africa"],
      metaDescription: "African tech revolution and digital transformation",
      published: true,
      author: "Admin",
      views: 1100
    },
    {
      title: "Latin American Tech: Emerging Markets and Opportunities",
      slug: "latin-american-tech-emerging-markets-opportunities",
      content: "Latin America is becoming a significant player in the global tech scene. Learn about the region's tech ecosystem, startups, and investment opportunities.",
      excerpt: "Overview of Latin American tech ecosystem, startups, and investment opportunities.",
      featuredImage: "https://picsum.photos/800/400?random=41",
      category: "Global Tech News",
      tags: ["latin-american-tech", "emerging-markets", "startups", "investment"],
      metaDescription: "Latin American tech ecosystem and investment opportunities",
      published: true,
      author: "Admin",
      views: 950
    },
    {
      title: "Middle East Tech: Innovation in the Desert",
      slug: "middle-east-tech-innovation-desert",
      content: "The Middle East is investing heavily in technology and innovation. Explore the region's tech initiatives, smart cities, and digital transformation projects.",
      excerpt: "Exploring Middle Eastern tech initiatives, smart cities, and digital transformation projects.",
      featuredImage: "https://picsum.photos/800/400?random=42",
      category: "Global Tech News",
      tags: ["middle-east-tech", "smart-cities", "innovation", "digital-transformation"],
      metaDescription: "Middle Eastern tech initiatives and smart city projects",
      published: true,
      author: "Admin",
      views: 1050
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Clear existing posts
    await Post.deleteMany({});
    
    // Insert posts for all categories
    let totalPosts = 0;
    for (const [categorySlug, posts] of Object.entries(categoryPosts)) {
      const createdPosts = await Post.insertMany(posts);
      totalPosts += createdPosts.length;
      console.log(`Created ${createdPosts.length} posts for category: ${categorySlug}`);
    }
    
    return NextResponse.json({
      success: true,
      message: `${totalPosts} category posts created successfully`,
      categories: Object.keys(categoryPosts),
      postsPerCategory: Object.fromEntries(
        Object.entries(categoryPosts).map(([category, posts]) => [category, posts.length])
      )
    });
  } catch (error) {
    console.error('Error seeding category posts:', error);
    return NextResponse.json(
      { error: 'Failed to seed category posts' },
      { status: 500 }
    );
  }
} 