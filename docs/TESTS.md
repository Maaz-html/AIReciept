# Tests

## How to Run
npm run test

## Test Files

### tests/auditEngine.test.ts
- `should recommend downgrade for Team plan with 1 seat`: Covers Rule A (downgrade logic for ≤2 seats).
- `should return 0 savings if already on cheapest appropriate plan`: Verifies that optimal setups don't suggest false savings.
- `should calculate annual savings as monthly savings * 12`: Ensures basic math consistency for long-term reporting.
- `should recommend Cursor Pro for coding use case on ChatGPT Plus`: Covers Rule B (specialized tool recommendation based on use case).
- `should set savingsTier to high when total monthly savings > 500`: Validates the logic for the "high" savings classification.
- `should not crash and return 0 savings for empty tools array`: Ensures robustness when no tools are provided.

## CI
Tests run automatically on every push to main via GitHub Actions.
See .github/workflows/ci.yml
