#!/usr/bin/env node

import { parseSpreadsheet } from "../src/parse.js";

if (process.argv[2] === undefined) {
  console.error("Please provide a spreadsheet to parse.");
  process.exit(1);
}

parseSpreadsheet(process.argv[2]);
