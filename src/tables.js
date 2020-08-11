// @flow
import XLSX from "xlsx";

export const states = {
  CA: "CA",
  OR: "OR",
};
//type State = $Keys<typeof states>;

const STATE_ALIASES = {
  "Calif.": states.CA,
};

export function parseStateTable(rows) {
  const alias = rows[0][0];
  return {
    stateAlias: alias,
    state: STATE_ALIASES[alias],
  };
}

export function parseSpreadsheet(spreadsheet) {
  console.error(`Parsing: ${process.argv[2]}`);
  const workbook = XLSX.readFile(spreadsheet);
  const sheet = workbook.Sheets["2019"];
  const result = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    range: "A22:L31",
  });

  console.error(`Number of rows: ${result.length}`);
  console.log(JSON.stringify(result, null, 4));
}

const tables = {
  CA: {
    2019: [],
  },
  federal: {
    2019: [],
  },
};
