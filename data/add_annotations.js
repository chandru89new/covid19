const fs = require("fs");
const d3 = require("d3-dsv");
const annotationsFile = "./annotations.csv";
const R = require("ramda");

const readFileSync = R.curry(fs.readFileSync);
const a = R.pipe(
  readFileSync(R.__, "utf-8"),
  d3.csvParse,
  R.omit(["columns"]),
  R.values
)(annotationsFile);

module.exports = a;
