const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log('📝 Environment Variables Loaded:');
console.log(`   DATABASE_URL: ${envVars.DATABASE_URL ? '✅' : '❌'}`);
console.log(`   DIRECT_URL: ${envVars.DIRECT_URL ? '✅' : '❌'}`);

// Set environment variables for child process
process.env.DATABASE_URL = envVars.DATABASE_URL;
process.env.DIRECT_URL = envVars.DIRECT_URL;

console.log('\n🔄 Running: npx prisma db push --skip-generate');

try {
  execSync('npx prisma db push --skip-generate', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log('\n✅ Schema pushed successfully!');
} catch (error) {
  console.error('\n❌ Schema push failed:', error.message);
  process.exit(1);
}
