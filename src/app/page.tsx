import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import Settings from '@/models/Settings';
import HomePageClient from './HomePageClient';

export async function generateMetadata(): Promise<Metadata> {
  try {
    await dbConnect();
    const settings = await Settings.findOne();
    
    return {
      title: 'CyberSage - Tech & Social Media Blog',
      description: 'Find answers to your tech and social media questions. Getassist provides rapid, reliable results for your digital queries.',
      keywords: 'tech, social media, blog, questions, answers, digital',
      openGraph: {
        title: 'CyberSage - Tech & Social Media Blog',
        description: 'Find answers to your tech and social media questions',
        type: 'website',
        url: 'https://cybersage.com',
        siteName: 'CyberSage',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'CyberSage - Tech & Social Media Blog',
        description: 'Find answers to your tech and social media questions',
      },
    };
  } catch (error) {
    return {
      title: 'CyberSage - Tech & Social Media Blog',
      description: 'Find answers to your tech and social media questions',
    };
  }
}

export default async function HomePage() {
  try {
    await dbConnect();
    
    // Fetch posts for homepage
    const posts = await Post.find({ 
      published: true, 
      showOnHomepage: true 
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();
    
    // Fetch maintenance settings
    const settings = await Settings.findOne();
    const maintenanceMode = settings?.maintenanceMode || false;
    const maintenanceMessage = settings?.maintenanceMessage || '';

    return (
      <HomePageClient 
        initialPosts={JSON.parse(JSON.stringify(posts))}
        maintenanceMode={maintenanceMode}
        maintenanceMessage={maintenanceMessage}
      />
    );
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    // Return fallback with empty data
    return (
      <HomePageClient 
        initialPosts={[]}
        maintenanceMode={false}
        maintenanceMessage=""
      />
    );
  }
}
