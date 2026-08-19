import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'store-assets');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function main() {
  console.log('🚀 Starting Google Play Store Asset & Screenshot Generation...');

  // Start Vite local dev server in background
  const server = await createServer({
    root: rootDir,
    server: { port: 5199 }
  });
  await server.listen();
  const serverUrl = 'http://localhost:5199';
  console.log(`🌐 Local app server running at ${serverUrl}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2.625
  });

  // 1. Generate 512x512 App Icon PNG
  console.log('🎨 Generating 512x512 App Icon PNG...');
  const iconPage = await browser.newPage();
  await iconPage.setViewportSize({ width: 512, height: 512 });
  
  const iconHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 512px;
          height: 512px;
          background: #0B0F19;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .icon-container {
          position: relative;
          width: 512px;
          height: 512px;
          background: radial-gradient(circle at 50% 30%, #1E293B 0%, #0B0F19 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .glow {
          position: absolute;
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(99, 102, 241, 0.22) 50%, transparent 70%);
          filter: blur(40px);
        }
        .logo-svg {
          width: 320px;
          height: 320px;
          position: relative;
          z-index: 2;
        }
      </style>
    </head>
    <body>
      <div class="icon-container">
        <div class="glow"></div>
        <svg class="logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tandemGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10B981" />
              <stop offset="100%" stop-color="#059669" />
            </linearGradient>
            <linearGradient id="tandemGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#6366F1" />
              <stop offset="100%" stop-color="#4F46E5" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path d="M 28 50 C 28 32, 42 22, 58 22 C 74 22, 84 34, 84 50 C 84 66, 72 78, 54 78" stroke="url(#tandemGrad1)" stroke-width="9.5" stroke-linecap="round" filter="url(#logoGlow)" />
          <path d="M 72 50 C 72 68, 58 78, 42 78 C 26 78, 16 66, 16 50 C 16 34, 28 22, 46 22" stroke="url(#tandemGrad2)" stroke-width="9.5" stroke-linecap="round" filter="url(#logoGlow)" />
          <circle cx="50" cy="50" r="6.5" fill="#F8FAFC" />
        </svg>
      </div>
    </body>
    </html>
  `;

  await iconPage.setContent(iconHtml);
  const iconPath = path.join(outDir, 'app-icon-512x512.png');
  await iconPage.screenshot({ path: iconPath, type: 'png' });
  fs.copyFileSync(iconPath, path.join(rootDir, 'public', 'icons', 'icon-512x512.png'));
  
  await iconPage.setViewportSize({ width: 192, height: 192 });
  const icon192Path = path.join(rootDir, 'public', 'icons', 'icon-192x192.png');
  await iconPage.screenshot({ path: icon192Path, type: 'png' });
  await iconPage.close();

  // 2. Generate 1024x500 Feature Graphic PNG
  console.log('🎨 Generating 1024x500 Feature Graphic PNG...');
  const featurePage = await browser.newPage();
  await featurePage.setViewportSize({ width: 1024, height: 500 });

  const featureHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1024px;
          height: 500px;
          background: #07090E;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 70px;
          overflow: hidden;
          position: relative;
        }
        .bg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .glow-left {
          position: absolute;
          width: 500px;
          height: 500px;
          left: -100px;
          top: -100px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 60%);
          filter: blur(50px);
        }
        .glow-right {
          position: absolute;
          width: 500px;
          height: 500px;
          right: -100px;
          bottom: -100px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, transparent 60%);
          filter: blur(50px);
        }
        .left-col {
          max-width: 560px;
          position: relative;
          z-index: 2;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34D399;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 9999px;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        h1 {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 14px;
          background: linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 18px;
          color: #94A3B8;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .pills {
          display: flex;
          gap: 12px;
        }
        .pill {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #E2E8F0;
        }
        .right-col {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        .card-preview {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 24px 28px;
          width: 320px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
        }
        .card-header {
          font-size: 12px;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .card-hero-num {
          font-size: 34px;
          font-weight: 800;
          color: #10B981;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }
        .card-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #94A3B8;
          padding: 6px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .card-row strong {
          color: #F8FAFC;
        }
      </style>
    </head>
    <body>
      <div class="bg-grid"></div>
      <div class="glow-left"></div>
      <div class="glow-right"></div>

      <div class="left-col">
        <div class="badge">🇦🇺 ATO Stage 3 Tax Ready</div>
        <h1>Project Tandem</h1>
        <p>Shared financial clarity and live what-if scenario stress testing for dual-income couples.</p>
        <div class="pills">
          <div class="pill">🔒 100% Local-First</div>
          <div class="pill">⚡ Real-Time Recalc</div>
          <div class="pill">📊 Split Ratio Meters</div>
        </div>
      </div>

      <div class="right-col">
        <div class="card-preview">
          <div class="card-header">Combined Monthly Cashflow</div>
          <div class="card-hero-num">+$4,280 /mo</div>
          <div class="card-row">
            <span>Spendable Income</span>
            <strong>$12,450</strong>
          </div>
          <div class="card-row">
            <span>Household Expenses</span>
            <strong>$8,170</strong>
          </div>
          <div class="card-row">
            <span>Retirement Super</span>
            <strong style="color: #38BDF8;">$1,820</strong>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await featurePage.setContent(featureHtml);
  const featurePath = path.join(outDir, 'feature-graphic-1024x500.png');
  await featurePage.screenshot({ path: featurePath, type: 'png' });
  await featurePage.close();

  // 3. Generate Mobile Screenshots for Play Store Listing
  console.log('📱 Capturing Phone Screenshots from live app...');
  const appPage = await context.newPage();
  await appPage.goto(serverUrl, { waitUntil: 'networkidle' });

  // Screenshot 1: Overview Tab
  await appPage.screenshot({
    path: path.join(outDir, 'screenshot-1-overview.png')
  });

  // Screenshot 2: Income Tab
  const incomeTab = appPage.locator('.mobile-bottom-nav .mobile-nav-item').nth(1);
  await incomeTab.click({ force: true });
  await appPage.waitForTimeout(500);
  await appPage.screenshot({
    path: path.join(outDir, 'screenshot-2-income.png')
  });

  // Screenshot 3: Expenses Tab
  const expenseTab = appPage.locator('.mobile-bottom-nav .mobile-nav-item').nth(2);
  await expenseTab.click({ force: true });
  await appPage.waitForTimeout(500);
  await appPage.screenshot({
    path: path.join(outDir, 'screenshot-3-expenses.png')
  });

  // Screenshot 4: Scenario Tab
  const scenarioTab = appPage.locator('.mobile-bottom-nav .mobile-nav-item').nth(3);
  await scenarioTab.click({ force: true });
  await appPage.waitForTimeout(500);
  await appPage.screenshot({
    path: path.join(outDir, 'screenshot-4-scenario.png')
  });

  await appPage.close();
  await browser.close();
  await server.close();

  console.log('🎉 ALL Google Play Store Assets Generated in public/store-assets/:');
  console.log(' - app-icon-512x512.png (512x512 App Icon)');
  console.log(' - feature-graphic-1024x500.png (1024x500 Banner Graphic)');
  console.log(' - screenshot-1-overview.png (Mobile Screenshot)');
  console.log(' - screenshot-2-income.png (Mobile Screenshot)');
  console.log(' - screenshot-3-expenses.png (Mobile Screenshot)');
  console.log(' - screenshot-4-scenario.png (Mobile Screenshot)');
}

main().catch(err => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
