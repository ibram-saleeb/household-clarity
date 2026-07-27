# Quality Gates & Verification Standards

**Project**: Household Financial Clarity  
**Author**: CTO  
**Last Updated**: 2026-07-27  

---

## 1. Quality Gate Matrix

| Quality Criteria | Target Metric | Tool / Command | Enforcement Level |
| :--- | :--- | :--- | :--- |
| **Linter Errors** | 0 errors | `npm run lint` (`oxlint`) | Strict / Blocker |
| **Linter Warnings** | 0 warnings | `npm run lint` (`oxlint`) | Strict / Blocker |
| **Production Build** | Successful build | `npm run build` (`vite build`) | Strict / Blocker |
| **Bundle Size Budget** | $< 250\text{kB}$ JS bundle | `vite build` output check | Warning / Review |
| **Gzip Size Budget** | $< 75\text{kB}$ gzipped JS | `vite build` output check | Warning / Review |
| **Calculation Latency** | $< 16\text{ms}$ per recalculation | Runtime Profiling / DevTools | Warning / Optimization |

---

## 2. Release & PR Verification Checklist

Before any feature or code change is merged or released:

1. [ ] **Lint Verification**: Run `cmd /c npm run lint` and confirm zero errors and zero warnings.
2. [ ] **Production Build Check**: Run `cmd /c npm run build` and ensure output bundles compile under size budgets.
3. [ ] **Local Storage Fallback Test**: Verify app clears cleanly when `localStorage` is wiped and falls back to default sample state.
4. [ ] **Scenario Calculations Audit**: Verify that toggling scenario mode displays accurate delta ($\Delta$) values without mutating baseline values.
5. [ ] **Build Log Entry**: Record build metrics in `BUILD_LOG.md`.
