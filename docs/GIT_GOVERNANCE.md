# Git Commit, Push & Release Governance Policy

**Project**: Project Tandem  
**Author**: Engineering & Governance Team  
**Last Updated**: 2026-08-18  
**Status**: Active / Enforced via `.githooks`  

---

## 1. Executive Summary & Objective

To preserve system stability, financial calculation accuracy, and high codebase quality, **Project Tandem** strictly enforces automated quality governance before any code can be committed or pushed.

All git commits and branch pushes must satisfy:
1. **Zero Linter Violations**: `0 errors, 0 warnings` via `oxlint`.
2. **Clean Production Compilation**: Success via `vite build` without build failures or broken imports.
3. **100% End-to-End Suite Pass Rate**: All Playwright E2E integration tests passing cleanly.
4. **Conventional Commits Standard**: Structured commit messaging for transparent change logs and semantic versioning.

---

## 2. Conventional Commits 1.0.0 Specification

All commit messages MUST adhere to the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification:

$$\text{Format}: \quad \langle \text{type} \rangle [(\text{scope})]: \quad \langle \text{short description} \rangle$$

### Approved Commit Types

| Type | Description | Example |
| :--- | :--- | :--- |
| `feat` | A new user-facing feature or enhancement | `feat(scenario): add interest rate shock slider` |
| `fix` | A bug fix or calculation adjustment | `fix(tax): adjust Medicare levy threshold boundary` |
| `docs` | Documentation changes only | `docs(governance): update pre-push quality gate rules` |
| `refactor` | Code restructuring without feature/bug changes | `refactor(calculator): optimize income normalisation loop` |
| `test` | Adding or updating end-to-end tests | `test(e2e): add coverage for CSV data restore modal` |
| `chore` | Maintenance, configuration, or dependency updates | `chore(deps): update vite and playwright dependencies` |
| `perf` | Performance optimizations | `perf(dashboard): memoize cashflow progress calculations` |
| `style` | Formatting, CSS design updates, micro-animations | `style(css): update dark select chevron SVG icon` |

---

## 3. Automated Git Quality Gates & Hooks Pipeline

Git hooks are managed in `.githooks/` and configured via `git config core.hooksPath .githooks`.

```mermaid
flowchart TD
    A[git commit] --> B[.githooks/pre-commit]
    B --> C[node scripts/verify-governance.js --stage pre-commit]
    C --> D{oxlint (0 warnings/errors)}
    D -->|Fail| E[❌ Commit Aborted]
    D -->|Pass| F{vite build}
    F -->|Fail| E
    F -->|Pass| G[✅ Commit Approved]

    H[git push] --> I[.githooks/pre-push]
    I --> J[node scripts/verify-governance.js --stage pre-push]
    J --> K{oxlint & vite build}
    K -->|Fail| L[❌ Push Aborted]
    K -->|Pass| M{npx playwright test}
    M -->|Fail| L
    M -->|Pass| N[✅ Push Approved to Remote]
```

### 3.1 Pre-Commit Gate (`.githooks/pre-commit`)
Triggers automatically on `git commit`:
- Runs `oxlint` (Linter check).
- Runs `vite build` (Production compilation check).
- **Enforcement**: If any linter error/warning or build error occurs, the commit is immediately rejected.

### 3.2 Pre-Push Gate (`.githooks/pre-push`)
Triggers automatically on `git push`:
- Runs `oxlint` (Linter check).
- Runs `vite build` (Production compilation check).
- Runs `npx playwright test` (Full E2E integration test suite).
- **Enforcement**: If any Playwright test fails, the push is immediately rejected.

---

## 4. Branching & Release Tagging Protocol

1. **Main Branch Protection**: `main` contains stable, production-ready release builds (`vX.Y.Z`).
2. **Semantic Release Tagging**: Releases must be tagged with strict SemVer:
   - `git tag -a v1.0.0 -m "Release v1.0.0 baseline"`
   - `git push origin v1.0.0`
3. **Build Log Requirement**: Any production tag or major milestone MUST record metrics in `BUILD_LOG.md`.

---

## 5. Manual & Command Line Governance Verification

Developers can manually run governance checks at any time:

```bash
# Setup Git Hooks directory (one-time developer setup)
npm run setup:hooks

# Run Pre-Commit Checks manually
npm run pre-commit

# Run Full Pre-Push Governance Check manually
npm run check:governance
```
