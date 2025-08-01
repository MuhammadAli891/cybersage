import Link from 'next/link';

export default function HomePageBackup() {
  return (
    <div className="bg-gray-50 text-gray-700">
      {/* Top red bar with social icons */}
      <div className="bg-red-600">
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-center space-x-2">
          <a aria-label="Facebook" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a aria-label="Twitter" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-twitter"></i>
          </a>
          <a aria-label="Pinterest" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-pinterest-p"></i>
          </a>
          <a aria-label="Instagram" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-instagram"></i>
          </a>
          <a aria-label="LinkedIn" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a aria-label="YouTube" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-youtube"></i>
          </a>
          <a aria-label="Telegram" className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs" href="#">
            <i className="fab fa-telegram-plane"></i>
          </a>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-black text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center space-x-1 text-lg font-extrabold select-none">
            <span className="text-red-600">Get</span>
            <span className="bg-red-600 text-white px-1 rounded-sm">Assist.net</span>
          </div>
          <ul className="hidden md:flex space-x-6 text-xs font-semibold">
            <li><Link href="#" className="hover:underline">News</Link></li>
            <li><Link href="#" className="hover:underline">Global Tech News</Link></li>
            <li><Link href="#" className="hover:underline">Internet</Link></li>
            <li><Link href="#" className="hover:underline">Tech</Link></li>
            <li><Link href="#" className="hover:underline">Business</Link></li>
            <li><Link href="#" className="hover:underline">Gaming</Link></li>
            <li><Link href="#" className="hover:underline">Social Media</Link></li>
          </ul>
        </div>
      </nav>

      {/* Hero section with black background and subtle pattern */}
      <section aria-label="Hero section" className="relative bg-black pt-20 pb-16 px-4 text-center overflow-hidden">
        <img alt="Subtle black tech background pattern with circuit lines" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none select-none" height="400" src="https://storage.googleapis.com/a1aa/image/c1229b9e-1ddd-4e5f-5076-817215833017.jpg" width="1920"/>
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Find the Answers Just When you Think of the Questions
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-3xl mx-auto">
            Looking for answers for your endless mind-boggling Tech and Social Media queries and curiosities, count on Getassist.
          </p>
          {/* Search input */}
          <form aria-label="Search Engine" className="max-w-xl mx-auto flex items-center bg-white rounded-full px-4 py-2 shadow-md" role="search">
            <input aria-label="Search Engine" className="flex-grow text-gray-700 text-sm focus:outline-none rounded-full px-4 py-2" placeholder="Search Engine" type="search"/>
            <button aria-label="Search" className="text-gray-700 hover:text-gray-900 focus:outline-none" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
          {/* Social media buttons below search */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">Facebook</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">Instagram</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">LinkedIn</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">Snapchat</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">TikTok</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">Twitter</button>
            <button className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-full px-4 py-2" type="button">YouTube</button>
          </div>
        </div>
        {/* Bottom wave shape */}
        <svg aria-hidden="true" className="absolute bottom-0 left-0 w-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 0V80H0Z" fill="#1a1a1a" fillOpacity="0.9"></path>
        </svg>
      </section>

      {/* Stats section */}
      <section className="bg-white text-black py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-center items-center sm:items-stretch gap-6 sm:gap-0">
          <div className="flex-1 border-r border-gray-300 text-center sm:text-left sm:pr-10">
            <h2 className="text-xl font-extrabold mb-1">4785+</h2>
            <p className="text-sm text-gray-600">Global Reach</p>
          </div>
          <div className="flex-1 border-r border-gray-300 text-center sm:text-left sm:px-10">
            <h2 className="text-xl font-extrabold mb-1">2158+</h2>
            <p className="text-sm text-gray-600">User Engagement</p>
          </div>
          <div className="flex-1 text-center sm:text-left sm:pl-10">
            <h2 className="text-xl font-extrabold mb-1">359+</h2>
            <p className="text-sm text-gray-600">Daily Activity</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 max-w-md mx-auto md:mx-0">
            <p className="text-xs text-red-600 border-l-2 border-red-600 pl-2 mb-2 font-semibold">Our Story</p>
            <h2 className="text-black text-2xl font-extrabold mb-3">Why Choose Us?</h2>
            <p className="text-gray-600 text-sm mb-3">
              Your search for endless searching and scrolling using a bunch of links will end here! Getassist is designed to provide you with rapid, reliable and right results in just minutes. Powered with advanced technologies and innovations, the platform covers a broad range of niches and trending topics to help you gather knowledge on literally everything.
            </p>
            <p className="text-gray-600 text-sm">
              From everyday tech issues to widening your knowledge in different niches or spectra, Getassist brings solutions at your fingertips.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto md:mx-0">
            {/* Card 1 */}
            <div className="bg-white rounded-md shadow p-5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-file-alt text-red-600 text-lg"></i>
              </div>
              <h3 className="font-semibold text-black text-sm mb-1">Fact-Checked Answers</h3>
              <p className="text-gray-600 text-xs mb-4">
                Get straight-to-the-point answers integrated with facts and stats.
              </p>
              <button className="bg-red-600 text-white text-xs px-4 py-1 rounded-full hover:bg-red-700 transition">
                Read More
              </button>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-md shadow p-5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-file-invoice text-red-600 text-lg"></i>
              </div>
              <h3 className="font-semibold text-black text-sm mb-1">Rapid Results</h3>
              <p className="text-gray-600 text-xs mb-4">
                Getassist delivers the result in lightning-fast speed.
              </p>
              <button className="bg-red-600 text-white text-xs px-4 py-1 rounded-full hover:bg-red-700 transition">
                Read More
              </button>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-md shadow p-5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-exchange-alt text-red-600 text-lg"></i>
              </div>
              <h3 className="font-semibold text-black text-sm mb-1">Wide Topic Coverage</h3>
              <p className="text-gray-600 text-xs mb-4">
                From tech, Social Media, to business and IoT, you will get everything under one roof.
              </p>
              <button className="bg-red-600 text-white text-xs px-4 py-1 rounded-full hover:bg-red-700 transition">
                Read More
              </button>
            </div>
            {/* Card 4 */}
            <div className="bg-white rounded-md shadow p-5">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-clone text-red-600 text-lg"></i>
              </div>
              <h3 className="font-semibold text-black text-sm mb-1">User-Friendly Interface</h3>
              <p className="text-gray-600 text-xs mb-4">
                You can find answers effortlessly with a clean and intuitive designed interface.
              </p>
              <button className="bg-red-600 text-white text-xs px-4 py-1 rounded-full hover:bg-red-700 transition">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <nav className="mb-6 flex flex-wrap justify-center gap-4 text-gray-400 text-xs">
            <Link className="hover:text-white" href="#">About Us</Link>
            <Link className="hover:text-white" href="#">Contact Us</Link>
            <Link className="hover:text-white" href="#">Tech Trends</Link>
            <Link className="hover:text-white" href="#">Cyber Security</Link>
            <Link className="hover:text-white" href="#">Windows</Link>
            <Link className="hover:text-white" href="#">Fintech</Link>
            <Link className="hover:text-white" href="#">Browsing</Link>
            <Link className="hover:text-white" href="#">Cloud Storage</Link>
            <Link className="hover:text-white" href="#">Buyer Guides</Link>
            <Link className="hover:text-white" href="#">VPN</Link>
            <Link className="hover:text-white" href="#">Smartphones</Link>
          </nav>
          <p className="mb-4">Community Forum</p>
          <p className="mb-1 text-gray-400">All content © copyright <strong>getassist</strong></p>
          <p className="mb-1 text-gray-400 font-extrabold text-[9px]">
            All Rights Reserved. For more information on this site, please read our Terms of Use, Privacy Policy
          </p>
          <p className="mb-1 text-gray-400 text-[9px]">Do Not Sell My Personal Information</p>
          <p className="mb-1 text-red-600 font-extrabold text-[10px] cursor-pointer select-none">
            Get <span className="bg-red-600 text-white px-1 rounded-sm">Assist.net</span>
          </p>
        </div>
      </footer>
    </div>
  );
} 