import {
  parseStateTable,
  parseAlias,
  parseNotes,
  splitStates,
  STATES,
  STATE_ALIASES,
} from "../src/tables.js";
import XLSX from "xlsx";

// Path relative to the root
const FIXTURE_PATH =
  "./test/fixtures/State-Individual-Income-Tax-Rates-and-Brackets-for-2020.xlsx";

const TEST_TABLE = (() => {
  const workbook = XLSX.readFile(FIXTURE_PATH);
  const sheet = workbook.Sheets["2019"];
  return XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    // range: "A22:L31", Calif.
    range: "A1:L500",
  });
})();

test("parses test fixture", () => {
  expect(TEST_TABLE.length).toBeGreaterThan(0);
});

test("has all aliases", () => {
  expect(Object.keys(STATE_ALIASES).length).toBe(51);
  const candidates = TEST_TABLE.map((x) => x[0])
    .filter((x) => x)
    .map((x) => {
      return parseAlias(x).state;
    })
    .filter((x) => x);

  expect(candidates.length).toBe(51); // 50 states plus D.C.
});
test("parse state aliases", () => {
  expect(parseAlias("Ore.")).toStrictEqual({ state: STATES.OR, notes: [] });
  expect(parseAlias("Utah (r, j)")).toStrictEqual({
    state: STATES.UT,
    notes: ["r", "j"],
  });

  expect(parseAlias("W.Va. (hh)")).toStrictEqual({
    state: STATES.WV,
    notes: ["hh"],
  });
});

test("parses a taxfoundation.org table", () => {
  const input = [
    ["Calif.", 0.01, ">", 0, 0.01, ">", 0, 4401, 8802, 118, 236, 367],
    ["(a, e, r, s, ff, hh)", 0.02, ">", 8544, 0.02, ">", 17088],
    [null, 0.04, ">", 20255, 0.04, ">", 40510],
    // [null, 0.06, ">", 31969, 0.06, ">", 63938],
    // [null, 0.08, ">", 44377, 0.08, ">", 88754],
    // [null, 0.093, ">", 56085, 0.093, ">", 112170],
    // [null, 0.103, ">", 286492, 0.103, ">", 572984],
    // [null, 0.113, ">", 343788, 0.113, ">", 687576],
    // [null, 0.123, ">", 572980, 0.123, ">", 1000000],
    // [null, 0.133, ">", 1000000, 0.133, ">", 1145960],
  ];

  const result = parseStateTable(input);

  expect(result.stateAlias).toBe("Calif.");
  expect(result.state).toBe("CA");

  expect(result.single).toStrictEqual([
    [0, 0.01],
    [8544, 0.02],
    [20255, 0.04],
  ]);

  expect(result.married).toStrictEqual([
    [0, 0.01],
    [17088, 0.02],
    [40510, 0.04],
  ]);
});

test("divides into tables", () => {
  const example = [
    [
      "State",
      "Rates",
      null,
      "Brackets",
      "Rates",
      null,
      "Brackets",
      "Single",
      "Couple",
      "Single",
      "Couple",
      "Dependent",
    ],
    ["Ala.", 0.02, ">", 0, 0.02, ">", 0, 2500, 7500, 1500, 3000, 1000],
    ["(b, f, gg)", 0.04, ">", 500, 0.04, ">", 1000],
    [null, 0.05, ">", 3000, 0.05, ">", 6000],
    [],
    [
      "Alaska",
      "none",
      null,
      null,
      "none",
      null,
      null,
      "n.a.",
      "n.a.",
      "n.a.",
      "n.a.",
      "n.a.",
    ],
    [],
  ];

  const result = splitStates(example);

  expect(result).toBeDefined();
});

test("parses notes", () => {
  const example = [
    [],
    [
      "(a) Bracket widths, personal exemption, and standard deductions amounts are 2018 tax information.",
    ],
    [
      "(b) For single taxpayers with AGI below $23,000, the standard deduction is $2,500. This standard deduction amount is reduced by $25 for every additional $500 of AGI, not to fall below $2,000. For Married Filing Joint taxpayers with AGI below $23,000, the standard deduction is $7,500. This standard deduction amount is reduced by $175 for every additional $500, not to fall below $4,000. For all taxpayers claiming a dependent with AGI of $20,000 or less, the dependent exemption is $1,000. This amount is reduced to $500 per dependent for taxpayers with AGI above $20,000 and equal to or less than $100,000. For taxpayers with over $100,000 AGI, the dependent exemption is $300 per dependent.",
    ],
    ["(c) Applies to interest and dividend income only."],
    [
      "(d) Rates apply to individuals earning more than $79,300. Two special tax tables exist for low and middle income individuals. One for individuals below $22,000 in income, and one for those between $22,000 and $79,300.",
    ],
    [
      "(e) Bracket levels adjusted for inflation each year. Release dates for tax bracket inflation adjustments vary by state and may fall after the end of the applicable tax year.",
    ],
  ];

  const result = parseNotes(example);

  expect(result).toBeDefined();
});
