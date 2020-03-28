const fs = require("fs");
const d3 = require("d3-dsv");
const R = require("ramda");
const moment = require("moment");
const SERIES_TYPES = require("./series-types");

// applyTransformation : List { [dateTypeKey]: Number, _: Any } -> List { _: Any, data: List (DateTimeNumber, Number) }
const applyTransformation = data => {
  return data.map(d => {
    const a = R.pipe(
      R.dissoc("Lat"),
      R.dissoc("Long"),
      R.dissoc("Province/State"),
      R.dissoc("Country/Region")
    )(d);
    return {
      data: Object.entries(a).map(r => ({
        date: moment(r[0]).format("YYYY-MM-DD"),
        incidents: Number(r[1])
      })),
      country: d["Country/Region"],
      province: d["Province/State"]
    };
  });
};

// generateJSON : String -> Void
const generateJSON = seriesType => {
  const file = `../csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${seriesType}_global.csv`;
  const curriedRead = R.curry(fs.readFileSync);
  const d = R.pipe(
    curriedRead(R.__, "utf-8"),
    d3.csvParse,
    applyTransformation,
    JSON.stringify
  )(file);
  const outFile = `./by_date_${seriesType}_global.json`;
  fs.writeFileSync(outFile, d, "utf-8");
};

module.exports = () => {
  R.values(SERIES_TYPES).forEach(type => generateJSON(type));
};
