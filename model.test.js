import { modelPaycheck } from "./src/model.js";
import TaxCalculator from "./src/tax_calculator.js";
import { jest } from '@jest/globals';

test("calculates a simple tax", () => {
  expect(TaxCalculator.calculateTax(100, [{value: 0, rate: 0.1}])).toBe(10);
});

test("calculates a progressive tax", () => {
  const table = [
    {value: 0, rate: 0.1},
    {value: 1000, rate: 0.2},
  ];
  expect(TaxCalculator.calculateTax(100, table)).toBe(10);
  expect(TaxCalculator.calculateTax(1000, table)).toBe(100);
  expect(TaxCalculator.calculateTax(1100, table)).toBe(120);
});

