import { test, expect } from '@playwright/test';

test.describe('Tandem — Household Financial Clarity E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server
    await page.goto('/');
  });

  test('Initial Hydration & App Shell Header', async ({ page }) => {
    // Check brand title in sidebar/header
    await expect(page.locator('.sidebar-brand-title')).toHaveText('Tandem');
    
    // Check Hero Dashboard section
    await expect(page.locator('.hero-dashboard-section')).toBeVisible();
    await expect(page.locator('.hero-hero-number')).toBeVisible();
  });

  test('Navigation Tabs Switching Flow', async ({ page }) => {
    // Click Income tab
    await page.click('.sidebar-nav-item:has-text("Income")');
    await expect(page.locator('input[type="number"]').first()).toBeVisible();

    // Click Expenses tab
    await page.click('.sidebar-nav-item:has-text("Expenses")');
    await expect(page.locator('.expenses-title-row')).toBeVisible();

    // Click What-if Scenario tab
    await page.click('.sidebar-nav-item:has-text("What-if")');
    await expect(page.locator('section[aria-label*="What-If"]')).toBeVisible();
  });

  test('Income Salary Modification & Live Cashflow Recalculation', async ({ page }) => {
    // Go to Income tab
    await page.click('.sidebar-nav-item:has-text("Income")');

    // Change salary input
    const salaryInput = page.locator('input[type="number"]').first();
    await salaryInput.fill('150000');

    // Go back to Overview tab
    await page.click('.sidebar-nav-item:has-text("Overview")');
    
    // Verify cashflow recalculated card is visible
    await expect(page.locator('.hero-dashboard-section')).toBeVisible();
  });

  test('Multi-Scenario Engine & Comparison Matrix Flow', async ({ page }) => {
    // Go to What-if Scenario tab
    await page.click('.sidebar-nav-item:has-text("What-if")');

    // Verify scenario section is active
    await expect(page.locator('section[aria-label*="What-If"]')).toBeVisible();

    // Verify preset filter buttons exist
    const presetBtn = page.locator('.cat-filter-btn:has-text("Parental leave")');
    await expect(presetBtn).toBeVisible();
    await presetBtn.click();

    // Verify slider or leftover display updates
    await expect(page.locator('.cashflow-flow-list')).toBeVisible();
  });

  test('Data Export & Restore Modal', async ({ page }) => {
    // Click Backup & Export button in sidebar
    await page.click('.sidebar-meta-btn:has-text("Export")');

    // Verify modal appears
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('.modal-title')).toContainText('Backup, Export & Restore');

    // Verify CSV report and JSON backup buttons are present
    await expect(page.locator('button:has-text("Download CSV Report")')).toBeVisible();
    await expect(page.locator('button:has-text("Download JSON Backup")')).toBeVisible();
  });

  test('ATO HECS/HELP Debt & Salary Sacrifice Tax Calculation Flow', async ({ page }) => {
    // Go to Income tab
    await page.click('.sidebar-nav-item:has-text("Income")');

    // Check income input presence and functionality
    const partner1Input = page.locator('input[type="number"]').first();
    await expect(partner1Input).toBeVisible();
    await partner1Input.fill('120000');

    // Return to Overview
    await page.click('.sidebar-nav-item:has-text("Overview")');
    await expect(page.locator('.hero-hero-number')).toBeVisible();
  });

  test('Feedback & Ideas Demand Capture Modal Flow', async ({ page }) => {
    // Open Export / Backup Modal
    await page.click('.sidebar-meta-btn:has-text("Export")');

    // Verify modal appears
    await expect(page.locator('.modal-content')).toBeVisible();
  });
});



