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

export const STATE_ALIASES = {
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

  // Single filer is the first set of columns
  const single = rows.map((r) => {
    return [r[3], r[1]];
  });

  // Married filer is the second set of columns
  const married = rows.map((r) => {
    return [r[6], r[4]];
  });

  return {
    stateAlias: alias,
    state: STATE_ALIASES[alias],
    single,
    married,
  };
}

export function parseAlias(text) {
  if (text === undefined || text === null) {
    return {};
  }
  const pieces = text.split(" ");

  const notes = [];
  if (pieces.length > 1) {
    pieces.slice(1).forEach((n) => notes.push(n.replace(/\(|,|\)/g, "")));
  }
  return {
    state: STATE_ALIASES[pieces[0]],
    notes,
  };
}

export function parseSpreadsheet(spreadsheet) {
  console.error(`Parsing: ${process.argv[2]}`);
  const workbook = XLSX.readFile(spreadsheet);
  const sheet = workbook.Sheets["2019"];
  const result = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    // range: "A22:L31", Calif.
    range: "A1:L500",
  });

  console.error(`Number of rows: ${result.length}`);

  // const states = result.map((x) => x[0]).filter((x) => /^[A-Z]/.test(x));
  // console.log(states.join("\n"));
  console.log(JSON.stringify(result.slice(200, 400), null, 4));
}

export function splitStates(matrix) {
  // What defines a state table?
  // it starts with a state in 0,0, it ends with some
  // text in 0,0 that's not a state, that's also not immediately in the
  // next row.

  // Start a single entry list when we see 0,0
  // Push things on if we've got one started
  // If not, keep walking
  const result = matrix.reduce((states, row, idx) => {
    const first = row[0];
    const parsed = parseAlias(first);
    const current = states[states.length - 1];

    if (parsed.state !== undefined) {
      // Start a new table
      const table = [row];
      states.push(table);
    } else if (first === undefined) {
      // Add to an existing table (simple)s
      if (current !== undefined) {
        current.push(row);
      }
    } else if (first) {
      // Add to an existing table (2nd row notes)
      if (current !== undefined && current.length === 1) {
        current.push(row);
      }
    }
    //TODO: Skip non /otes rows

    return states;
  }, []);

  return result;
}

export function parseNotes(matrix) {
  return {};
}

const tables = {
  CA: {
    2019: [],
  },
  federal: {
    2019: [],
  },
};
