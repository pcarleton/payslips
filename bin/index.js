#!/usr/bin/env node

import { parseSpreadsheet } from "../src/parse.js";

parseSpreadsheet(process.argv[2]);
