const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('🗑️  Clearing all villages from database...');
    const deleted = await prisma.village.deleteMany({});
    console.log(`✅ Deleted ${deleted.count} villages`);
    
    const remaining = await prisma.village.count();
    console.log(`📊 Villages remaining: ${remaining}`);
    
    if (remaining === 0) {
      console.log('✨ Database is now empty and ready for fresh import!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
