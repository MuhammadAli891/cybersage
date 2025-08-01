const puppeteer = require('puppeteer');

async function checkPerformance() {
  console.log('🚀 Starting Performance Check...\n');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Enable performance monitoring
  await page.setCacheEnabled(false);
  
  console.log('📊 Collecting performance metrics...');
  
  // Navigate to the homepage
  const startTime = Date.now();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const loadTime = Date.now() - startTime;
  
  // Get performance metrics
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    
    return {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: 0,
      totalBlockingTime: 0,
      cumulativeLayoutShift: 0
    };
  });
  
  // Get resource sizes
  const resources = await page.evaluate(() => {
    const entries = performance.getEntriesByType('resource');
    const totalSize = entries.reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    const jsSize = entries.filter(entry => entry.name.includes('.js')).reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    const cssSize = entries.filter(entry => entry.name.includes('.css')).reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    const imageSize = entries.filter(entry => entry.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)).reduce((sum, entry) => sum + (entry.transferSize || 0), 0);
    
    return {
      totalSize,
      jsSize,
      cssSize,
      imageSize,
      resourceCount: entries.length
    };
  });
  
  console.log('✅ Performance Metrics:');
  console.log(`⏱️  Total Load Time: ${loadTime}ms`);
  console.log(`📄 DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
  console.log(`🎨 First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
  console.log(`🎯 First Contentful Paint: ${metrics.firstContentfulPaint.toFixed(2)}ms`);
  console.log(`📦 Total Resources: ${resources.resourceCount}`);
  console.log(`💾 Total Size: ${(resources.totalSize / 1024).toFixed(2)}KB`);
  console.log(`📜 JavaScript: ${(resources.jsSize / 1024).toFixed(2)}KB`);
  console.log(`🎨 CSS: ${(resources.cssSize / 1024).toFixed(2)}KB`);
  console.log(`🖼️  Images: ${(resources.imageSize / 1024).toFixed(2)}KB`);
  
  // Performance grades
  const grades = {
    loadTime: loadTime < 2000 ? '🟢 Excellent' : loadTime < 4000 ? '🟡 Good' : '🔴 Needs Improvement',
    fcp: metrics.firstContentfulPaint < 1000 ? '🟢 Excellent' : metrics.firstContentfulPaint < 2000 ? '🟡 Good' : '🔴 Needs Improvement',
    size: resources.totalSize < 500000 ? '🟢 Excellent' : resources.totalSize < 1000000 ? '🟡 Good' : '🔴 Needs Improvement'
  };
  
  console.log('\n📈 Performance Grades:');
  console.log(`Load Time: ${grades.loadTime}`);
  console.log(`First Contentful Paint: ${grades.fcp}`);
  console.log(`Bundle Size: ${grades.size}`);
  
  await browser.close();
  console.log('\n✅ Performance check completed!');
}

// Run the performance check
checkPerformance().catch(console.error); 