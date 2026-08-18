/**
 * ATO (Australian Taxation Office) Tax Brackets & Super Guarantee Configuration
 * 
 * Sources:
 * - ATO Individual Income Tax Rates (Stage 3 Tax Cut rates effective 1 July 2024 onwards for FY 2024-25, FY 2025-26, FY 2026-27):
 *   https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents
 * - ATO Medicare Levy (2.0% standard rate):
 *   https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy
 * - Superannuation Guarantee (SG) rate (12.0% from 1 July 2025 onwards):
 *   https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee-percentage
 * 
 * Last Verified: 2026-07-27
 */

export const ATO_TAX_CONFIG = {
  financialYearLabel: "FY 2024–25 / FY 2025–26 (Stage 3 Rates)",
  sourceName: "Australian Taxation Office (ATO)",
  sourceUrl: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents",
  lastVerifiedDate: "2026-07-27",
  
  // Default Super Guarantee Rate (12%)
  defaultSuperGuaranteeRate: 12.0, 
  
  // Standard Medicare Levy Rate (2%)
  medicareLevyRate: 0.02,

  // Resident Tax Brackets (Stage 3)
  taxBrackets: [
    { min: 0, max: 18200, rate: 0.00, baseTax: 0 },
    { min: 18200, max: 45000, rate: 0.16, baseTax: 0 },
    { min: 45000, max: 135000, rate: 0.30, baseTax: 4288 },
    { min: 135000, max: 190000, rate: 0.37, baseTax: 31288 },
  ],

  // Superannuation Concessional Tax Rate (15% fund tax on salary sacrifice)
  superConcessionalTaxRate: 0.15,


  // ATO HECS/HELP Compulsory Repayment Thresholds & Rates (FY 2024-25 / FY 2025-26)
  hecsHelpBrackets: [
    { min: 0, max: 54434, rate: 0.00 },
    { min: 54435, max: 62850, rate: 0.010 },
    { min: 62851, max: 66620, rate: 0.020 },
    { min: 66621, max: 70618, rate: 0.025 },
    { min: 70619, max: 74855, rate: 0.030 },
    { min: 74856, max: 79346, rate: 0.035 },
    { min: 79347, max: 84107, rate: 0.040 },
    { min: 84108, max: 89154, rate: 0.045 },
    { min: 89155, max: 94503, rate: 0.050 },
    { min: 94504, max: 100174, rate: 0.055 },
    { min: 100175, max: 106185, rate: 0.060 },
    { min: 106186, max: 112556, rate: 0.065 },
    { min: 112557, max: 119309, rate: 0.070 },
    { min: 119310, max: 126467, rate: 0.075 },
    { min: 126468, max: 134056, rate: 0.080 },
    { min: 134057, max: 142100, rate: 0.085 },
    { min: 142101, max: 150626, rate: 0.090 },
    { min: 150627, max: 159663, rate: 0.095 },
    { min: 159664, max: Infinity, rate: 0.100 }
  ],

  disclaimer: "Tax calculations show mathematical cash flow models based on standard ATO individual resident tax rates, 2% Medicare levy, official HECS/HELP repayment thresholds, and concessional super contributions. Does not account for tax offsets (e.g. LITO) or private health insurance rebate. This tool provides financial clarity and live stress-testing; it does NOT constitute financial advice."
};

