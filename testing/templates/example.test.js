/**
 * Example Jest test suite demonstrating the expected test structure
 * for project validation. Replace with project-specific test cases.
 */
const { calculate } = require('../src/calculator');

describe('Calculator', () => {
  describe('addition', () => {
    test('adds two positive numbers correctly', () => {
      expect(calculate('add', 2, 3)).toBe(5);
    });

    test('adds negative numbers correctly', () => {
      expect(calculate('add', -2, -3)).toBe(-5);
    });
  });

  describe('division', () => {
    test('divides two numbers correctly', () => {
      expect(calculate('divide', 10, 2)).toBe(5);
    });

    test('throws error when dividing by zero', () => {
      expect(() => calculate('divide', 10, 0)).toThrow('Cannot divide by zero');
    });
  });

  describe('input validation', () => {
    test('throws error for invalid operation', () => {
      expect(() => calculate('invalid', 1, 2)).toThrow('Unsupported operation');
    });

    test('throws error for non-numeric input', () => {
      expect(() => calculate('add', 'a', 2)).toThrow('Inputs must be numbers');
    });
  });
});
