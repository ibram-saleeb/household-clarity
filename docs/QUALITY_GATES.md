# Quality Gates & Verification Standards

**Project**: Project Tandem  
**Author**: CTO & Quality Engineering  
**Last Updated**: 2026-08-18  

---

## 1. Quality Gate Matrix

| Quality Criteria | Target Metric | Tool / Command | Automated Hook Enforcement |
| :--- | :--- | :--- | :--- |
| **Linter Errors** | 0 errors | `npm run lint` (`oxlint`) | `pre-commit` & `pre-push` Blocker |
| **Linter Warnings** | 0 warnings | `npm run lint` (`oxlint`) | `pre-commit` & `pre-push` Blocker |
| **Production Build** | Successful build | `npm run build` (`vite build`) | `pre-commit` & `pre-push` Blocker |
| **E2E Integration Tests** | 100% Pass Rate | `npm run test:e2e` (`playwright`) | `pre-push` Blocker |
| **Commit Message Governance** | Conventional Commits | `verify-governance.js` | Commit Enforcement |
| **Bundle Size Budget** | $< 250\text{kB}$ JS bundle | `vite build` output check | Warning / Review |
| **Gzip Size Budget** | $< 75\text{kB}$ gzipped JS | `vite build` output check | Warning / Review |
| **Calculation Latency** | $< 16\text{ms}$ per recalculation | Runtime Profiling / DevTools | Warning / Optimization |

---

## 2. Automated Git Hooks Governance Policy

For full details, see [`GIT_GOVERNANCE.md`](file:///c:/Users/ibram/OneDrive/Desktop/project-tandem/docs/GIT_GOVERNANCE.md).

All code contributions undergo automated two-stage Git hook verification:
1. **Pre-Commit Hook (`.githooks/pre-commit`)**: Blocks commits if `oxlint` returns any errors/warnings or if `vite build` fails.
2. **Pre-Push Hook (`.githooks/pre-push`)**: Blocks remote branch pushes if Playwright E2E test suite fails or if lint/build checks fail.

---

## 3. Release & PR Verification Checklist

Before any feature or code change is merged or released:

1. [ ] **Git Hook Setup**: Run `npm run setup:hooks` to activate local `.githooks`.
2. [ ] **Lint Verification**: Confirm zero errors and zero warnings via `npm run pre-commit`.
3. [ ] **E2E Suite Verification**: Confirm 100% test suite pass rate via `npm run check:governance`.
4. [ ] **Conventional Commit Formatting**: Use standard prefixes e.g. `feat:`, `fix:`, `docs:`, `chore:`.
5. [ ] **Build Log Entry**: Record build metrics in `BUILD_LOG.md`.

