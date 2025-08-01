import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import SinglePostPage from './SinglePostPage';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const post = await Post.findOne({ slug: resolvedParams.slug, published: true });
    
    if (!post) {
      return {
        title: 'Post Not Found - CyberSage',
        description: 'The post you are looking for does not exist.',
      };
    }

    // Use SEO fields if available, otherwise fallback to defaults
    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || 'Read this article on CyberSage';
    const keywords = post.metaKeywords || '';
    const canonicalUrl = post.canonicalUrl || `https://cybersage.com/posts/${post.slug}`;

    const metadata: Metadata = {
      title: `${title} - CyberSage`,
      description: description,
      keywords: keywords,
      authors: [{ name: post.author }],
      openGraph: {
        title: title,
        description: description,
        type: 'article',
        url: canonicalUrl,
        images: [
          {
            url: post.featuredImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        siteName: 'CyberSage',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
        images: [post.featuredImage],
      },
      robots: {
        index: post.noIndex ? false : true,
        follow: post.noIndex ? false : true,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };

    return metadata;
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Post - CyberSage',
      description: 'Read articles on CyberSage',
    };
  }
}

export default async function PostPage({ params }: Props) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const post = await Post.findOne({ slug: resolvedParams.slug, published: true });
    
    if (!post) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <i className="fas fa-file-alt text-cyan-400 text-6xl mb-6"></i>
              <h3 className="text-white text-2xl font-semibold mb-4">Post not found</h3>
              <p className="text-cyan-100 mb-6">The post you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
      );
    }

    return <SinglePostPage post={JSON.parse(JSON.stringify(post))} />;
  } catch (error) {
    console.error('Error fetching post:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-red-400 text-6xl mb-6"></i>
            <h3 className="text-white text-2xl font-semibold mb-4">Error</h3>
            <p className="text-cyan-100 mb-6">Something went wrong while loading the post.</p>
          </div>
        </div>
      </div>
    );
  }
} 