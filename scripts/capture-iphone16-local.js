import { chromium } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

async function runLocalPreview() {
  const outDir = path.resolve(process.cwd(), 'public/store-assets');

  // Start local vite preview
  const server = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    stdio: 'ignore'
  });

  // Wait 1.5s for preview server
  await new Promise((r) => setTimeout(r, 1500));

  const browser = await chromium.launch({ headless: true });
  
  const iPhone16Context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });

  const page = await iPhone16Context.newPage();
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Month Tab
  const overviewPath = path.join(outDir, 'iphone16-month.png');
  await page.screenshot({ path: overviewPath, fullPage: false });
  console.log(`[iPhone 16 Local] Saved Month: ${overviewPath}`);

  // 2. Spending Tab
  await page.click('.mobile-nav-item:has-text("Spending")').catch(() => {});
  await page.waitForTimeout(400);
  const spendingPath = path.join(outDir, 'iphone16-spending.png');
  await page.screenshot({ path: spendingPath, fullPage: false });
  console.log(`[iPhone 16 Local] Saved Spending: ${spendingPath}`);

  // 3. What-if Tab
  await page.click('.mobile-nav-item:has-text("What-if")').catch(() => {});
  await page.waitForTimeout(400);
  const whatifPath = path.join(outDir, 'iphone16-whatif.png');
  await page.screenshot({ path: whatifPath, fullPage: false });
  console.log(`[iPhone 16 Local] Saved What-if: ${whatifPath}`);

  await browser.close();
  server.kill();
  console.log('[iPhone 16 Local] Capture complete.');
}

runLocalPreview().catch((err) => {
  console.error('[iPhone 16 Local Error]', err);
  process.exit(1);
});
