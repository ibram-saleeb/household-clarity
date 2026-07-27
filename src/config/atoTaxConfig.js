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
    { min: 190000, max: Infinity, rate: 0.45, baseTax: 51638 }
  ],

  disclaimer: "Tax calculations are estimates based on standard ATO individual resident tax rates and the 2% Medicare levy. Does not account for HECS/HELP debt, tax offsets (e.g. LITO), private health insurance rebate, or fringe benefits. This tool provides financial clarity and live stress-testing; it does NOT constitute financial advice."
};
