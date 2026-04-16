const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 Testing connection to Test Village database...');
    
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);
    
    // Test Village table
    console.log('📋 Testing Village table...');
    const count = await prisma.village.count();
    console.log('✅ Village table exists. Records:', count);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n⚠️  Network connectivity issue detected.');
      console.log('Possible causes:');
      console.log('  1. Database server is down');
      console.log('  2. Database not fully provisioned');
      console.log('  3. Network firewall blocking connection');
    }
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
