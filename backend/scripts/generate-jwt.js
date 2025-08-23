#!/usr/bin/env node

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate JWT token
function generateJWT(payload, secret, expiresIn = '24h') {
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (error) {
    console.error('Error generating JWT:', error.message);
    return null;
  }
}

// Function to verify JWT token
function verifyJWT(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    console.error('Error verifying JWT:', error.message);
    return null;
  }
}

// Function to decode JWT token without verification
function decodeJWT(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
}

// Main execution
function main() {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
  
  console.log('🔐 JWT Token Generator for Clipper DApp\n');
  
  // Example payloads
  const userPayload = {
    id: '507f1f77bcf86cd799439011',
    email: 'user@example.com',
    username: 'testuser',
    role: 'user',
    iat: Math.floor(Date.now() / 1000),
  };

  const adminPayload = {
    id: '507f1f77bcf86cd799439012',
    email: 'admin@example.com',
    username: 'admin',
    role: 'admin',
    iat: Math.floor(Date.now() / 1000),
  };

  const brandPayload = {
    id: '507f1f77bcf86cd799439013',
    email: 'brand@example.com',
    username: 'testbrand',
    role: 'brand',
    iat: Math.floor(Date.now() / 1000),
  };

  // Generate tokens
  console.log('📝 Generating JWT Tokens...\n');

  const userToken = generateJWT(userPayload, secret, '24h');
  const adminToken = generateJWT(adminPayload, secret, '24h');
  const brandToken = generateJWT(brandPayload, secret, '24h');
  const shortLivedToken = generateJWT(userPayload, secret, '15m');
  const longLivedToken = generateJWT(userPayload, secret, '7d');

  if (userToken) {
    console.log('👤 User Token (24h):');
    console.log(userToken);
    console.log('\n📊 Decoded:');
    console.log(JSON.stringify(decodeJWT(userToken), null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
  }

  if (adminToken) {
    console.log('🔑 Admin Token (24h):');
    console.log(adminToken);
    console.log('\n📊 Decoded:');
    console.log(JSON.stringify(decodeJWT(adminToken), null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
  }

  if (brandToken) {
    console.log('🏢 Brand Token (24h):');
    console.log(brandToken);
    console.log('\n📊 Decoded:');
    console.log(JSON.stringify(decodeJWT(brandToken), null, 2));
    console.log('\n' + '='.repeat(80) + '\n');
  }

  if (shortLivedToken) {
    console.log('⏰ Short-lived Token (15m):');
    console.log(shortLivedToken);
    console.log('\n' + '='.repeat(80) + '\n');
  }

  if (longLivedToken) {
    console.log('🕐 Long-lived Token (7d):');
    console.log(longLivedToken);
    console.log('\n' + '='.repeat(80) + '\n');
  }

  // Test verification
  console.log('🔍 Testing Token Verification...\n');
  
  if (userToken) {
    const verified = verifyJWT(userToken, secret);
    if (verified) {
      console.log('✅ Token verification successful!');
      console.log('📊 Verified payload:', JSON.stringify(verified, null, 2));
    } else {
      console.log('❌ Token verification failed!');
    }
  }

  console.log('\n🚀 Usage Examples:');
  console.log('1. Use these tokens in Authorization header: Bearer <token>');
  console.log('2. Test different roles and permissions');
  console.log('3. Verify token expiry times');
  console.log('4. Use in Postman or curl for API testing');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateJWT,
  verifyJWT,
  decodeJWT,
};
