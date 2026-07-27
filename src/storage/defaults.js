/**
 * Default Initial Baseline State for Dual-Income Couples
 */

export const DEFAULT_APP_STATE = {
  partners: [
    {
      id: "p1",
      name: "Alex",
      initials: "AL",
      salary: 120000,
      salaryFrequency: "annual",
      superMode: "rate",
      superRate: 12.0,
      superFixedAmount: 0,
      superFixedFrequency: "annual",
      extraIncomes: [
        { id: "e1", label: "Dividend Income", amount: 300, frequency: "monthly" }
      ]
    },
    {
      id: "p2",
      name: "Sam",
      initials: "SM",
      salary: 85000,
      salaryFrequency: "annual",
      superMode: "rate",
      superRate: 12.0,
      superFixedAmount: 0,
      superFixedFrequency: "annual",
      extraIncomes: []
    }
  ],
  expenses: [
    { id: "x1", label: "Rent / Mortgage", amount: 3800, frequency: "monthly", assignedTo: "shared", category: "Housing" },
    { id: "x2", label: "Groceries & Household", amount: 350, frequency: "weekly", assignedTo: "shared", category: "Living" },
    { id: "x3", label: "Utilities & Internet", amount: 400, frequency: "monthly", assignedTo: "shared", category: "Housing" },
    { id: "x4", label: "Car Finance", amount: 500, frequency: "monthly", assignedTo: "p1", category: "Transport" },
    { id: "x5", label: "Personal & Subscriptions", amount: 400, frequency: "monthly", assignedTo: "p2", category: "Personal" },
    { id: "x6", label: "Home & Car Insurance", amount: 3000, frequency: "annual", assignedTo: "shared", category: "Insurance" }
  ],
  savingsTargetMonthly: 1500,
  scenarioMode: false,
  scenario: {
    incomeOverrides: {
      p1: { salary: null, salaryPercent: 100 },
      p2: { salary: 42500, salaryPercent: 50 } // Example: 50% parental leave reduction
    },
    expensesOverride: null, // If null, uses baseline expenses
    savingsTargetMonthly: 1500
  }
};
