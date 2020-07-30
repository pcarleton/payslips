import XLSX from "xlsx";

const HEADERS = [
  "Payslip Information",
  "Current and YTD Totals",
  "Earnings",
  "Employee Taxes",
  "Pre Tax Deductions",
  "Employer Paid Benefits",
  "Taxable Wages",
  "Withholding",
  "Absence Plans",
  "Payment Information",
];

const normalize = (x) => {
  const result = x.replace(/ /g, "_").toLowerCase();

  if (result.startsWith("ca_vdi")) return "cavdi";
  if (result.startsWith("state")) return "state";
  if (result.startsWith("federal")) return "federal";

  return result;
};

const parseFloatForgiving = (x) => {
  if (typeof x === "number") {
    return x;
  }

  return parseFloat(x.replace(",", "").replace("$", ""));
};

const parseTables = (xs) => {
  const idxs = HEADERS.map((h) => xs.findIndex((r) => r[0] === h));
  const tables = idxs.map((idx, i) => xs.slice(idx, idxs[i + 1]));

  const normalizedHs = HEADERS.map(normalize);

  const lookup = {};
  normalizedHs.map((h, i) => (lookup[h] = tables[i]));

  return lookup;
};

const parseSingleRowTable = (xs) => {
  const headers = xs[1].map(normalize);
  const values = xs[2];

  const result = {};
  headers.map((h, i) => (result[h] = values[i]));

  return result;
};

const parseColumnRowTable = (xs) => {
  const h1 = xs[1].slice(1).map(normalize);
  const h2 = xs.slice(2).map((r) => normalize(r[0]));

  const matrix = xs.slice(2).map((r) => r.slice(1));

  const result = {};

  matrix.forEach((row, ri) => {
    row.forEach((col, ci) => {
      let h1t = h1[ci];
      let h2t = h2[ri];

      result[h1t] = result[h1t] || {};
      result[h1t][h2t] = parseFloatForgiving(col);
    });
  });

  return result;
};

const parseRowColumnTable = (xs) => {
  const h1 = xs[1].slice(1).map(normalize);
  const h2 = xs.slice(2).map((r) => normalize(r[0]));

  const matrix = xs.slice(2).map((r) => r.slice(1));

  const result = {};

  matrix.forEach((row, ri) => {
    row.forEach((col, ci) => {
      let h1t = h1[ci];
      let h2t = h2[ri];

      result[h2t] = result[h2t] || {};
      result[h2t][h1t] = parseFloatForgiving(col);
    });
  });

  return result;
};

const parseSubTables = (ts) => {
  const lookup = {
    payslip_information: parseSingleRowTable,
    current_and_ytd_totals: parseColumnRowTable,
    earnings: parseColumnRowTable,
    employee_taxes: parseRowColumnTable,
    pre_tax_deductions: parseRowColumnTable,
    employer_paid_benefits: parseRowColumnTable,
    taxable_wages: parseRowColumnTable,
    withholding: parseRowColumnTable,
    absence_plans: parseSingleRowTable,
    payment_information: parseRowColumnTable,
  };

  const result = {};
  Object.keys(lookup).map((k) => (result[k] = lookup[k](ts[k])));

  return result;
};

const parsePayslip = (ps) => {
  return parseSubTables(parseTables(ps));
};

const workbook = XLSX.readFile(
  "/Users/carleton/Downloads/Paul_Carleton_01_05_2020_(Regular)_-_Complete.xlsx"
);
const sheet = workbook.Sheets["Payroll Result Currency"];
const result = XLSX.utils.sheet_to_json(sheet, { header: 1, range: "A1:F51" });
console.log(`${JSON.stringify(parsePayslip(result), null, 4)}`);
