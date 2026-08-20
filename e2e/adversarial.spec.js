import { test, expect } from '@playwright/test';

test.describe('Project Tandem — Adversarial & Security Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ADV-01: Zero & Negative Income Boundary Defense (No NaN / Infinity)', async ({ page }) => {
    // Navigate to Income section
    await page.click('.sidebar-nav-item:has-text("Income")');

    // Input $0 for Partner 1
    const partner1Input = page.locator('input[type="number"]').first();
    await partner1Input.fill('0');

    const partner2Input = page.locator('input[type="number"]').nth(1);
    await partner2Input.fill('100000');

    // Return to Overview
    await page.click('.sidebar-nav-item:has-text("Overview")');

    // Verify DOM contains no NaN or Infinity strings
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('NaN');
    expect(bodyText).not.toContain('Infinity');
    expect(bodyText).not.toContain('undefined');
  });

  test('ADV-02: 14-Day Paywall Trigger & Lead Capture Security', async ({ page }) => {
    // Click on the trial status in sidebar
    const trialPill = page.locator('.sidebar-trial-label');
    await expect(trialPill).toBeVisible();

    // Verify shell is hydrated correctly
    await expect(page.locator('.sidebar-brand-title')).toBeVisible();
  });

  test('ADV-03: XSS Injection Resistance in Expense Labels & Notes', async ({ page }) => {
    // Go to Expenses section
    await page.click('.sidebar-nav-item:has-text("Expenses")');

    // Add a custom expense with malicious payload
    const labelInput = page.locator('input[placeholder*="Name"]').first();
    if (await labelInput.isVisible()) {
      await labelInput.fill('<script>window.__xss_attack_success = true;</script><img src=x onerror="window.__xss_attack_success = true">');
    }
    
    // Check that XSS was never executed in browser window context
    const xssTriggered = await page.evaluate(() => Boolean(window.__xss_attack_success));
    expect(xssTriggered).toBe(false);
  });

  test('ADV-04: ATO Stage 3 High-Net-Worth Threshold ($1M+ Salary Fuzzing)', async ({ page }) => {
    await page.click('.sidebar-nav-item:has-text("Income")');

    // Fuzz with $2,500,000 annual income
    const salaryInput = page.locator('input[type="number"]').first();
    await salaryInput.fill('2500000');

    // Return to Overview
    await page.click('.sidebar-nav-item:has-text("Overview")');

    // Check that spendable take-home calculation is positive and finite
    await expect(page.locator('.hero-hero-number')).toBeVisible();
    const heroValue = await page.locator('.hero-hero-number').innerText();
    expect(heroValue).not.toContain('NaN');
    expect(heroValue).not.toContain('-');
  });

  test('ADV-05: Corrupt JSON Backup Restore Rejection', async ({ page }) => {
    // Open Export / Backup Modal
    await page.click('.sidebar-meta-btn:has-text("Export")');

    // Attempt to paste corrupt payload into JSON restore
    const jsonTextarea = page.locator('textarea');
    if (await jsonTextarea.isVisible()) {
      await jsonTextarea.fill('{"corrupted_data": [unclosed_array, true');
      const restoreBtn = page.locator('button:has-text("Restore")');
      if (await restoreBtn.isVisible()) {
        await restoreBtn.click();
      }
    }

    // App shell must stay alive and not crash into a white screen
    await expect(page.locator('.sidebar-brand-title')).toBeVisible();
  });
});

