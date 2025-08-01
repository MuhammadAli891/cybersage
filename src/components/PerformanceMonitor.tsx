'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  totalBlockingTime: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      
      const measurePerformance = () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');
        
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        const lcp = performance.getEntriesByType('largest-contentful-paint')[0];
        
        const metrics: PerformanceMetrics = {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          firstContentfulPaint: fcp ? fcp.startTime : 0,
          largestContentfulPaint: lcp ? lcp.startTime : 0,
          totalBlockingTime: 0, // Would need more complex calculation
        };
        
        setMetrics(metrics);
      };

      // Wait for page to load completely
      if (document.readyState === 'complete') {
        measurePerformance();
      } else {
        window.addEventListener('load', measurePerformance);
      }

      return () => window.removeEventListener('load', measurePerformance);
    }
  }, []);

  if (!isVisible || !metrics) return null;

  const getPerformanceColor = (value: number, threshold: number) => {
    if (value <= threshold) return 'text-green-500';
    if (value <= threshold * 1.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2 text-cyan-300">Performance Monitor</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Load Time:</span>
          <span className={getPerformanceColor(metrics.loadTime, 1000)}>
            {metrics.loadTime.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>DOM Ready:</span>
          <span className={getPerformanceColor(metrics.domContentLoaded, 500)}>
            {metrics.domContentLoaded.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>First Paint:</span>
          <span className={getPerformanceColor(metrics.firstContentfulPaint, 1000)}>
            {metrics.firstContentfulPaint.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Largest Paint:</span>
          <span className={getPerformanceColor(metrics.largestContentfulPaint, 2500)}>
            {metrics.largestContentfulPaint.toFixed(0)}ms
          </span>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 text-gray-400 hover:text-white"
      >
        ×
      </button>
    </div>
  );
} 