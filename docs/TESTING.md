# Automated Testing Framework

This document describes the automated testing infrastructure used to validate
project submissions in the 100 Days 100 Web Projects repository.

## Overview

Every pull request that adds or modifies a project is automatically validated
through a GitHub Actions workflow that:

1. Detects the project type (JavaScript or Python)
2. Installs dependencies
3. Runs the project's test suite
4. Enforces a minimum 70% code coverage threshold
5. Reports results directly on the pull request

## Adding Tests to a New Project

### JavaScript Projects

1. Copy `testing/templates/jest.config.template.js` to your project root as `jest.config.js`
2. Create a `__tests__/` or `tests/` directory inside your project folder
3. Write test files following the pattern in `testing/templates/example.test.js`
4. Add a `test` script to your project's `package.json`:
   ```json
   "scripts": {
     "test": "jest"
   }
   ```
5. Run tests locally with `npm test` before submitting your PR

### Python Projects

1. Copy `testing/templates/pytest.ini.template` to your project root as `pytest.ini`
2. Create a `tests/` directory inside your project folder
3. Write test files following the pattern in `testing/templates/test_example.py`
4. Run tests locally with `pytest` before submitting your PR

## Coverage Requirements

All projects must meet a minimum of 70% code coverage across branches,
functions, lines, and statements. This threshold can be adjusted per-project
in `testing/coverage-config.json` if there is a documented reason (for
example, a project that is primarily declarative HTML/CSS with minimal logic).

## How Validation Works in CI

The `.github/workflows/run-tests.yml` workflow:

- Triggers on every pull request and push to `Main`
- Detects which project directories changed
- Runs the appropriate test suite for each changed project
- Fails the check if any project's tests fail or coverage drops below threshold
- Uploads a coverage report as a workflow artifact for review

## Troubleshooting

**My tests pass locally but fail in CI**
Check that your `package.json` or `requirements.txt` lists all dependencies
your tests need, since CI installs a clean environment.

**Coverage threshold failing on a small project**
Add a per-project override in `testing/coverage-config.json` with justification
in your PR description.

**Tests not being picked up at all**
Confirm your test files match the expected naming pattern (`*.test.js` for
Jest, `test_*.py` for pytest) and live in a `tests/` or `__tests__/` directory.
