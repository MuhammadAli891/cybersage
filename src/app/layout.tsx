import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CyberSage - Find Answers to Your Tech Questions',
  description: 'Looking for answers for your endless mind-boggling Tech and Social Media queries and curiosities, count on CyberSage.',
  keywords: 'tech, social media, gaming, business, internet, news, cyberSage',
  authors: [{ name: 'CyberSage Team' }],
  openGraph: {
    title: 'CyberSage - Find Answers to Your Tech Questions',
    description: 'Looking for answers for your endless mind-boggling Tech and Social Media queries and curiosities, count on CyberSage.',
    type: 'website',
    url: 'https://cybersage.com',
    siteName: 'CyberSage',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberSage - Find Answers to Your Tech Questions',
    description: 'Looking for answers for your endless mind-boggling Tech and Social Media queries and curiosities, count on CyberSage.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
