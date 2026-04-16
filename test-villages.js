const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing Village table...');
    const count = await prisma.village.count();
    console.log('✅ Village count:', count);
    
    if (count === 0) {
      console.log('📝 Table is empty, starting import...');
      return true;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('page server')) {
      console.log('\n⚠️  Neon page server error detected. This may be a temporary issue.');
      console.log('Try: 1. Refresh the Neon dashboard\n   2. Wait a few minutes and retry\n   3. Contact Neon support if issue persists');
    }
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

test();
