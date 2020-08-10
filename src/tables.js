// @flow
import XLSX from "xlsx";

export const states = {
  CA: "CA",
  OR: "OR",
};

export function parseStateTable(rows) {
  return {
    stateLabel: rows[0][0],
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

//type State = $Keys<typeof states>;

const tables = {
  CA: {
    2019: [],
  },
  federal: {
    2019: [],
  },
};
