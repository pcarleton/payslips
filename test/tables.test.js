import { parseStateTable } from "../src/tables.js";

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
