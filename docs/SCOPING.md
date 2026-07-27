# Product Scoping & Vision Document

**Project**: Household Financial Clarity  
**Author**: CTO & Engineering Team  
**Status**: Active / Production Baseline  
**Version**: 1.0.0  

---

## 1. Product Vision & Target Persona

### Core Problem Statement
Australian couples and dual-income households face significant friction when trying to calculate true, usable monthly cashflow. Existing budget apps fail because they:
1. Conflate gross income with spendable liquidity (failing to accurately deduct ATO resident income tax and Medicare levy).
2. Misclassify Superannuation contributions (treating super as spendable income rather than locked retirement wealth).
3. Cannot model life scenarios (e.g. parental leave, career breaks, salary changes, major mortgage adjustments) side-by-side with baseline positions in real-time.

### Target Persona
Australian dual-earner households managing combined or split expenses, planning long-term savings, or evaluating financial trade-offs (e.g. career changes, family planning, major purchases).

---

## 2. In-Scope Product Requirements (v1.0.0 MVP)

### 2.1 Pure Business Logic & Calculation Engine
* **Frequency Normalisation**: Support weekly, fortnightly, monthly, and annual figures converted to exact annual amounts ($\times 52, \times 26, \times 12, \times 1$) and deannualised to monthly figures ($/ 12$).
* **ATO Tax & Levy Matrix**: Immutably configured resident income tax brackets (Stage 3 FY 2024–25 / FY 2025–26) and 2.0% Medicare levy.
* **Superannuation Exclusion**: Dedicated calculation (11.5% Super Guarantee or fixed amount) tracked separately as retirement wealth building and explicitly excluded from spendable cashflow.
* **Extra Incomes**: Support individual extra income line items per partner (rental, dividends, side hustle).

### 2.2 Hero Cashflow Dashboard
* **Real-time Monthly Surplus/Deficit**: Leading hero metric showing net monthly spendable surplus or deficit.
* **Savings Allocation**: Editable monthly savings/emergency reserve target with live Net Surplus After Savings metric.
* **Partner Split**: Transparent individual spendable income minus personal expenses and 50% shared outgoings.

### 2.3 Expense Engine
* **Custom Line Items**: User-defined expenses with frequency selection.
* **Attribution**: Tagging expenses to Partner 1, Partner 2, or Shared (50/50 split).

### 2.4 Live Scenario Engine
* **Virtual Branching**: Isolated scenario calculation engine without mutating baseline position.
* **Income Overrides**: Direct salary override or percentage slider (0%–150%).
* **Expense Overrides**: Add/modify scenario-specific expenses.
* **Side-by-Side Comparison**: Table view with delta ($\Delta$) highlighting monthly impact.

### 2.5 Privacy & Persistence
* **Local-First Data Storage**: Complete data privacy; all state resides in `localStorage` (`household_clarity_app_v1`).
* **Fail-Safe Defaults**: Built-in sample data fallback if local storage is uninitialized or corrupted.

---

## 3. Out-of-Scope (Deferred to Future Versions)

| Feature | Target Version | Rationale |
| :--- | :--- | :--- |
| **Mobile PWA & Offline Worker** | v1.1.0 | Offline service worker and mobile tab navigation bar |
| **CSV / JSON Import & Export** | v1.1.0 | Snapshot saving and data portability |
| **Visual Cashflow Charts** | v1.1.0 | Chart.js/Recharts visual breakdowns |
| **Multi-Scenario Comparison** | v1.2.0 | Comparing 3+ scenarios concurrently |
| **Cloud Sync & User Accounts** | Deprecated / Out of Scope | Direct violation of local-first zero-backend privacy principle |

---

## 4. Non-Functional Requirements (NFRs)

* **Performance**: Calculation engine execution under $16\text{ms}$ ($60\text{fps}$ input responsiveness).
* **Bundle Size Budget**: $< 250\text{kB}$ minified production JS bundle.
* **Security & Privacy**: Zero remote telemetry, zero analytics tracking, zero third-party API dependencies for financial data.
