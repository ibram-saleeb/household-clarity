# Changelog

All notable changes to **Tandem** (Project Tandem) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-28

### Added
- **Initial Production Release (v1.0.0)** of **Tandem — Household Financial Clarity**.
- **Tandem Financial Copilot Engine (`FinancialCopilot.jsx`)**: Real-time tax bracket proximity, fixed vs flexible expense ratios, emergency runway buffer calculations, and partner equity parity tabs.
- **Recharts Financial Visualizations**:
  - Interactive Donut Chart (`CashflowDonutChart.jsx`) for visual expense category distribution.
  - Stacked Bar Chart (`PartnerTaxBarChart.jsx`) for Partner 1 vs Partner 2 gross income, ATO tax, Medicare levy, and spendable take-Home pay.
- **What-If Live Scenario Engine (`ScenarioEngine.jsx`)**:
  - Scenario Impact Comparison Cards (replacing desktop HTML tables).
  - Quick stress-test presets (Parental Leave, Single Income, Mortgage Surge).
- **Data Portability & Backup Engine (`ExportModal.jsx`)**: Complete CSV export, JSON backup, and state restore capabilities.
- **Mobile-First FinTech Layout & Design Tokens**:
  - Monzo-style floating mobile bottom navigation bar (`NavTabs.jsx`).
  - Strict 3-tone Deep Midnight Obsidian design system with custom dark select dropdowns and SVG chevrons.
- **ATO Stage 3 FY 24-25/25-26 Tax Engine (`calculator.js`)**: Pure mathematical model for resident income tax, 2% Medicare levy, and employer Super Guarantee (12%).
