# Engineering & Architecture Standards

**Project**: Project Tandem (App: Tandem)  
**Author**: CTO  
**Last Updated**: 2026-07-27  

---

## 1. Architectural Philosophy

### Local-First & Zero-Backend Architecture
All financial calculations, state persistence, and data processing must remain 100% client-side. Under no circumstances should financial inputs be transmitted over the network.

### Pure Calculation Core
The calculation engine (`src/logic/calculator.js`) must remain pure:
- Deterministic output given input state.
- Zero side-effects (no DOM manipulation, no state mutation, no direct `localStorage` access).
- Fully unit-testable without mock requirements.

---

## 2. Directory & Module Structure Conventions

```
household-clarity/
├── docs/                        # Scoping, architectural, and quality standards
├── public/                      # Static web assets
├── src/
│   ├── assets/                  # Images and static media
│   ├── components/              # React presentation components
│   ├── config/                  # Immutable tax & domain configuration
│   ├── logic/                   # Pure calculation engine functions
│   ├── storage/                 # State persistence & custom React hooks
│   ├── utils/                   # Shared formatting & pure helper utilities
│   ├── App.jsx                  # Main application container & state root
│   ├── index.css                # Core design system tokens & styles
│   └── main.jsx                 # Application entry point
├── BUILD_LOG.md                 # Continuous build & quality validation log
├── ARCHITECTURE.md              # High-level architecture documentation
├── CHANGELOG.md                 # Semantic versioning changelog
└── README.md                    # Project index & quick start guide
```

---

## 3. Coding Guidelines & Quality Rules

### 3.1 State Management & Immutability
- UI components must never mutate state objects directly. Always use functional updates or structured object copies (`{ ...prev, property: newValue }`).
- Baseline state modifications must re-trigger memoized calculation (`useMemo`) cleanly.

### 3.2 Tax & Domain Configuration
- Tax brackets, Medicare rates, and superannuation defaults are declared in `src/config/atoTaxConfig.js`.
- Never hardcode tax rates or bracket limits inside UI components or calculation loops.

### 3.3 Utility & Formatting Separation
- Reusable formatting functions (e.g. `formatMoney`, `formatPercent`) belong in `src/utils/formatters.js`.
- React components must only export React components to maintain Fast Refresh compatibility.

### 3.4 Icon & Third-Party Library Imports
- Import icons explicitly from `lucide-react`.
- Always prune unused icon imports to prevent bundle bloat and satisfy linter checks (`oxlint`).
