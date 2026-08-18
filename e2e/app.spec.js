import { test, expect } from '@playwright/test';

test.describe('Tandem — Household Financial Clarity E2E Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to local dev server
    await page.goto('/');
  });

  test('Initial Hydration & App Shell Header', async ({ page }) => {
    // Check main title in header
    await expect(page.locator('h1.app-title')).toHaveText('Project Tandem');
    
    // Check Hero Dashboard card
    await expect(page.locator('.hero-card')).toBeVisible();
    await expect(page.locator('.hero-hero-number')).toBeVisible();
  });

  test('Navigation Tabs Switching Flow', async ({ page }) => {
    // Click Income tab
    await page.click('button.nav-tab-button:has-text("Income & Salaries")');
    await expect(page.locator('.partners-grid')).toBeVisible();

    // Click Expenses tab
    await page.click('button.nav-tab-button:has-text("Expenses")');
    await expect(page.locator('.category-filter-bar')).toBeVisible();


    // Click What-If Scenario tab
    await page.click('button.nav-tab-button:has-text("What-If Scenario")');
    await expect(page.locator('.scenario-section')).toBeVisible();
  });

  test('Income Salary Modification & Live Cashflow Recalculation', async ({ page }) => {
    // Go to Income tab
    await page.click('button.nav-tab-button:has-text("Income & Salaries")');

    // Change salary input
    const salaryInput = page.locator('input[type="number"]').first();
    await salaryInput.fill('150000');

    // Go back to Overview tab
    await page.click('button.nav-tab-button:has-text("Overview")');
    
    // Verify cashflow recalculated card is visible
    await expect(page.locator('.hero-card')).toBeVisible();
  });

  test('Multi-Scenario Engine & Comparison Matrix Flow', async ({ page }) => {
    // Go to What-If Scenario tab
    await page.click('button.nav-tab-button:has-text("What-If Scenario")');

    // Enable scenario mode if not active
    const scenarioBtn = page.locator('button.btn', { hasText: 'What-If Scenario' }).first();
    await scenarioBtn.click();

    // Verify multi-scenario tabs bar is visible
    await expect(page.locator('.multi-scenario-nav-bar')).toBeVisible();

    // Add a new custom scenario
    await page.click('button.btn-add-scen');

    // Check new tab added
    const tabs = page.locator('.scen-tab-btn');
    await expect(tabs).toHaveCount(3);

    // Verify Side-by-Side Comparison Matrix is rendered
    await expect(page.locator('.matrix-container')).toBeVisible();
    await expect(page.locator('.matrix-table')).toBeVisible();
    await expect(page.locator('.matrix-table th.col-baseline')).toHaveText('Baseline Position');
  });

  test('Data Export & Restore Modal', async ({ page }) => {
    // Click Backup & Export button in header
    await page.click('button:has-text("Backup & Export")');

    // Verify modal appears
    await expect(page.locator('.modal-content')).toBeVisible();
    await expect(page.locator('.modal-title')).toContainText('Backup, Export & Restore');

    // Verify CSV report and JSON backup buttons are present
    await expect(page.locator('button:has-text("Download CSV Report")')).toBeVisible();
    await expect(page.locator('button:has-text("Download JSON Backup")')).toBeVisible();
  });

  test('ATO HECS/HELP Debt & Salary Sacrifice Tax Calculation Flow', async ({ page }) => {
    // Go to Income tab
    await page.click('button.nav-tab-button:has-text("Income & Salaries")');

    // Click HECS toggle button
    const hecsToggleBtn = page.locator('button.pill-option', { hasText: /HECS/ }).first();
    await hecsToggleBtn.click();

    // Verify HECS repayment indicator text appears
    await expect(page.locator('.summary-row:has-text("HECS / HELP Compulsory")').first()).toBeVisible();
  });

  test('Feedback & Ideas Demand Capture Modal Flow', async ({ page }) => {
    // Click Feedback & Ideas button in header
    await page.click('button:has-text("Feedback & Ideas")');

    // Verify modal appears
    await expect(page.locator('.feedback-modal')).toBeVisible();
    await expect(page.locator('.modal-title')).toContainText('Shape Project Tandem');

    // Toggle a feature chip
    const chipBtn = page.locator('button.chip-button').first();
    await chipBtn.click();

    // Submit form
    await page.click('button[type="submit"]:has-text("Submit Feedback")');

    // Verify success banner appears
    await expect(page.locator('.feedback-success-banner')).toBeVisible();
  });
});


