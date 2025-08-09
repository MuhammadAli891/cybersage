'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo, memo } from 'react';

// Memoized star component
const Star = memo(({ star }: { star: {id: number, left: string, top: string, delay: string, duration: string, opacity: number} }) => (
  <div
    className="star absolute w-1 h-1 bg-white rounded-full animate-star-float"
    style={{
      left: star.left,
      top: star.top,
      animationDelay: star.delay,
      animationDuration: star.duration,
      opacity: star.opacity,
      zIndex: 1
    }}
  />
));

Star.displayName = 'Star';

// Memoized post card component
const PostCard = memo(({ post }: { post: {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  category: string;
  author: string;
  createdAt: string;
} }) => (
  <Link href={`/posts/${post.slug}`} className="group">
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-300/30 hover:border-cyan-300/50 transition-all duration-300 group-hover:scale-105">
      <Image
        src={post.featuredImage || "https://picsum.photos/400/200?random=1"}
        alt={post.title}
        width={400}
        height={200}
        className="w-full h-32 object-cover"
        priority={false}
        loading="lazy"
      />
      <div className="p-4">
        <span className="bg-cyan-600 text-white text-xs font-semibold rounded-full px-2 py-1 mb-2 inline-block">{post.category}</span>
        <div className="flex items-center text-cyan-200 text-xs mb-2">
          <i className="far fa-calendar-alt mr-1"></i>
          {new Date(post.createdAt).toLocaleDateString()}
        </div>
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-3 group-hover:text-cyan-300 transition-colors">{post.title}</h3>
        <div className="flex items-center text-cyan-200 text-xs">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center mr-2">
            <i className="fas fa-user text-xs"></i>
          </div>
          {post.author}
        </div>
      </div>
    </div>
  </Link>
));

PostCard.displayName = 'PostCard';

interface HomePageClientProps {
  initialPosts: Array<{
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    category: string;
    author: string;
    createdAt: string;
  }>;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export default function HomePageClient({ initialPosts, maintenanceMode, maintenanceMessage }: HomePageClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [maintenanceModeState, setMaintenanceModeState] = useState(maintenanceMode);
  const [maintenanceMessageState, setMaintenanceMessageState] = useState(maintenanceMessage);
  const [stars, setStars] = useState<Array<{id: number, left: string, top: string, delay: string, duration: string, opacity: number}>>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized stars generation
  const generatedStars = useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      left: `${(i * 7.3) % 100}%`,
      top: `${(i * 3.7 + 10) % 80}%`,
      delay: `${(i * 0.2) % 10}s`,
      duration: `${(i * 0.3 + 10) % 10 + 10}s`,
      opacity: ((i * 0.1) % 0.8) + 0.2
    }));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      checkMaintenanceMode();
      setStars(generatedStars);
      
      // Auto-refresh posts every 30 seconds
      const interval = setInterval(() => {
        fetchPosts(true);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [mounted, generatedStars]);

  const forceRefresh = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setRefreshing(true);
      await fetch('/api/cache/clear', { method: 'POST' });
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchPosts(true);
    } catch (error) {
      console.error('Error during force refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const checkMaintenanceMode = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      setMaintenanceModeState(data.maintenanceMode);
      setMaintenanceMessageState(data.maintenanceMessage);
    } catch (error) {
      console.error('Error checking maintenance mode:', error);
    }
  };

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      
      const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
      const random = typeof window !== 'undefined' ? Math.random() : 0;
      const url = `/api/posts/homepage?limit=8&t=${timestamp}&r=${random}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Cache-Bust': timestamp.toString()
        },
        cache: 'no-store'
      });
      
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Loading skeleton
  const LoadingSkeleton = useMemo(() => (
    [...Array(8)].map((_, i) => (
      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-300/30">
        <div className="w-full h-32 bg-white/10 animate-pulse"></div>
        <div className="p-4">
          <div className="bg-cyan-600/20 text-white text-xs font-semibold rounded-full px-2 py-1 mb-2 inline-block w-16 h-6 animate-pulse"></div>
          <div className="flex items-center text-cyan-200 text-xs mb-2">
            <div className="w-3 h-3 bg-white/20 rounded animate-pulse mr-1"></div>
            <div className="w-20 h-3 bg-white/10 rounded animate-pulse"></div>
          </div>
          <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse mb-2 w-3/4"></div>
          <div className="h-4 bg-white/10 rounded animate-pulse mb-4 w-1/2"></div>
          <div className="flex items-center text-cyan-200 text-xs">
            <div className="w-6 h-6 bg-white/20 rounded-full animate-pulse mr-2"></div>
            <div className="w-16 h-3 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    ))
  ), []);

  // Show maintenance mode if enabled
  if (mounted && maintenanceModeState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-300/30">
            <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-tools text-white text-3xl"></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Under Maintenance</h1>
            <p className="text-cyan-100 text-lg mb-6">
              {maintenanceMessageState || 'We are currently performing maintenance. Please check back soon!'}
            </p>
            <div className="flex items-center justify-center space-x-4 text-cyan-200">
              <i className="fas fa-clock"></i>
              <span>We'll be back shortly</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top gradient bar with social icons */}
      <div className="tech-gradient">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-center space-x-3">
          <a aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a aria-label="Pinterest" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-pinterest-p"></i>
          </a>
          <a aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a aria-label="LinkedIn" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-youtube"></i>
          </a>
          <a aria-label="Telegram" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center text-sm hover:bg-white/30 transition-all duration-300" href="#">
            <i className="fab fa-telegram-plane"></i>
          </a>
        </div>
      </div>

      {/* Glassmorphism Navbar */}
      <nav className="glass-nav sticky top-0 z-50 px-4 sm:px-6 lg:px-8" style={{ zIndex: 100 }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-extrabold select-none hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 tech-gradient rounded-lg flex items-center justify-center mr-2">
                <i className="fas fa-brain text-white text-sm"></i>
              </div>
              <span className="text-cyan-300 text-xl font-extrabold">Cyber</span>
              <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent text-xl font-extrabold">Sage</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8 text-sm font-semibold text-white">
            <li><Link href="/category/news" className="hover:text-cyan-300 transition-colors duration-300">News</Link></li>
            <li><Link href="/category/global-tech-news" className="hover:text-cyan-300 transition-colors duration-300">Global Tech News</Link></li>
            <li><Link href="/category/internet" className="hover:text-cyan-300 transition-colors duration-300">Internet</Link></li>
            <li><Link href="/category/tech" className="hover:text-cyan-300 transition-colors duration-300">Tech</Link></li>
            <li><Link href="/category/business" className="hover:text-cyan-300 transition-colors duration-300">Business</Link></li>
            <li><Link href="/category/gaming" className="hover:text-cyan-300 transition-colors duration-300">Gaming</Link></li>
            <li><Link href="/category/social-media" className="hover:text-cyan-300 transition-colors duration-300">Social Media</Link></li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-white text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div 
              className="absolute inset-0 bg-black"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <div className="absolute right-0 top-0 h-full w-80 bg-gray-900 shadow-2xl border-l border-cyan-300/50 transform transition-transform duration-300 ease-in-out">
              <div className="bg-gray-800 p-6 border-b border-cyan-300/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <i className="fas fa-bars text-white text-sm"></i>
                    </div>
                    <span className="text-white font-bold text-lg">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <i className="fas fa-times text-white"></i>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 px-2">
                  Categories
                </div>
                
                {[
                  { href: "/category/news", icon: "fa-newspaper", title: "News", desc: "Latest updates" },
                  { href: "/category/global-tech-news", icon: "fa-globe", title: "Global Tech News", desc: "Worldwide tech" },
                  { href: "/category/internet", icon: "fa-wifi", title: "Internet", desc: "Web & connectivity" },
                  { href: "/category/tech", icon: "fa-microchip", title: "Tech", desc: "Technology insights" },
                  { href: "/category/business", icon: "fa-briefcase", title: "Business", desc: "Business strategies" },
                  { href: "/category/gaming", icon: "fa-gamepad", title: "Gaming", desc: "Gaming industry" },
                  { href: "/category/social-media", icon: "fa-share-alt", title: "Social Media", desc: "Social platforms" }
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-transparent hover:border-cyan-300/50 transition-all duration-300 group"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="w-10 h-10 tech-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className={`fas ${item.icon} text-white text-sm`}></i>
                    </div>
                    <div>
                      <div className="text-white font-semibold group-hover:text-cyan-300 transition-colors">{item.title}</div>
                      <div className="text-cyan-200 text-xs">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
          {typeof window !== 'undefined' && stars.map((star) => (
            <Star key={star.id} star={star} />
          ))}
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight animate-float">
              Find the Answers Just When you<br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-float-delayed">
                Think of the Questions
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-cyan-100 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Looking for answers for your endless mind-boggling Tech and Social Media queries and curiosities, count on Getassist.
            </p>
            
            {/* Search input */}
            <form className="max-w-xl mx-auto flex items-center bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border-2 border-cyan-300/50 mb-8 relative overflow-hidden group animate-fade-in-up-delayed">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-transparent to-cyan-300/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <input 
                className="flex-grow text-white text-sm focus:outline-none rounded-full px-4 py-2 bg-transparent placeholder-cyan-200 relative z-10" 
                placeholder="Search Engine" 
                type="search"
              />
              <button className="text-cyan-300 hover:text-cyan-100 focus:outline-none relative z-10 transition-colors duration-300" type="submit">
                <i className="fas fa-search"></i>
              </button>
            </form>
            
            {/* Social media buttons */}
            <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto animate-fade-in-up-delayed-2">
              {['Facebook', 'Instagram', 'LinkedIn', 'Snapchat', 'TikTok', 'Twitter', 'YouTube'].map((platform) => (
                <button key={platform} className="bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50 text-white text-xs font-semibold rounded-full px-4 py-2 border border-cyan-300/30 transition-all duration-300 hover:scale-105">
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-cyan-300/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "fa-globe", number: "4785+", title: "Global Reach", desc: "Users worldwide" },
                { icon: "fa-users", number: "2158+", title: "User Engagement", desc: "Active interactions" },
                { icon: "fa-chart-line", number: "359+", title: "Daily Activity", desc: "Questions answered" }
              ].map((stat) => (
                <div key={stat.title} className="text-center group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="w-16 h-16 tech-gradient rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <i className={`fas ${stat.icon} text-white text-xl`}></i>
                  </div>
                  <h2 className="text-3xl font-extrabold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors duration-300">{stat.number}</h2>
                  <p className="text-white font-semibold group-hover:text-cyan-100 transition-colors duration-300">{stat.title}</p>
                  <p className="text-cyan-200 text-sm group-hover:text-cyan-300 transition-colors duration-300">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-cyan-300 text-sm mb-2">Our Story</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Why Choose Us?</h2>
            <p className="text-cyan-100 text-lg max-w-3xl mx-auto">
              Your search for endless searching and scrolling using a bunch of links will end here!<br />
              Getassist is designed to provide you with rapid, reliable and right results in just minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "fa-check-circle", title: "Fact-Checked Answers", desc: "Get straight-to-the-point answers integrated with facts and stats." },
              { icon: "fa-bolt", title: "Rapid Results", desc: "Getassist delivers the result in lightning-fast speed." },
              { icon: "fa-globe", title: "Wide Topic Coverage", desc: "From tech, Social Media, to business and IoT, you will get everything under one roof." },
              { icon: "fa-mobile-alt", title: "User-Friendly Interface", desc: "You can find answers effortlessly with a clean and intuitive designed interface." }
            ].map((feature) => (
              <div key={feature.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-cyan-300/30 text-center group hover:transform hover:scale-105 transition-all duration-300 cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <i className={`fas ${feature.icon} text-cyan-600 text-xl`}></i>
                </div>
                <h3 className="text-white font-semibold mb-3 group-hover:text-cyan-200 transition-colors duration-300">{feature.title}</h3>
                <p className="text-cyan-200 text-sm mb-4 group-hover:text-cyan-300 transition-colors duration-300">{feature.desc}</p>
                <button className="tech-gradient text-white px-4 py-2 rounded-full text-sm font-semibold group-hover:scale-105 transition-transform duration-300">Read More</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Questions Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-cyan-300 text-sm mb-2">Our Forum</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Trending Questions</h2>
            <button className="tech-gradient text-white px-8 py-3 rounded-full font-semibold">
              Explore Trending Questions
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Free Tools to Convert YouTube to MP3", category: "Tech Tools" },
              { title: "How to remove the TikTok watermark from the video", category: "Social Media" },
              { title: "What does the red heart mean on snapchat?", category: "Social Media" },
              { title: "what does yellow heart mean on snapchat", category: "Social Media" },
              { title: "How to block someone on YouTube from seeing your videos?", category: "YouTube" },
              { title: "Best AI tools for content creation in 2024", category: "AI & Tech" }
            ].map((question, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-cyan-300/30">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold text-lg flex-1 pr-3">{question.title}</h3>
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-question text-white text-sm"></i>
                  </div>
                </div>
                <p className="text-cyan-200 text-sm mb-3">{question.category}</p>
                <div className="flex justify-end">
                  <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
                    <i className="fas fa-external-link-alt text-white text-sm"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <p className="text-cyan-300 text-sm">Our Blogs</p>
              <button
                onClick={forceRefresh}
                disabled={refreshing}
                className="text-cyan-300 hover:text-cyan-200 transition-colors disabled:opacity-50"
                title="Force refresh posts (clears cache)"
              >
                <i className={`fas ${refreshing ? 'fa-spinner fa-spin' : 'fa-sync-alt'} text-sm`}></i>
              </button>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Explore What&apos;s New</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              LoadingSkeleton
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <i className="fas fa-newspaper text-cyan-400 text-6xl mb-6"></i>
                <h3 className="text-white text-2xl font-semibold mb-4">No posts available</h3>
                <p className="text-cyan-100 mb-6">No posts are set to show on homepage yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-cyan-300 text-sm mb-2">Questions and Answered</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-cyan-100 text-lg mb-8">
                Common questions about technology, business, internet, and social media answered to help you navigate today&apos;s digital landscape easily.
              </p>
              <button className="tech-gradient text-white px-8 py-3 rounded-full font-semibold">
                Explore More Questions
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                "How can I stay updated on the emerging tech innovations?",
                "What kind of questions can I ask?",
                "Do I need to create an account to search for my queries?",
                "How accurate are the answers provided?"
              ].map((question, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-cyan-300/30 flex items-center justify-between">
                  <span className="text-white font-medium">{index + 1}. {question}</span>
                  <i className="fas fa-chevron-down text-cyan-300"></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="glass-nav py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-white text-sm">
            {['About Us', 'Contact Us', 'Tech Trends', 'Cyber Security', 'Windows', 'Fintech', 'Browsing', 'Cloud Storage', 'Buyer Guides', 'VPN', 'Smartphones'].map((link) => (
              <Link key={link} className="hover:text-cyan-300 transition-colors duration-300" href="#">{link}</Link>
            ))}
          </nav>
          <p className="mb-4 text-white text-lg font-semibold">Community Forum</p>
          <p className="mb-2 text-white">All content © copyright <strong className="text-cyan-300">cybersage</strong></p>
          <p className="mb-2 text-white text-sm">
            All Rights Reserved. For more information on this site, please read our Terms of Use, Privacy Policy
          </p>
          <p className="mb-6 text-white text-sm">Do Not Sell My Personal Information</p>
          <div className="flex items-center justify-center space-x-2 text-cyan-300 font-extrabold text-xl cursor-pointer select-none">
            <div className="w-8 h-8 tech-gradient rounded-lg flex items-center justify-center mr-2">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <span className="text-xl font-extrabold">Cyber</span>
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent text-xl font-extrabold">Sage</span>
          </div>
        </div>
      </footer>
    </div>
  );
} 