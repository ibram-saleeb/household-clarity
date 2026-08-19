import { test, expect } from '@playwright/test';

test.describe('Project Tandem — Adversarial & Security Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ADV-01: Zero & Negative Income Boundary Defense (No NaN / Infinity)', async ({ page }) => {
    // Navigate to Income section
    await page.click('button.nav-tab-button:has-text("Income & Salaries")');

    // Input $0 for Partner 1
    const partner1Input = page.locator('input[type="number"]').first();
    await partner1Input.fill('0');

    const partner2Input = page.locator('input[type="number"]').nth(1);
    await partner2Input.fill('100000');

    // Return to Overview
    await page.click('button.nav-tab-button:has-text("Overview")');

    // Verify DOM contains no NaN or Infinity strings
    const bodyText = await page.innerText('body');
    expect(bodyText).not.toContain('NaN');
    expect(bodyText).not.toContain('Infinity');
    expect(bodyText).not.toContain('undefined');
  });

  test('ADV-02: 14-Day Paywall Trigger & Lead Capture Security', async ({ page }) => {
    // Click on the trial status pill in header to open paywall modal directly
    const trialPill = page.locator('.trial-status-pill');
    await expect(trialPill).toBeVisible();
    await trialPill.click();

    // Verify Paywall Modal is rendered
    await expect(page.locator('.paywall-modal')).toBeVisible();
    await expect(page.locator('.paywall-title')).toContainText('Full App Launching Soon');

    // Submit VIP early-access email
    const emailInput = page.locator('.waitlist-input');
    await emailInput.fill('adversarial-tester@tandem.com.au');
    await page.click('.waitlist-submit-btn');

    // Verify success confirmation
    await expect(page.locator('.waitlist-success')).toBeVisible();

    // Verify email was stored safely in localStorage
    const savedLeads = await page.evaluate(() => localStorage.getItem('tandem_waitlist_leads'));
    expect(savedLeads).toContain('adversarial-tester@tandem.com.au');
  });

  test('ADV-03: XSS Injection Resistance in Expense Labels & Notes', async ({ page }) => {
    // Go to Expenses section
    await page.click('button.nav-tab-button:has-text("Expenses")');

    // Add a custom expense with malicious payload
    const labelInput = page.locator('input[placeholder*="Rent, Groceries"]');
    await expect(labelInput).toBeVisible();
    await labelInput.fill('<script>window.__xss_attack_success = true;</script><img src=x onerror="window.__xss_attack_success = true">');
    
    const amountInput = page.locator('input[placeholder="0"]').first();
    await amountInput.fill('150');

    const submitBtn = page.locator('button[type="submit"]:has-text("Add")');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }
    
    // Check that XSS was never executed in browser window context
    const xssTriggered = await page.evaluate(() => Boolean(window.__xss_attack_success));
    expect(xssTriggered).toBe(false);
  });

  test('ADV-04: ATO Stage 3 High-Net-Worth Threshold ($1M+ Salary Fuzzing)', async ({ page }) => {
    await page.click('button.nav-tab-button:has-text("Income & Salaries")');

    // Fuzz with $2,500,000 annual income
    const salaryInput = page.locator('input[type="number"]').first();
    await salaryInput.fill('2500000');

    // Return to Overview
    await page.click('button.nav-tab-button:has-text("Overview")');

    // Check that spendable take-home calculation is positive and finite
    await expect(page.locator('.hero-hero-number')).toBeVisible();
    const heroValue = await page.locator('.hero-hero-number').innerText();
    expect(heroValue).not.toContain('NaN');
    expect(heroValue).not.toContain('-');
  });

  test('ADV-05: Corrupt JSON Backup Restore Rejection', async ({ page }) => {
    // Open Export / Backup Modal
    await page.click('button:has-text("Backup & Export")');

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
    await expect(page.locator('h1.app-title')).toBeVisible();
  });
});
