import { modelPaycheck } from "./src/model.js";
import TaxCalculator from "./src/tax_calculator.js";

test("calculates a simple tax", () => {
  expect(TaxCalculator.calculateTax(100, [{ value: 0, rate: 0.1 }])).toBe(10);
});

test("calculates a progressive tax", () => {
  const table = [
    { value: 0, rate: 0.1 },
    { value: 1000, rate: 0.2 },
  ];
  expect(TaxCalculator.calculateTax(100, table)).toBe(10);
  expect(TaxCalculator.calculateTax(1000, table)).toBe(100);
  expect(TaxCalculator.calculateTax(1100, table)).toBe(120);
});

test("creates a simple table", () => {
  const rows = [
    [0, 0.1],
    [1000, 0.2],
  ];
  const table = [
    { start: 0, end: 1000, rate: 0.1 },
    { start: 1000, end: undefined, rate: 0.2 },
  ];
  expect(TaxCalculator.makeTable(rows)).toStrictEqual(table);
});
