const { spawn } = require('child_process');
const path = require('path');

// Run prisma db push
const child = spawn('npx', ['prisma', 'db', 'push', '--skip-generate'], {
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '..')
});

child.on('close', (code) => {
  process.exit(code);
});
