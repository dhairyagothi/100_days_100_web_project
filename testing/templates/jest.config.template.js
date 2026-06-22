/**
 * Jest configuration template for JavaScript projects.
 * Copy this file to your project root as jest.config.js
 * and adjust paths to match your project structure.
 */
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/tests/**/*.test.js'
  ],
  verbose: true,
  coverageReporters: ['text', 'lcov', 'json-summary']
};
