import { modelPaycheck } from "./src/model.js";
import TaxCalculator from "./src/tax_calculator.js";
import { jest } from '@jest/globals';

test("calculates a simple tax", () => {
  expect(TaxCalculator.calculateTax(100, [{rate: 0.1}])).toBe(10);
});

