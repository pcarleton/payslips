import {
  parseStateTable,
  parseAlias,
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
    [null, 0.06, ">", 31969, 0.06, ">", 63938],
    [null, 0.08, ">", 44377, 0.08, ">", 88754],
    [null, 0.093, ">", 56085, 0.093, ">", 112170],
    [null, 0.103, ">", 286492, 0.103, ">", 572984],
    [null, 0.113, ">", 343788, 0.113, ">", 687576],
    [null, 0.123, ">", 572980, 0.123, ">", 1000000],
    [null, 0.133, ">", 1000000, 0.133, ">", 1145960],
  ];

  const result = parseStateTable(input);

  expect(result.stateAlias).toBe("Calif.");
  expect(result.state).toBe("CA");
});
