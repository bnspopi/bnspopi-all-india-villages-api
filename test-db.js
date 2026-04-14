const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database connection OK:', result);
    return true;
  } catch (error) {
    console.error('❌ Database error:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

test();
