# Autonomous Git Commit & Push Rule

**Directive**: The user has granted full autonomous permission to commit and push code changes whenever appropriate during development sessions.

## Instructions:
1. Do NOT pause or ask the user for permission before committing or pushing changes when a logical task or feature increment is complete.
2. Always execute `npm run check:governance` or rely on `.githooks` pre-commit & pre-push automated validation to ensure zero linter errors/warnings, clean production compilation, and 100% Playwright E2E test pass rate.
3. Follow **Conventional Commits 1.0.0** standards (e.g. `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
