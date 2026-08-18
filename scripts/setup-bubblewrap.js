import { spawn } from 'node:child_process';

/**
 * Non-interactive Bubblewrap Android TWA Initializer
 */
console.log('🤖 Starting non-interactive Bubblewrap Android TWA initializer...');

const args = [
  '-y',
  '@bubblewrap/cli',
  'init',
  '--manifest=https://project-tandem.pages.dev/manifest.json',
  '--directory=./android-twa'
];

const child = spawn('npx.cmd', args, {
  cwd: process.cwd(),
  stdio: ['pipe', 'inherit', 'inherit'],
  shell: true
});

// Continuously write "Y\n" to stdin every second until process completes
const interval = setInterval(() => {
  if (child.stdin.writable) {
    child.stdin.write('Y\n');
  }
}, 1000);

child.on('close', (code) => {
  clearInterval(interval);
  console.log(`\n✅ Bubblewrap TWA initialization completed with exit code: ${code}`);
  process.exit(code || 0);
});

child.on('error', (err) => {
  clearInterval(interval);
  console.error('❌ Bubblewrap error:', err);
  process.exit(1);
});
