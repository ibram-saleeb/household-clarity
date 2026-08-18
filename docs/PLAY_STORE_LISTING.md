# Google Play Store Listing Package

This document contains all mandatory metadata, copy, graphics checklist, and questionnaire responses required to submit **Project Tandem** to the Google Play Console.

---

## 1. Store Metadata

* **App Name**: `Project Tandem — Household Cashflow` (39 chars / max 50)
* **Short Description**: `True post-tax cashflow & what-if scenario calculator for dual-income couples.` (80 chars / max 80)
* **Application Category**: `Finance`
* **Tags**: `Budgeting`, `Personal Finance`, `Tax Calculator`, `Household Planning`

---

## 2. Full Description (Copy-paste into Play Console)

```text
Shared Financial Clarity. Less Money Stress. 100% Local-First.

Project Tandem is a modern household financial clarity application designed for dual-income couples and property buyers to calculate their true usable spendable position and run live "what-if" stress-test scenarios.

Why Tandem?
Traditional budgeting apps look backward at line-item transactions or force you to link bank accounts. Tandem treats your dual-income household like a business — calculating your exact post-tax net surplus and letting you stress-test major life changes side-by-side.

Key Features:

🇦🇺 ATO Tax Calculation Engine (Stage 3 Tax Cuts)
- Accurately computes resident income tax across all FY 2024–26 Stage 3 brackets.
- Deducts 2.0% Medicare levy and optional compulsory HECS/HELP repayments.
- Isolates 12% employer Super Guarantee as retirement wealth accumulation, strictly keeping it out of spendable monthly cash flow.

📊 Hero Cash Flow Dashboard
- Instant view of net monthly household surplus or deficit.
- Set emergency savings reserve allocations and track post-savings net cash flow.
- Partner split meters showing personal vs. shared outgoings.

🔀 Live "What-If" Scenario Stress Testing
- Test salary changes, career breaks, parental leave, or mortgage rate increases.
- Side-by-side Baseline vs. Scenario comparison cards with real-time delta (Δ) metrics.
- Preset scenario chips for quick percentage simulations.

🔒 100% Local-First Privacy Guarantee
- All calculations execute 100% locally in your device's browser engine.
- No backend servers, no mandatory account signups, no bank credentials needed.
- No third-party data tracking or telemetry. Your financial numbers stay strictly on your device.

📁 Data Export & Portability
- Export professional CSV financial summary reports.
- Full JSON backup and restore capabilities for total data ownership.

Built for Australian dual-earner households, couples planning property purchases, and families evaluating life trade-offs. Download Tandem for clear, stress-free household financial planning!
```

---

## 3. Mandatory Play Console URL Inputs

* **Privacy Policy URL**: `https://project-tandem.pages.dev/privacy.html`
* **Website URL**: `https://project-tandem.pages.dev`
* **Support Email**: `support@project-tandem.pages.dev` (or developer email)

---

## 4. Content Rating Questionnaire Answers

* **Category**: Utility / Financial Calculator
* **Does the app contain violence or sexual content?**: `No`
* **Does the app share user location?**: `No`
* **Does the app allow users to interact or communicate with each other?**: `No`
* **Does the app collect personal information?**: `No` (App operates 100% client-side)
* **Resulting Rating**: `PEGI 3` / `USK 0` / `Everyone`

---

## 5. Required Store Assets Checklist

| Asset | Specs | Status |
| :--- | :--- | :--- |
| **App Icon** | 512 x 512 px PNG (32-bit with alpha) | ✅ Live at `public/icons/icon-512x512.png` |
| **Feature Graphic** | 1024 x 500 px PNG or JPEG | ⏳ Ready to upload |
| **Phone Screenshots** | Min 2 screenshots (16:9 or 18:9 aspect ratio) | ⏳ Ready from Playwright test runs |
