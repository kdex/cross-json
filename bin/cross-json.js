#!/usr/bin/env node
"use strict";
let crossJSON = require("../dist/cross-json.js");
crossJSON.crossCompare(...process.argv.slice(2));