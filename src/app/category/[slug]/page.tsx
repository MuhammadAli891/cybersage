import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import CategoryPageClient from './CategoryPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await dbConnect();
    
    // Await params before using
    const resolvedParams = await params;
    
    // Map category slugs to proper category names
    const categoryMapping: { [key: string]: string } = {
      'tech': 'Tech',
      'social-media': 'Social Media',
      'gaming': 'Gaming',
      'business': 'Business',
      'internet': 'Internet',
      'news': 'News',
      'global-tech-news': 'Global Tech News'
    };

    const categoryName = categoryMapping[resolvedParams.slug] || resolvedParams.slug;
    
    // Get category posts count
    const postsCount = await Post.countDocuments({ 
      category: categoryName, 
      published: true 
    });

    const title = `${categoryName} - Latest Articles | CyberSage`;
    const description = getCategoryDescription(categoryName);
    const keywords = `${categoryName.toLowerCase()}, tech, articles, news, cyberSage`;

    const metadata: Metadata = {
      title: title,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        type: 'website',
        url: `https://cybersage.com/category/${resolvedParams.slug}`,
        siteName: 'CyberSage',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
      },
    };

    return metadata;
  } catch (error) {
    console.error('Error generating category metadata:', error);
    return {
      title: 'Category - CyberSage',
      description: 'Browse articles by category on CyberSage',
    };
  }
}

const getCategoryDescription = (category: string) => {
  const descriptions: { [key: string]: string } = {
    'Tech': 'Latest technology insights, tutorials, and innovations in the tech world. Stay updated with cutting-edge developments and practical guides.',
    'Social Media': 'Social media strategies, platform updates, and digital marketing tips to boost your online presence and engagement.',
    'Gaming': 'Gaming industry news, reviews, and insights for both casual and professional gamers. Discover the latest in gaming technology.',
    'Business': 'Business strategies, entrepreneurship tips, and industry insights to help you grow your business and career.',
    'Internet': 'Internet trends, web development, and digital tools to enhance your online experience and productivity.',
    'News': 'Breaking technology news, industry updates, and important developments in the digital world.',
    'Global Tech News': 'International technology news and updates from around the world, covering global tech trends and innovations.'
  };
  
  return descriptions[category] || `Latest posts in ${category} category.`;
};

export default async function CategoryPage({ params }: Props) {
  try {
    await dbConnect();
    
    // Await params before using
    const resolvedParams = await params;
    
    // Map category slugs to proper category names
    const categoryMapping: { [key: string]: string } = {
      'tech': 'Tech',
      'social-media': 'Social Media',
      'gaming': 'Gaming',
      'business': 'Business',
      'internet': 'Internet',
      'news': 'News',
      'global-tech-news': 'Global Tech News'
    };

    const categoryName = categoryMapping[resolvedParams.slug] || resolvedParams.slug;
    
    // Optimize: Run queries in parallel
    const [posts, totalPosts] = await Promise.all([
      Post.find({ 
        category: categoryName, 
        published: true 
      }).sort({ createdAt: -1 }).limit(6).lean(),
      
      Post.countDocuments({ 
        category: categoryName, 
        published: true 
      })
    ]);

    const categoryData = {
      name: categoryName,
      description: getCategoryDescription(categoryName),
      totalPosts: totalPosts
    };

    return (
      <CategoryPageClient 
        posts={JSON.parse(JSON.stringify(posts))}
        categoryData={categoryData}
        categorySlug={resolvedParams.slug}
      />
    );
  } catch (error) {
    console.error('Error fetching category data:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-red-400 text-6xl mb-6"></i>
            <h3 className="text-white text-2xl font-semibold mb-4">Error</h3>
            <p className="text-cyan-100 mb-6">Something went wrong while loading the category.</p>
          </div>
        </div>
      </div>
    );
  }
} 