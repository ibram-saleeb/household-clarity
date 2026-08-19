import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Autonomous UI Preview & Visual Verification Script for Antigravity Agent.
 * Captures full-fidelity mobile & desktop screenshots of any tab/modal directly.
 */
async function capturePreview() {
  const artifactDir = process.env.ARTIFACT_DIR || path.resolve(process.cwd(), 'public/store-assets');
  const targetUrl = process.env.PREVIEW_URL || 'https://project-tandem.pages.dev';

  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  
  // 1. Mobile Portrait Viewport (iPhone 15 / Pixel 8)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(targetUrl, { waitUntil: 'networkidle' });

  // Capture Overview
  const overviewPath = path.join(artifactDir, 'preview-mobile-overview.png');
  await mobilePage.screenshot({ path: overviewPath, fullPage: false });
  console.log(`[Preview] Saved Mobile Overview: ${overviewPath}`);

  // Capture Expenses Tab
  await mobilePage.click('button.nav-tab-button:has-text("Expenses")').catch(() => {});
  await mobilePage.waitForTimeout(500);
  const expensesPath = path.join(artifactDir, 'preview-mobile-expenses.png');
  await mobilePage.screenshot({ path: expensesPath, fullPage: false });
  console.log(`[Preview] Saved Mobile Expenses: ${expensesPath}`);

  // Capture What-If Scenario Tab
  await mobilePage.click('button.nav-tab-button:has-text("What-If Scenario")').catch(() => {});
  await mobilePage.waitForTimeout(500);
  const scenarioPath = path.join(artifactDir, 'preview-mobile-scenario.png');
  await mobilePage.screenshot({ path: scenarioPath, fullPage: false });
  console.log(`[Preview] Saved Mobile Scenario: ${scenarioPath}`);

  // 2. Desktop Full Viewport
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(targetUrl, { waitUntil: 'networkidle' });
  const desktopPath = path.join(artifactDir, 'preview-desktop.png');
  await desktopPage.screenshot({ path: desktopPath, fullPage: false });
  console.log(`[Preview] Saved Desktop: ${desktopPath}`);

  await browser.close();
  console.log('[Preview] Autonomous visual preview capture complete.');
}

capturePreview().catch((err) => {
  console.error('[Preview Error]', err);
  process.exit(1);
});
