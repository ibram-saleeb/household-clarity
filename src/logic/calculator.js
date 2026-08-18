import { ATO_TAX_CONFIG } from '../config/atoTaxConfig.js';

/**
 * Normalises an amount with a given frequency to an annual figure.
 */
export function annualiseAmount(amount, frequency = 'annual') {
  const num = Number(amount) || 0;
  switch (frequency) {
    case 'weekly':
      return num * 52;
    case 'fortnightly':
      return num * 26;
    case 'monthly':
      return num * 12;
    case 'annual':
    default:
      return num;
  }
}

/**
 * Converts an annual figure to a monthly figure.
 */
export function deannualiseToMonthly(annualAmount) {
  const num = Number(annualAmount) || 0;
  return num / 12;
}

/**
 * Calculates ATO Tax and Medicare Levy for a given annual taxable income.
 */
export function calculateTaxAndLevy(taxableIncomeAnnual) {
  const income = Math.max(0, Number(taxableIncomeAnnual) || 0);
  
  if (income <= 0) {
    return {
      incomeTax: 0,
      medicareLevy: 0,
      totalTaxAndLevy: 0,
      effectiveTaxRate: 0
    };
  }

  // Find tax bracket
  const bracket = ATO_TAX_CONFIG.taxBrackets.find(
    b => income > b.min && income <= b.max
  ) || ATO_TAX_CONFIG.taxBrackets[ATO_TAX_CONFIG.taxBrackets.length - 1];

  const excess = income - bracket.min;
  const incomeTax = bracket.baseTax + excess * bracket.rate;
  
  // Medicare Levy (2.0%)
  const medicareLevy = income * ATO_TAX_CONFIG.medicareLevyRate;
  
  const totalTaxAndLevy = incomeTax + medicareLevy;
  const effectiveTaxRate = income > 0 ? (totalTaxAndLevy / income) * 100 : 0;

  return {
    incomeTax,
    medicareLevy,
    totalTaxAndLevy,
    effectiveTaxRate
  };
}

/**
 * Calculates ATO HECS/HELP Compulsory Repayment based on total repayment income.
 */
export function calculateHecsHelpRepayment(repaymentIncomeAnnual) {
  const income = Math.max(0, Number(repaymentIncomeAnnual) || 0);
  if (!ATO_TAX_CONFIG.hecsHelpBrackets || income < ATO_TAX_CONFIG.hecsHelpBrackets[1]?.min) {
    return { repaymentAnnual: 0, ratePercent: 0 };
  }

  const bracket = ATO_TAX_CONFIG.hecsHelpBrackets.find(
    b => income >= b.min && income <= b.max
  ) || ATO_TAX_CONFIG.hecsHelpBrackets[ATO_TAX_CONFIG.hecsHelpBrackets.length - 1];

  const rate = bracket?.rate || 0;
  const repaymentAnnual = income * rate;

  return {
    repaymentAnnual,
    ratePercent: rate * 100
  };
}

/**
 * Calculates complete financial breakdown for an individual partner.
 */
export function calculatePartnerPosition(partner, salaryOverride = null, salaryPercentOverride = 100) {
  if (!partner) return null;

  // Primary Salary
  let primarySalaryAnnual = annualiseAmount(partner.salary, partner.salaryFrequency || 'annual');
  
  // Apply Scenario Overrides if specified
  if (salaryOverride !== null && salaryOverride !== undefined && salaryOverride !== '') {
    primarySalaryAnnual = annualiseAmount(salaryOverride, partner.salaryFrequency || 'annual');
  } else if (salaryPercentOverride !== undefined && salaryPercentOverride !== 100) {
    primarySalaryAnnual = primarySalaryAnnual * (Number(salaryPercentOverride) / 100);
  }

  primarySalaryAnnual = Math.max(0, primarySalaryAnnual);

  // Extra Incomes (Rental, Dividends, Side Income, etc.)
  let extraIncomesAnnual = 0;
  const extraIncomesList = partner.extraIncomes || [];
  extraIncomesList.forEach(item => {
    extraIncomesAnnual += annualiseAmount(item.amount, item.frequency);
  });

  // Salary Sacrifice & Deductions
  const salarySacrificeAnnual = Math.max(0, annualiseAmount(partner.salarySacrificeAmount || 0, partner.salarySacrificeFrequency || 'monthly'));
  const taxDeductionsAnnual = Math.max(0, Number(partner.taxDeductionsAnnual) || 0);
  const hasHecsHelpDebt = Boolean(partner.hasHecsHelpDebt);

  // Employer Superannuation Guarantee (12%)
  let superGuaranteeAnnual = 0;
  if (partner.superMode === 'fixed') {
    superGuaranteeAnnual = annualiseAmount(partner.superFixedAmount || 0, partner.superFixedFrequency || 'annual');
  } else {
    const rate = Number(partner.superRate) || ATO_TAX_CONFIG.defaultSuperGuaranteeRate;
    superGuaranteeAnnual = primarySalaryAnnual * (rate / 100);
  }

  // Net Superannuation Wealth Accumulation (SG + Net Salary Sacrifice after 15% fund tax)
  const superSacrificeNetAnnual = salarySacrificeAnnual * (1 - (ATO_TAX_CONFIG.superConcessionalTaxRate || 0.15));
  const totalSuperAnnual = superGuaranteeAnnual + superSacrificeNetAnnual;

  // Gross Taxable Income after Pre-Tax Salary Sacrifice & Deductions
  const grossIncomeAnnual = primarySalaryAnnual + extraIncomesAnnual;
  const taxableIncomeAnnual = Math.max(0, grossIncomeAnnual - salarySacrificeAnnual - taxDeductionsAnnual);

  // Calculate Income Tax & Medicare Levy
  const taxDetails = calculateTaxAndLevy(taxableIncomeAnnual);

  // HECS/HELP Repayment Income (ATO includes reportable salary sacrifice)
  const hecsRepaymentIncomeAnnual = grossIncomeAnnual;
  const hecsDetails = hasHecsHelpDebt ? calculateHecsHelpRepayment(hecsRepaymentIncomeAnnual) : { repaymentAnnual: 0, ratePercent: 0 };

  // Usable Spendable Cash Income (Gross Cash Income minus Tax, Medicare Levy, HECS/HELP, & Salary Sacrifice Outflow)
  const totalDeductedOutflowsAnnual = taxDetails.totalTaxAndLevy + hecsDetails.repaymentAnnual + salarySacrificeAnnual;
  const spendableIncomeAnnual = Math.max(0, grossIncomeAnnual - totalDeductedOutflowsAnnual);

  return {
    id: partner.id,
    name: partner.name || 'Partner',
    initials: partner.initials || 'P',
    primarySalaryAnnual,
    primarySalaryMonthly: deannualiseToMonthly(primarySalaryAnnual),
    superAnnual: totalSuperAnnual,
    superMonthly: deannualiseToMonthly(totalSuperAnnual),
    superGuaranteeAnnual,
    superGuaranteeMonthly: deannualiseToMonthly(superGuaranteeAnnual),
    salarySacrificeAnnual,
    salarySacrificeMonthly: deannualiseToMonthly(salarySacrificeAnnual),
    taxDeductionsAnnual,
    taxDeductionsMonthly: deannualiseToMonthly(taxDeductionsAnnual),
    hasHecsHelpDebt,
    hecsRepaymentAnnual: hecsDetails.repaymentAnnual,
    hecsRepaymentMonthly: deannualiseToMonthly(hecsDetails.repaymentAnnual),
    hecsRatePercent: hecsDetails.ratePercent,
    extraIncomesAnnual,
    extraIncomesMonthly: deannualiseToMonthly(extraIncomesAnnual),
    taxableIncomeAnnual,
    taxableIncomeMonthly: deannualiseToMonthly(taxableIncomeAnnual),
    totalTaxAnnual: taxDetails.totalTaxAndLevy,
    totalTaxMonthly: deannualiseToMonthly(taxDetails.totalTaxAndLevy),
    incomeTaxAnnual: taxDetails.incomeTax,
    medicareLevyAnnual: taxDetails.medicareLevy,
    effectiveTaxRate: taxDetails.effectiveTaxRate,
    spendableIncomeAnnual,
    spendableIncomeMonthly: deannualiseToMonthly(spendableIncomeAnnual)
  };
}


/**
 * Calculates complete Household position (Baseline and optional Scenario).
 */
export function calculateHousehold(state) {
  const { partners = [], expenses = [], savingsTargetMonthly = 0, scenarioMode = false, scenario = {} } = state;

  // 1. Calculate Baseline Partners
  const p1Baseline = calculatePartnerPosition(partners[0]);
  const p2Baseline = calculatePartnerPosition(partners[1]);

  const baselineCombinedUsableMonthly = (p1Baseline?.spendableIncomeMonthly || 0) + (p2Baseline?.spendableIncomeMonthly || 0);
  const baselineCombinedUsableAnnual = baselineCombinedUsableMonthly * 12;

  const baselineTotalSuperMonthly = (p1Baseline?.superMonthly || 0) + (p2Baseline?.superMonthly || 0);

  // Normalise Baseline Expenses to Monthly
  let baselineExpensesMonthly = 0;
  let p1ExpensesMonthly = 0;
  let p2ExpensesMonthly = 0;
  let sharedExpensesMonthly = 0;

  expenses.forEach(exp => {
    const monthlyAmt = deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));
    baselineExpensesMonthly += monthlyAmt;

    if (exp.assignedTo === 'p1') {
      p1ExpensesMonthly += monthlyAmt;
    } else if (exp.assignedTo === 'p2') {
      p2ExpensesMonthly += monthlyAmt;
    } else {
      sharedExpensesMonthly += monthlyAmt;
    }
  });

  // Net Cashflows (Baseline)
  const baselineNetCashflowMonthly = baselineCombinedUsableMonthly - baselineExpensesMonthly;
  const baselineNetAfterSavingsMonthly = baselineNetCashflowMonthly - (Number(savingsTargetMonthly) || 0);

  const baselineP1NetMonthly = (p1Baseline?.spendableIncomeMonthly || 0) - p1ExpensesMonthly - (sharedExpensesMonthly / 2);
  const baselineP2NetMonthly = (p2Baseline?.spendableIncomeMonthly || 0) - p2ExpensesMonthly - (sharedExpensesMonthly / 2);

  const baselineResult = {
    p1: p1Baseline,
    p2: p2Baseline,
    combinedUsableMonthly: baselineCombinedUsableMonthly,
    combinedUsableAnnual: baselineCombinedUsableAnnual,
    totalSuperMonthly: baselineTotalSuperMonthly,
    totalExpensesMonthly: baselineExpensesMonthly,
    p1ExpensesMonthly,
    p2ExpensesMonthly,
    sharedExpensesMonthly,
    netCashflowMonthly: baselineNetCashflowMonthly,
    netAfterSavingsMonthly: baselineNetAfterSavingsMonthly,
    p1NetMonthly: baselineP1NetMonthly,
    p2NetMonthly: baselineP2NetMonthly
  };

  const scenariosList = state.scenarios && state.scenarios.length > 0
    ? state.scenarios
    : (scenario ? [{ id: 'legacy-scen', name: 'Scenario 1', ...scenario }] : []);

  const activeScenarioId = state.activeScenarioId || (scenariosList[0]?.id || null);

  // Helper to compute a single scenario result
  const computeScenarioData = (scen) => {
    if (!scen) return null;
    const scenarioIncomeOverrides = scen.incomeOverrides || {};
    
    const p1Scenario = calculatePartnerPosition(
      partners[0],
      scenarioIncomeOverrides.p1?.salary,
      scenarioIncomeOverrides.p1?.salaryPercent
    );

    const p2Scenario = calculatePartnerPosition(
      partners[1],
      scenarioIncomeOverrides.p2?.salary,
      scenarioIncomeOverrides.p2?.salaryPercent
    );

    const scenarioCombinedUsableMonthly = (p1Scenario?.spendableIncomeMonthly || 0) + (p2Scenario?.spendableIncomeMonthly || 0);
    const scenarioCombinedUsableAnnual = scenarioCombinedUsableMonthly * 12;
    const scenarioTotalSuperMonthly = (p1Scenario?.superMonthly || 0) + (p2Scenario?.superMonthly || 0);

    const scenarioExpenseList = scen.expensesOverride ? scen.expensesOverride : expenses;

    let scenarioExpensesMonthly = 0;
    let p1ScenarioExpensesMonthly = 0;
    let p2ScenarioExpensesMonthly = 0;
    let sharedScenarioExpensesMonthly = 0;

    scenarioExpenseList.forEach(exp => {
      const monthlyAmt = deannualiseToMonthly(annualiseAmount(exp.amount, exp.frequency));
      scenarioExpensesMonthly += monthlyAmt;

      if (exp.assignedTo === 'p1') {
        p1ScenarioExpensesMonthly += monthlyAmt;
      } else if (exp.assignedTo === 'p2') {
        p2ScenarioExpensesMonthly += monthlyAmt;
      } else {
        sharedScenarioExpensesMonthly += monthlyAmt;
      }
    });

    const scenarioSavingsTargetMonthly = scen.savingsTargetMonthly !== undefined
      ? Number(scen.savingsTargetMonthly) || 0
      : Number(savingsTargetMonthly) || 0;

    const scenarioNetCashflowMonthly = scenarioCombinedUsableMonthly - scenarioExpensesMonthly;
    const scenarioNetAfterSavingsMonthly = scenarioNetCashflowMonthly - scenarioSavingsTargetMonthly;

    const scenarioP1NetMonthly = (p1Scenario?.spendableIncomeMonthly || 0) - p1ScenarioExpensesMonthly - (sharedScenarioExpensesMonthly / 2);
    const scenarioP2NetMonthly = (p2Scenario?.spendableIncomeMonthly || 0) - p2ScenarioExpensesMonthly - (sharedScenarioExpensesMonthly / 2);

    const result = {
      id: scen.id,
      name: scen.name || 'Scenario',
      presetKey: scen.presetKey || 'custom',
      p1: p1Scenario,
      p2: p2Scenario,
      combinedUsableMonthly: scenarioCombinedUsableMonthly,
      combinedUsableAnnual: scenarioCombinedUsableAnnual,
      totalSuperMonthly: scenarioTotalSuperMonthly,
      totalExpensesMonthly: scenarioExpensesMonthly,
      p1ExpensesMonthly: p1ScenarioExpensesMonthly,
      p2ExpensesMonthly: p2ScenarioExpensesMonthly,
      sharedExpensesMonthly: sharedScenarioExpensesMonthly,
      netCashflowMonthly: scenarioNetCashflowMonthly,
      netAfterSavingsMonthly: scenarioNetAfterSavingsMonthly,
      p1NetMonthly: scenarioP1NetMonthly,
      p2NetMonthly: scenarioP2NetMonthly,
      savingsTargetMonthly: scenarioSavingsTargetMonthly
    };

    const deltas = {
      combinedUsableMonthly: scenarioCombinedUsableMonthly - baselineCombinedUsableMonthly,
      totalExpensesMonthly: scenarioExpensesMonthly - baselineExpensesMonthly,
      netCashflowMonthly: scenarioNetCashflowMonthly - baselineNetCashflowMonthly,
      netAfterSavingsMonthly: scenarioNetAfterSavingsMonthly - baselineNetAfterSavingsMonthly,
      p1NetMonthly: scenarioP1NetMonthly - baselineP1NetMonthly,
      p2NetMonthly: scenarioP2NetMonthly - baselineP2NetMonthly,
      totalSuperMonthly: scenarioTotalSuperMonthly - baselineTotalSuperMonthly
    };

    return { result, deltas };
  };

  const calculatedScenarios = scenariosList.map(scen => {
    const { result, deltas } = computeScenarioData(scen);
    return {
      id: scen.id,
      name: scen.name,
      presetKey: scen.presetKey,
      rawConfig: scen,
      result,
      deltas
    };
  });

  const activeScenarioCalc = calculatedScenarios.find(s => s.id === activeScenarioId) || calculatedScenarios[0] || null;

  if (!scenarioMode) {
    return {
      baseline: baselineResult,
      scenario: activeScenarioCalc?.result || null,
      deltas: activeScenarioCalc?.deltas || null,
      multiScenarios: calculatedScenarios,
      activeScenarioId
    };
  }

  return {
    baseline: baselineResult,
    scenario: activeScenarioCalc?.result || null,
    deltas: activeScenarioCalc?.deltas || null,
    multiScenarios: calculatedScenarios,
    activeScenarioId
  };
}

