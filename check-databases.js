const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mhasnain0328:EQCjnQVLjVCJhXs1@cybersage-blog.asx6rmu.mongodb.net/?retryWrites=true&w=majority&appName=cybersage-blog';

async function checkDatabases() {
  try {
    console.log('🔍 Checking all databases...');
    
    // Connect without specifying database
    const connection = await mongoose.createConnection(MONGODB_URI);
    
    // List all databases
    const adminDb = connection.db.admin();
    const dbList = await adminDb.listDatabases();
    
    console.log('\n📊 Available Databases:');
    dbList.databases.forEach(db => {
      console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`);
    });
    
    // Check each database for posts and categories
    for (const db of dbList.databases) {
      if (db.name !== 'admin' && db.name !== 'local') {
        console.log(`\n🔍 Checking database: ${db.name}`);
        
        const dbConnection = await mongoose.createConnection(`${MONGODB_URI}${db.name}`);
        const collections = await dbConnection.db.listCollections().toArray();
        
        console.log(`Collections in ${db.name}:`);
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
        
        // Check for posts and categories
        if (collections.some(col => col.name === 'posts')) {
          const postsCount = await dbConnection.db.collection('posts').countDocuments();
          console.log(`  📝 Posts count: ${postsCount}`);
        }
        
        if (collections.some(col => col.name === 'categories')) {
          const categoriesCount = await dbConnection.db.collection('categories').countDocuments();
          console.log(`  📁 Categories count: ${categoriesCount}`);
        }
        
        await dbConnection.close();
      }
    }
    
    await connection.close();
    console.log('\n✅ Database check completed!');
    
  } catch (error) {
    console.error('❌ Error checking databases:', error);
  }
}

checkDatabases(); 