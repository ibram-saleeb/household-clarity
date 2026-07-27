import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './storage/useLocalStorage';
import { DEFAULT_APP_STATE } from './storage/defaults';
import { calculateHousehold } from './logic/calculator';

import { Header } from './components/Header';
import { HeroDashboard } from './components/HeroDashboard';
import { IncomeSection } from './components/IncomeSection';
import { ExpenseSection } from './components/ExpenseSection';
import { ScenarioEngine } from './components/ScenarioEngine';
import { AssumptionsModal } from './components/AssumptionsModal';

export default function App() {
  const [appState, setAppState] = useLocalStorage('household_clarity_app_v1', DEFAULT_APP_STATE);
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);

  // Recalculate household calculations live on every state change
  const calculatedData = useMemo(() => {
    return calculateHousehold(appState);
  }, [appState]);

  // Handler functions
  const handleUpdatePartner = (updatedPartners) => {
    setAppState((prev) => ({
      ...prev,
      partners: updatedPartners
    }));
  };

  const handleUpdateExpenses = (updatedExpenses) => {
    setAppState((prev) => ({
      ...prev,
      expenses: updatedExpenses
    }));
  };

  const handleSavingsChange = (newTarget) => {
    setAppState((prev) => ({
      ...prev,
      savingsTargetMonthly: newTarget
    }));
  };

  const handleToggleScenario = () => {
    setAppState((prev) => ({
      ...prev,
      scenarioMode: !prev.scenarioMode
    }));
  };

  const handleUpdateScenario = (newScenario) => {
    setAppState((prev) => ({
      ...prev,
      scenario: newScenario
    }));
  };

  const handleResetDefaults = () => {
    if (window.confirm("Reset all inputs to sample dual-income data?")) {
      setAppState(DEFAULT_APP_STATE);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all partner incomes and expenses?")) {
      setAppState({
        ...DEFAULT_APP_STATE,
        partners: [
          { id: "p1", name: "Partner 1", initials: "P1", salary: 0, salaryFrequency: "annual", superMode: "rate", superRate: 12, extraIncomes: [] },
          { id: "p2", name: "Partner 2", initials: "P2", salary: 0, salaryFrequency: "annual", superMode: "rate", superRate: 12, extraIncomes: [] }
        ],
        expenses: [],
        savingsTargetMonthly: 0,
        scenarioMode: false
      });
    }
  };

  return (
    <div className="app-shell">
      {/* Top Header */}
      <Header
        scenarioMode={appState.scenarioMode}
        onToggleScenario={handleToggleScenario}
        onOpenAssumptions={() => setIsAssumptionsModalOpen(true)}
        onResetDefaults={handleResetDefaults}
        onClearAll={handleClearAll}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Hero Dashboard Banner (Leading with True Net Position) */}
        <HeroDashboard
          data={calculatedData}
          scenarioMode={appState.scenarioMode}
          savingsTargetMonthly={appState.savingsTargetMonthly}
          onSavingsChange={handleSavingsChange}
        />

        {/* What-If Live Scenario Engine Controller & Comparison */}
        <ScenarioEngine
          scenarioMode={appState.scenarioMode}
          onToggleScenario={handleToggleScenario}
          scenarioData={{
            ...appState.scenario,
            baseline: calculatedData.baseline,
            scenario: calculatedData.scenario,
            deltas: calculatedData.deltas
          }}
          onUpdateScenario={handleUpdateScenario}
          partners={appState.partners}
          baselineExpenses={appState.expenses}
        />

        {/* Core Inputs: Income Section */}
        <IncomeSection
          partners={appState.partners}
          onUpdatePartner={handleUpdatePartner}
          calculatedData={calculatedData}
        />

        {/* Core Inputs: Expenses Section */}
        <ExpenseSection
          expenses={appState.expenses}
          onUpdateExpenses={handleUpdateExpenses}
          partners={appState.partners}
        />
      </main>

      {/* Footer Disclaimer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Household Financial Clarity (MVP)</strong> — Built for dual-income couples seeking shared financial transparency.
          </p>
          <p className="footer-disclaimer">
            Calculations strictly show mathematical cash flow models based on user inputs and ATO resident tax rates. This application does NOT recommend financial products, loans, or financial advice.
          </p>
        </div>
      </footer>

      {/* Assumptions & ATO Tax Modal */}
      <AssumptionsModal
        isOpen={isAssumptionsModalOpen}
        onClose={() => setIsAssumptionsModalOpen(false)}
      />
    </div>
  );
}
