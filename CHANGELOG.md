# Changelog

All notable changes to the **Household Financial Clarity** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-27

### Added
- **Hero Cashflow Dashboard**: Leading indicator displaying true net monthly household surplus or deficit, alongside optional savings allocation line and net after savings figure.
- **ATO Tax Calculation Engine**: Configurable ATO resident income tax brackets (Stage 3 rates for FY 2024–25 / FY 2025–26) and 2% Medicare levy calculation in `src/config/atoTaxConfig.js`.
- **Superannuation Fund Separation**: Dedicated Superannuation calculation (rate % or fixed amount), excluded from spendable cash and tracked separately as retirement wealth building.
- **Dual Partner Incomes**: Editable partner labels and initials (e.g. Alex, Sam), primary salary inputs with flexible frequencies, and extra income lines (dividends, rental income).
- **Normalised Expenses Engine**: Editable line items with frequency normalisation (weekly, fortnightly, monthly, annual) and partner assignment tags (Shared 50/50, Partner 1, Partner 2).
- **What-If Scenario Engine**: Single live scenario mode with income salary sliders (0%–150%), custom expense overrides, side-by-side baseline vs scenario comparison table, and live delta ($\Delta$) highlights.
- **Assumptions & Disclaimers Modal**: Full disclosure modal documenting tax brackets, super guarantee rules, frequency math, and official ATO source links.
- **Local Persistence**: Client-side state persistence via `localStorage` with fail-safe sample defaults fallback.
- **Senior Developer Suite**: Added `README.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, `.editorconfig`, and `LICENSE`.

---

## [Unreleased / Roadmap]

### Planned for v1.1.0
- **Mobile-First PWA Support**: Web app manifest, service worker for offline support, and bottom tab navigation bar for mobile devices.
- **CSV Data Export & Restore**: Export baseline and scenario snapshots to CSV/JSON files.
- **Visual Cashflow Charts**: Optional chart rendering for spendable income vs outgoings split.
