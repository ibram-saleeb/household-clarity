import { execSync } from 'node:child_process';

/**
 * Automated Quality Governance Verification Runner
 * Enforces pre-commit and pre-push standards for Project Tandem.
 */

const args = process.argv.slice(2);
const stageArgIndex = args.indexOf('--stage');
const stage = stageArgIndex !== -1 ? args[stageArgIndex + 1] : 'all';

console.log('\n======================================================');
console.log(` 🛡️  PROJECT TANDEM — QUALITY GOVERNANCE PIPELINE`);
console.log(` 📍 Target Stage: ${stage.toUpperCase()}`);
console.log('======================================================\n');

function runStep(name, command) {
  console.log(`⏳ Running Quality Gate: ${name}...`);
  console.log(`   Command: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ PASSED: ${name}\n`);
  } catch (error) {
    console.error(`\n❌ FAILED: Quality Gate '${name}' failed!`);
    console.error(`   Exit code: ${error.status || 1}`);
    console.error(`\n🛑 GOVERNANCE BLOCKER: Git operation rejected. Please resolve issues above and re-try.\n`);
    process.exit(1);
  }
}

// Stage 1: Pre-Commit (Fast Static & Build Checks)
if (stage === 'pre-commit' || stage === 'all') {
  runStep('Linter Verification (oxlint)', 'npx oxlint');
  runStep('Vite Production Compilation (vite build)', 'npx vite build');
}

// Stage 2: Pre-Push (Full Integration & Test Verification)
if (stage === 'pre-push' || stage === 'all') {
  if (stage === 'pre-push') {
    runStep('Linter Verification (oxlint)', 'npx oxlint');
    runStep('Vite Production Compilation (vite build)', 'npx vite build');
  }
  runStep('Playwright E2E Test Suite (playwright test)', 'npx playwright test');
}

console.log('======================================================');
console.log(' 🎉 ALL GOVERNANCE QUALITY GATES PASSED SUCCESSFULLY!');
console.log('======================================================\n');
process.exit(0);
