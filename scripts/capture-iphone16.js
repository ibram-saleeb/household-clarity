import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function captureIPhone16() {
  const outDir = path.resolve(process.cwd(), 'public/store-assets');
  const targetUrl = 'https://4772f425.project-tandem.pages.dev';

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  
  // iPhone 16 / 16 Pro viewport & device settings
  const iPhone16Context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'
  });

  const page = await iPhone16Context.newPage();
  await page.goto(targetUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Month / Overview Tab
  const overviewPath = path.join(outDir, 'iphone16-month.png');
  await page.screenshot({ path: overviewPath, fullPage: false });
  console.log(`[iPhone 16] Saved Month: ${overviewPath}`);

  // 2. Spending / Expenses Tab
  await page.click('.mobile-nav-item:has-text("Spending"), .nav-tab-button:has-text("Spending")').catch(() => {});
  await page.waitForTimeout(500);
  const spendingPath = path.join(outDir, 'iphone16-spending.png');
  await page.screenshot({ path: spendingPath, fullPage: false });
  console.log(`[iPhone 16] Saved Spending: ${spendingPath}`);

  // 3. What-if Scenario Tab
  await page.click('.mobile-nav-item:has-text("What-if"), .nav-tab-button:has-text("What-if")').catch(() => {});
  await page.waitForTimeout(500);
  const whatifPath = path.join(outDir, 'iphone16-whatif.png');
  await page.screenshot({ path: whatifPath, fullPage: false });
  console.log(`[iPhone 16] Saved What-if: ${whatifPath}`);

  await browser.close();
  console.log('[iPhone 16] All screenshots captured successfully.');
}

captureIPhone16().catch((err) => {
  console.error('[iPhone 16 Error]', err);
  process.exit(1);
});
