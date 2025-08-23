#!/usr/bin/env node

const { MongoClient } = require('mongodb');
require('dotenv').config();

async function setupMongoDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clipper-dapp';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    
    // Create collections
    const collections = ['users', 'campaigns', 'engagements', 'social_media'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) { // Collection already exists
          console.log(`ℹ️  Collection already exists: ${collectionName}`);
        } else {
          console.log(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }

    // Create indexes
    console.log('\n📊 Creating indexes...');
    
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
    await db.collection('users').createIndex({ walletAddress: 1 });
    console.log('✅ Users indexes created');

    // Campaigns collection indexes
    await db.collection('campaigns').createIndex({ brandId: 1 });
    await db.collection('campaigns').createIndex({ platform: 1 });
    await db.collection('campaigns').createIndex({ status: 1 });
    await db.collection('campaigns').createIndex({ startDate: 1 });
    await db.collection('campaigns').createIndex({ endDate: 1 });
    console.log('✅ Campaigns indexes created');

    // Engagements collection indexes
    await db.collection('engagements').createIndex({ userId: 1 });
    await db.collection('engagements').createIndex({ campaignId: 1 });
    await db.collection('engagements').createIndex({ platform: 1 });
    await db.collection('engagements').createIndex({ status: 1 });
    console.log('✅ Engagements indexes created');

    console.log('\n🎉 MongoDB setup completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB setup failed:', error.message);
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  setupMongoDB();
}

module.exports = { setupMongoDB };
