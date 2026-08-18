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
      hasHecsHelpDebt: false,
      salarySacrificeAmount: 0,
      salarySacrificeFrequency: "monthly",
      taxDeductionsAnnual: 1200,
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
      hasHecsHelpDebt: true, // Example: Sam has HECS/HELP debt
      salarySacrificeAmount: 0,
      salarySacrificeFrequency: "monthly",
      taxDeductionsAnnual: 500,
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
  activeScenarioId: "scen-1",
  scenarios: [
    {
      id: "scen-1",
      name: "Parental Leave (50% Income)",
      presetKey: "parental_leave",
      incomeOverrides: {
        p1: { salary: null, salaryPercent: 100 },
        p2: { salary: 42500, salaryPercent: 50 }
      },
      expensesOverride: null,
      savingsTargetMonthly: 1500
    },
    {
      id: "scen-2",
      name: "Mortgage Spike (+ $600/mo)",
      presetKey: "mortgage_spike",
      incomeOverrides: {
        p1: { salary: null, salaryPercent: 100 },
        p2: { salary: null, salaryPercent: 100 }
      },
      expensesOverride: [
        { id: "x1", label: "Rent / Mortgage (+ Rate Hike)", amount: 4400, frequency: "monthly", assignedTo: "shared", category: "Housing" },
        { id: "x2", label: "Groceries & Household", amount: 350, frequency: "weekly", assignedTo: "shared", category: "Living" },
        { id: "x3", label: "Utilities & Internet", amount: 400, frequency: "monthly", assignedTo: "shared", category: "Housing" },
        { id: "x4", label: "Car Finance", amount: 500, frequency: "monthly", assignedTo: "p1", category: "Transport" },
        { id: "x5", label: "Personal & Subscriptions", amount: 400, frequency: "monthly", assignedTo: "p2", category: "Personal" },
        { id: "x6", label: "Home & Car Insurance", amount: 3000, frequency: "annual", assignedTo: "shared", category: "Insurance" }
      ],
      savingsTargetMonthly: 1500
    }
  ],
  scenario: {
    incomeOverrides: {
      p1: { salary: null, salaryPercent: 100 },
      p2: { salary: 42500, salaryPercent: 50 }
    },
    expensesOverride: null,
    savingsTargetMonthly: 1500
  }
};

export function createNewScenario(id, name = "Custom Scenario") {
  return {
    id: id || `scen-${Date.now()}`,
    name,
    presetKey: "custom",
    incomeOverrides: {
      p1: { salary: null, salaryPercent: 100 },
      p2: { salary: null, salaryPercent: 100 }
    },
    expensesOverride: null,
    savingsTargetMonthly: 1500
  };
}

