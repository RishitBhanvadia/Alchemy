# Command Journal

## 2025-02-23 — First Run, Broken Environment
**Finding:** The environment was missing `node_modules` and required manual installation.
**Learning:** Initial setup scripts or instructions might be incomplete for new clones.
**Prevention:** Command should always verify dependencies first.

## 2025-02-23 — ESLint Config Mismatch
**Finding:** The project uses ESLint 9+ but has `.eslintrc.json` instead of `eslint.config.js`.
**Learning:** Upgrading tools without migration breaks linting.
**Prevention:** Ensure migration guides are followed when upgrading dependencies.

## 2025-02-23 — CSS Syntax Errors in Production Build
**Finding:** `titration.css` contains orphaned CSS code causing build warnings.
**Learning:** CSS syntax errors might not break the build but can cause runtime issues.
**Prevention:** Use a stricter linter or stylelint.
