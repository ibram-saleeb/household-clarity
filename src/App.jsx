import React, { useState, useMemo } from 'react';
import { useLocalStorage } from './storage/useLocalStorage';
import { DEFAULT_APP_STATE } from './storage/defaults';
import { calculateHousehold } from './logic/calculator';

import { Header } from './components/Header';
import { NavTabs } from './components/NavTabs';
import { HeroDashboard } from './components/HeroDashboard';
import { IncomeSection } from './components/IncomeSection';
import { ExpenseSection } from './components/ExpenseSection';
import { ScenarioEngine } from './components/ScenarioEngine';
import { AssumptionsModal } from './components/AssumptionsModal';
import { ExportModal } from './components/ExportModal';
import { FinancialCopilot } from './components/FinancialCopilot';

export default function App() {
  const [appState, setAppState] = useLocalStorage('household_clarity_app_v1', DEFAULT_APP_STATE);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'income' | 'expenses' | 'scenario'
  const [isAssumptionsModalOpen, setIsAssumptionsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

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
    setAppState((prev) => {
      const nextScenarioMode = !prev.scenarioMode;
      if (nextScenarioMode) {
        setActiveTab('scenario'); // Automatically switch to scenario tab when activated
      }
      return {
        ...prev,
        scenarioMode: nextScenarioMode
      };
    });
  };

  const handleUpdateScenario = (newScenario) => {
    setAppState((prev) => ({
      ...prev,
      scenario: newScenario
    }));
  };

  const handleImportState = (importedState) => {
    setAppState(importedState);
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
        onOpenExport={() => setIsExportModalOpen(true)}
        onResetDefaults={handleResetDefaults}
        onClearAll={handleClearAll}
      />

      {/* Segmented View Navigation Tabs */}
      <NavTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        scenarioMode={appState.scenarioMode}
      />

      {/* Main Focused Content Area */}
      <main className="main-content">
        {/* Overview / Dashboard Tab */}
        {activeTab === 'overview' && (
          <>
            <FinancialCopilot
              data={calculatedData}
              savingsTargetMonthly={appState.savingsTargetMonthly}
              partners={appState.partners}
              expenses={appState.expenses}
            />

            <HeroDashboard
              data={calculatedData}
              scenarioMode={appState.scenarioMode}
              savingsTargetMonthly={appState.savingsTargetMonthly}
              onSavingsChange={handleSavingsChange}
            />
          </>
        )}

        {/* Income & Salaries Tab */}
        {activeTab === 'income' && (
          <IncomeSection
            partners={appState.partners}
            onUpdatePartner={handleUpdatePartner}
            calculatedData={calculatedData}
          />
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <ExpenseSection
            expenses={appState.expenses}
            onUpdateExpenses={handleUpdateExpenses}
            partners={appState.partners}
          />
        )}

        {/* What-If Scenario Tab */}
        {activeTab === 'scenario' && (
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
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            <strong>Tandem</strong> — Built for dual-income couples seeking shared household financial clarity.
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

      {/* Export, Backup & Restore Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        appState={appState}
        calculatedData={calculatedData}
        onImportState={handleImportState}
      />
    </div>
  );
}
