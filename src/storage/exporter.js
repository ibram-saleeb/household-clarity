import { formatMoney } from '../utils/formatters.js';

/**
 * Downloads a string content as a client-side file.
 */
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports complete Tandem application state to a timestamped JSON backup file.
 */
export function exportStateToJson(state) {
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `tandem-household-backup-${dateStr}.json`;
  const exportPayload = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    appName: 'Tandem',
    state
  };
  const jsonContent = JSON.stringify(exportPayload, null, 2);
  downloadFile(jsonContent, fileName, 'application/json');
}

/**
 * Exports financial breakdown and expenses to a spreadsheet-compatible CSV file.
 */
export function exportStateToCsv(state, calculatedData) {
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `tandem-household-summary-${dateStr}.csv`;
  const { partners = [], expenses = [] } = state;
  const current = calculatedData?.scenarioMode && calculatedData?.scenario 
    ? calculatedData.scenario 
    : calculatedData?.baseline;

  const csvRows = [];

  // Title & Metadata
  csvRows.push(['TANDEM - HOUSEHOLD FINANCIAL CLARITY REPORT']);
  csvRows.push([`Export Date`, new Date().toLocaleDateString('en-AU')]);
  csvRows.push([`Mode`, calculatedData?.scenarioMode ? 'What-If Scenario' : 'Baseline']);
  csvRows.push([]);

  // Executive Summary Section
  csvRows.push(['--- EXECUTIVE CASHFLOW SUMMARY ---']);
  csvRows.push(['Metric', 'Monthly Amount', 'Annual Amount']);
  csvRows.push(['Net Monthly Cashflow (Surplus/Deficit)', formatMoney(current?.netCashflowMonthly || 0), formatMoney((current?.netCashflowMonthly || 0) * 12)]);
  csvRows.push(['Savings Target Allocation', formatMoney(state.savingsTargetMonthly || 0), formatMoney((state.savingsTargetMonthly || 0) * 12)]);
  csvRows.push(['Net Cashflow After Savings', formatMoney(current?.netAfterSavingsMonthly || 0), formatMoney((current?.netAfterSavingsMonthly || 0) * 12)]);
  csvRows.push(['Combined Spendable Income (Post-Tax)', formatMoney(current?.combinedUsableMonthly || 0), formatMoney(current?.combinedUsableAnnual || 0)]);
  csvRows.push(['Total Expenses / Outgoings', formatMoney(current?.totalExpensesMonthly || 0), formatMoney((current?.totalExpensesMonthly || 0) * 12)]);
  csvRows.push(['Total Employer Superannuation (Wealth Fund)', formatMoney(current?.totalSuperMonthly || 0), formatMoney((current?.totalSuperMonthly || 0) * 12)]);
  csvRows.push([]);

  // Partners Tax & Income Section
  csvRows.push(['--- PARTNER INCOME & ATO TAX BREAKDOWN ---']);
  csvRows.push(['Partner Name', 'Salary (Base)', 'Frequency', 'Extra Incomes (Annual)', 'Gross Taxable (Annual)', 'ATO Tax & Levy (Annual)', 'Net Spendable (Monthly)']);

  partners.forEach((p, idx) => {
    const calc = idx === 0 ? current?.p1 : current?.p2;
    csvRows.push([
      p.name || `Partner ${idx + 1}`,
      p.salary || 0,
      p.salaryFrequency || 'annual',
      formatMoney(calc?.extraIncomesAnnual || 0),
      formatMoney(calc?.taxableIncomeAnnual || 0),
      formatMoney(calc?.totalTaxAnnual || 0),
      formatMoney(calc?.spendableIncomeMonthly || 0)
    ]);
  });
  csvRows.push([]);

  // Expenses Section
  csvRows.push(['--- HOUSEHOLD EXPENSE LINE ITEMS ---']);
  csvRows.push(['Expense Description', 'Amount', 'Frequency', 'Assigned To', 'Monthly Normalised Amount']);

  expenses.forEach(exp => {
    const monthlyAmt = (exp.amount || 0) * (exp.frequency === 'weekly' ? 52 : exp.frequency === 'fortnightly' ? 26 : exp.frequency === 'annual' ? 1 : 12) / 12;
    let assignedLabel = 'Shared (50/50)';
    if (exp.assignedTo === 'p1') assignedLabel = partners[0]?.name || 'Partner 1';
    if (exp.assignedTo === 'p2') assignedLabel = partners[1]?.name || 'Partner 2';

    csvRows.push([
      `"${(exp.label || 'Expense').replace(/"/g, '""')}"`,
      exp.amount || 0,
      exp.frequency || 'monthly',
      assignedLabel,
      formatMoney(monthlyAmt)
    ]);
  });

  const csvString = csvRows.map(row => row.join(',')).join('\n');
  downloadFile(csvString, fileName, 'text/csv;charset=utf-8;');
}

/**
 * Validates and parses uploaded JSON string content for Tandem state import.
 */
export function parseStateFromJson(jsonContent) {
  try {
    const parsed = JSON.parse(jsonContent);
    
    // Check payload structure
    const targetState = parsed.state || parsed;

    if (!targetState || !Array.isArray(targetState.partners) || !Array.isArray(targetState.expenses)) {
      return { success: false, error: 'Invalid backup file structure. Missing partners or expenses array.' };
    }

    return { success: true, state: targetState };
  } catch (err) {
    return { success: false, error: `JSON Parse Error: ${err.message}` };
  }
}
