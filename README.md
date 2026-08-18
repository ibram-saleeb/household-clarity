# Project Tandem

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![ATO Tax Compliant](https://img.shields.io/badge/ATO_Tax_Rules-FY_2024--26_Stage_3-008080)](https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()

> **Shared Clarity. Less Money Stress.**  
> **Project Tandem** is a mobile-first household financial clarity web application designed for dual-income couples to establish their true spendable position and live stress-test "what-if" financial scenarios.

---

## 🧭 Problem & Core Value Proposition

Budgeting applications historically look backward at past line-item transactions. **Household Financial Clarity** treats a dual-income household like a business:

1. **Combined True Position**: Computes true spendable income for both partners after ATO resident tax cuts (Stage 3 rates) and 2% Medicare levy. Excludes superannuation from spendable cash (treating it strictly as retirement wealth accumulation).
2. **Hero Cash Flow Indicator**: Leads immediately with the real net monthly cash flow (Surplus or Deficit), alongside optional emergency fund/savings allocations.
3. **Live What-If Stress Testing**: Allows couples to run live scenario simulations (salary changes, parental leave, mortgage repayments) and compare Baseline vs. Scenario side-by-side with instant delta calculations ($\Delta$).

---

## 🧮 ATO Financial Logic & Formulae

All tax rates, thresholds, and super guarantee rules are kept in an isolated, easily-editable configuration block (`src/config/atoTaxConfig.js`).

### Tax Brackets (Stage 3 Rates effective 1 July 2024 onwards)
| Taxable Income Bracket | Marginal Rate | Base Tax |
| :--- | :--- | :--- |
| **$0 – $18,200** | 0% | Nil |
| **$18,201 – $45,000** | 16% | $0 |
| **$45,001 – $135,000** | 30% | $4,288 |
| **$135,001 – $190,000** | 37% | $31,288 |
| **$190,001+** | 45% | $51,638 |

### Calculation Engine Pipeline
```
Gross Taxable Income = Primary Salary + Sum(Extra Incomes)
Superannuation      = Primary Salary × Super Guarantee Rate (12.0%)  [Tracked separately; excluded from cashflow]
ATO Tax & Levy       = Bracket Base Tax + [(Taxable Income - Bracket Min) × Rate] + (Taxable Income × 2% Medicare)
Spendable Cashflow   = Gross Taxable Income - ATO Tax & Levy
Net Cashflow (Hero)  = Combined Spendable Cashflow - Total Outgoings (Normalised to Monthly)
```

---

## 🏗️ Architecture & Project Structure

```
project-tandem/
├── docs/                        # Scoping, architectural, and quality standards
│   ├── SCOPING.md              # Product vision, scope, and v1.1 roadmap
│   ├── ENGINEERING_STANDARDS.md# Architecture, coding rules, and module standards
│   └── QUALITY_GATES.md        # Quality budgets, lint targets, and release rules
├── index.html                  # Entry point with SEO meta tags
├── package.json                # Project dependencies & npm scripts
├── ARCHITECTURE.md             # Senior engineer system architecture design
├── BUILD_LOG.md                 # Continuous build & quality validation log
├── CHANGELOG.md                # Semantic versioning release log
├── LICENSE                     # MIT open-source license
├── src/
│   ├── main.jsx                # React root renderer
│   ├── App.jsx                 # Main application shell & state coordinator
│   ├── index.css               # Vanilla CSS design system (Slate Dark theme)
│   ├── config/
│   │   └── atoTaxConfig.js     # Isolated ATO tax brackets & citations
│   ├── logic/
│   │   └── calculator.js       # Pure financial calculation engine (testable)
│   ├── components/
│   │   ├── Header.jsx          # Top navigation, ATO tax badge & scenario toggle
│   │   ├── HeroDashboard.jsx   # Hero surplus/deficit banner & savings target
│   │   ├── IncomeSection.jsx   # Dual partner salaries, super modes & extra incomes
│   │   ├── ExpenseSection.jsx  # Editable expense list with frequency normalisation
│   │   ├── ScenarioEngine.jsx  # What-if scenario controller & comparison table
│   │   └── AssumptionsModal.js # Full ATO tax rule disclosure & disclaimers
│   └── storage/
│       ├── defaults.js         # Initial dual-income sample data state
│       └── useLocalStorage.js  # Client-side state persistence hook
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Local Installation & Running

```bash
# 1. Clone the repository
git clone https://github.com/ibram-saleeb/project-tandem.git
cd project-tandem

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:5173`.

### Production Build & Preview

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Deploy to Cloudflare Pages (100% Free CDN Edge Hosting)
npm run deploy:cloudflare
```

---

## 📄 License & Framing Constraint

Distributed under the **MIT License**. See `LICENSE` for details.

*Framing Disclaimer*: This software provides mathematical clarity based on user inputs and official tax rates. It does not recommend financial products or constitute financial advice.
