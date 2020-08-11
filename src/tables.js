// @flow
import XLSX from "xlsx";

export const STATE_NAMES = {
  AL: "Alabama",
  AK: "Alaska",
  AS: "American Samoa",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District Of Columbia",
  FM: "Federated States Of Micronesia",
  FL: "Florida",
  GA: "Georgia",
  GU: "Guam",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MH: "Marshall Islands",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  MP: "Northern Mariana Islands",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PW: "Palau",
  PA: "Pennsylvania",
  PR: "Puerto Rico",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VI: "Virgin Islands",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

export const STATES = Object.keys(STATE_NAMES).reduce((acc, s) => {
  acc[s] = s;
  return acc;
}, {});

//type State = $Keys<typeof states>;

const STATE_ALIASES = {
  "Ala.": STATES.AL,
  Alaska: STATES.AK,
  "Ariz.": STATES.AZ,
  "Ark.": STATES.AR,
  "Calif.": STATES.CA,
  "Colo.": STATES.CO,
  "Conn.": STATES.CT,
  "Del.": STATES.DE,
  "Fla.": STATES.FL,
  "Ga.": STATES.GA,
  Hawaii: STATES.HI,
  Idaho: STATES.ID,
  "Ill.": STATES.IL,
  "Ind.": STATES.IN,
  Iowa: STATES.IA,
  "Kans.": STATES.KS,
  "Ky.": STATES.KY,
  "La.": STATES.LA,
  Maine: STATES.ME,
  "Md.": STATES.MD,
  "Mass.": STATES.MA,
  "Mich.": STATES.MI,
  "Minn.": STATES.MN,
  "Miss.": STATES.MS,
  "Mo.": STATES.MO,
  "Mont.": STATES.MT,
  "Nebr.": STATES.NE,
  "Nev.": STATES.NV,
  "N.H.": STATES.NH,
  "N.J.": STATES.NJ,
  "N.M.": STATES.NM,
  "N.Y.": STATES.NY,
  "N.C.": STATES.NC,
  "N.D.": STATES.ND,
  Ohio: STATES.OH,
  "Okla.": STATES.OK,
  "Ore.": STATES.OR,
  "Pa.": STATES.PA,
  "R.I.": STATES.RI,
  "S.C.": STATES.SC,
  "S.D.": STATES.SD,
  "Tenn.": STATES.TN,
  "Tex.": STATES.TX,
  Utah: STATES.UT,
  "Vt.": STATES.VT,
  "Va.": STATES.VA,
  "Wash.": STATES.WA,
  "W.Va.": STATES.WV,
  "Wis.": STATES.WI,
  "Wyo.": STATES.WY,
  "D.C.": STATES.DC,
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
