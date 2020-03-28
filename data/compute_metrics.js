const fs = require("fs");
const R = require("ramda");
const SERIES_TYPES = require("./series-types");
const updateRawData = require("./csv_to_json");
/**
1. get seriesType
2. read all data from file based on seriesType
3. for each object in data
  - calculate first instance of non 0 incident and store that date in a constant (DAY0)
  - read data
  - for each day (i > 0), calculate these metrics:
    - # of new incidents on the day
    - difference between that day's new incidents and the previous day's new incidents
    - rate of growth of new incidents  (diff in todays - diff in ydays) / diff in ydas * 100
    - day # based on when the data starts for this country (DAY0)
*/

/**elm pseudo code

type alias SeriesType = String
type alias CountryData = {
  data: List SeriesData,
  country: String,
  province: Maybe String
}
type alias SeriesData = { date: Date, incidents: Number }
type alias Date = String
type alias Series = {
  country: String,
  province: Maybe String,
  data: List MetricsData
}
type alias MetricsData = {
  incidents: Number,
  difference: Number,
  rateOfGrowth: Number,
  dayNumber: Number
}

generateMetricsFile : SeriesType -> List Series
generateMetricsFile seriesType =
  let
    a = getDataFromFile seriesType
  in
    computeAllMetrics a

getDataFromFile : SeriesType -> List CountryData
-- read from file and just spit it out

computeAllMetrics : List CountryData -> List Series
computeAllMetrics data =
  List.map computeMetricsForEachCountry data

computeMetricsForEachCountry : CountryData -> Series
computeMetricsForEachCountry data =
  let
    metrics = calculateMetrics data.data
  in
    { country = data.country, province = data.province, data = metrics }

calculateMetrics : List SeriesData -> List MetricsData
calculateMetrics data =
  let
    newIncidents : List { date: String, incidents: Number } -> List { date: String, incidents: Number, newIncidents: Number }
    diffInNewIncidents : List { date: String, incidents: Number, newIncidents: Number } -> List { date: String, incidents: Number, newIncidents: Number, diffInNewIncidents: Number }
    rateOfGrowthOfNewIncidents : List  { date: String, incidents: Number, newIncidents: Number, diffInNewIncidents: Number } -> List { date: String, incidents: Number, newIncidents: Number, diffInNewIncidents: Number, rateOfGrowth: Number }
    dayNumber : List { date: String, _: Any, ... } : List { date: String, dayNumber: Number, _: Any, ... }
  in
    data >> (newIncidents, diffInNewIncidents, rateOfGrowthOfNewIncidents, dayNumber)
*/

const newIncidents = list => {
  return list.map((r, i) => {
    return i === 0
      ? { ...r, newIncidents: r.incidents }
      : { ...r, newIncidents: r.incidents - list[i - 1].incidents };
  });
};

//
const diffInNewIncidents = list => {
  return list.map((r, i) => {
    return i === 0
      ? { ...r, diffInNewIncidents: r.newIncidents }
      : {
          ...r,
          diffInNewIncidents:
            r.newIncidents - list[i - 1].newIncidents
        };
  });
};

const rateOfGrowthOfNewIncidents = list => {
  return list.map((r, i) => {
    return i === 0
      ? {
          ...r,
          rateOfGrowth:
            r.newIncidents > 0
              ? (r.diffInNewIncidents / r.newIncidents) * 100
              : 0
        }
      : {
          ...r,
          rateOfGrowth:
            list[i - 1].diffInNewIncidents > 0
              ? (r.diffInNewIncidents /
                  list[i - 1].diffInNewIncidents) *
                100
              : 0
        };
  });
};

// getDataOfIncident : List { date: String, } -> Date
const getDateOfIncident = list => {
  const a = R.pathOr(null)(["date"])(list.find(r => r.incidents > 0));
  return a;
};

const dayNumber = list => {
  const firstDateOfIncident = getDateOfIncident(list);
  return list.map((r, i) => {
    return {
      ...r,
      dayNumber: getDayNumber(firstDateOfIncident)(r.date)
    };
  });
};

// getDayNumber : String -> String -> String
const getDayNumber = dateOfFirstIncident => currentDate => {
  const currDate = new Date(currentDate).getTime();
  const firstDate = new Date(dateOfFirstIncident).getTime();
  return currDate > firstDate
    ? (new Date(currentDate).getTime() -
        new Date(dateOfFirstIncident).getTime()) /
        (1000 * 24 * 3600)
    : null;
};

const calculateMetrics = data => {
  return R.pipe(
    newIncidents,
    diffInNewIncidents,
    rateOfGrowthOfNewIncidents,
    dayNumber
  )(data);
};

const computeMetricsForEachCountry = countryData => {
  return {
    country: countryData.country,
    province: countryData.province,
    data: calculateMetrics(countryData.data)
  };
};

const computeMetricsForAllCountries = list => {
  return list.map(computeMetricsForEachCountry);
};

const getDataFromFile = seriesType => {
  const getFileName = seriesType =>
    `./by_date_${seriesType}_global.json`;
  const curriedReadFile = R.curry(fs.readFileSync);
  return R.pipe(
    getFileName,
    curriedReadFile(R.__, "utf-8"),
    JSON.parse
  )(seriesType);
};

const generateMetricsFile = seriesType => {
  return R.pipe(
    getDataFromFile,
    computeMetricsForAllCountries
  )(seriesType);
};

const run = () => {
  updateRawData();
  const writeToFile = seriesType => data =>
    fs.writeFileSync(`./${seriesType}.json`, data);
  R.values(SERIES_TYPES).forEach(type =>
    R.pipe(
      generateMetricsFile,
      JSON.stringify,
      writeToFile(type)
    )(type)
  );
};

run();
