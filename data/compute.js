const fs = require("fs");
const R = require("ramda");
const SERIES_TYPES = require("./series-types");
const updateRawData = require("./csv_to_json");
const updateCountriesList = require("./compute_countries")
  .updateCountriesList;
const ANNOTATIONS = require("./add_annotations");
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
  let
    refined = mergeDataForChinaAndUSA data
  in
    List.map computeMetricsForEachCountry refined

mergeDataForChinaAndUSA : List CountryData -> List CountryData
mergeDataForChinaAndUSA list =
  let
    a = addUpDataByCountry "China" list
    b = addUpDataByCountry "Australia" list
    c = excludeCountries ["China", "Australia"] list
  in
    List.concat(excludeCountries, addUpDataForChina, addUpDataForUSA)

addUpDataByCountry : Country -> List CountryData -> List CountryData
addUpDataByCountry country list =
  let
    a = List.filter (getOnlyByCountry country) list
  in 
    List.reduce sumFunction a

excludeCountries : List String -> List CountryData -> ListCountryData
excludeCountries excludeList list =
  List.filter (\x -> !excludeList.includes(x)) list

computeMetricsForEachCountry : CountryData -> Series
computeMetricsForEachCountry cd =
  let
    annotations = getAnnotationsForCountry cd.country
    metrics = calculateMetrics annotations cd.data
  in
    { country = cd.country, province = cd.province, cd.data = metrics }

type alias Annotation = { date: String, annotation: String }
getAnnotationForCountry : String -> List Annotation
getAnnotationsForCountry country =
  let 
    a = constants.ANNOTATIONS
    b = List.filter (\x -> x.country == country) a
  in
    List.map (\x -> { date = x.date, annotation: x.annotation }) b

calculateMetrics : List Annotation -> List SeriesData -> List MetricsData
calculateMetrics notes data =
  let
    newIncidents : List { date: String, incidents: Number } -> List { date: String, incidents: Number, newIncidents: Number }
    diffInNewIncidents : List { date: String, incidents: Number, newIncidents: Number } -> List { date: String, incidents: Number, newIncidents: Number, diffInNewIncidents: Number }
    rateOfGrowthOfNewIncidents : List  { date: String, incidents: Number, newIncidents: Number, diffInNewIncidents: Number } -> List { date: String, incidents: Number, newIncidents: Number, diffInNewIncidents: Number, rateOfGrowth: Number }
    dayNumber : List { date: String, _: Any, ... } : List { date: String, dayNumber: Number, _: Any, ... }
    addAnnotation : List Annotation -> List { date: String, incident: Number, _: Any } -> List { date: String, incident: Number, annotation: String, _: Any }
  in
    data >> (newIncidents, diffInNewIncidents, rateOfGrowthOfNewIncidents, dayNumber, (addAnnotation notes))
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
            r.newIncidents !== 0
              ? (r.diffInNewIncidents / r.newIncidents) * 100
              : 0
        }
      : {
          ...r,
          rateOfGrowth:
            list[i - 1].diffInNewIncidents !== 0
              ? (r.diffInNewIncidents /
                  list[i - 1].diffInNewIncidents) *
                100
              : 0
        };
  });
};

// getDataOfIncident : List { date: String, incidents: Number, _: Any } -> Maybe String
const getDateOfIncident = list => {
  const a = R.propOr(null)("date")(list.find(r => r.incidents > 0));
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

// getDayNumber : Maybe String -> String -> Maybe Number
const getDayNumber = dateOfFirstIncident => currentDate => {
  if (dateOfFirstIncident === null) return 0;
  const currDate = new Date(currentDate).getTime();
  const firstDate = new Date(dateOfFirstIncident).getTime();
  return currDate >= firstDate
    ? parseInt(
        (new Date(currentDate).getTime() -
          new Date(dateOfFirstIncident).getTime() +
          1) /
          (1000 * 24 * 3600)
      )
    : null;
};

const addAnnotations = annotations => data => {
  return data.map(d => {
    const a = R.filter(a => a.date === d.date)(annotations);
    if (!a.length) return d;
    return { ...d, annotations: R.prop("annotation")(a[0]) };
  });
};

const calculateMetrics = annotations => data => {
  return R.pipe(
    newIncidents,
    diffInNewIncidents,
    rateOfGrowthOfNewIncidents,
    dayNumber,
    addAnnotations(annotations)
  )(data);
};

const getAnnotationForCountry = country => {
  return R.pipe(
    R.filter(a => a.country === country, R.__),
    R.map(R.pick(["date", "annotation"]))
  )(ANNOTATIONS);
};

const computeMetricsForEachCountry = countryData => {
  const annotations = getAnnotationForCountry(countryData.country);
  return {
    country: countryData.country,
    province: countryData.province,
    data: calculateMetrics(annotations)(countryData.data)
  };
};

const computeMetricsForAllCountries = list => {
  const refinedList = mergeCountriesWithProvinces(list);
  return refinedList.map(computeMetricsForEachCountry);
};

const mergeCountriesWithProvinces = list => {
  const excludes = [
    "China",
    "Australia",
    "Canada",
    "United Kingdom",
    "Netherlands",
    "Denmark",
    "France"
  ];
  const a = R.map(a => addUpByCountry(a)(list))(excludes);
  const rest = excludeCountries(excludes)(list);
  return [].concat(rest, ...a);
};

const addUpByCountry = country => list => {
  const a = R.filter(l => l.country === country)(list);
  const b = R.map(l => l.data)(a);
  const c = b.reduce((acc, curr, idx) => {
    return (acc = curr.map((c, i) => {
      return {
        date: c.date,
        incidents: acc[i]
          ? acc[i].incidents + c.incidents
          : c.incidents
      };
    }));
  }, []);
  return [
    {
      data: c,
      country: country,
      province: ""
    }
  ];
};

const excludeCountries = countriesList => list => {
  return list.filter(l => !countriesList.includes(l.country));
};

const getDataFromFile = seriesType => {
  const getFileName = seriesType => `./raw/${seriesType}.json`;
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
  updateCountriesList(getDataFromFile(SERIES_TYPES.CONFIRMED));
  const writeToFile = seriesType => data =>
    fs.writeFileSync(`./metrics/${seriesType}.json`, data);
  R.values(SERIES_TYPES).forEach(type =>
    R.pipe(
      generateMetricsFile,
      JSON.stringify,
      writeToFile(type)
    )(type)
  );
};

run();

/** this area is for testing samples locally */
// const sampleData = JSON.parse(
//   fs.readFileSync("./raw/confirmed.json", "utf-8")
// );
// const f = R.filter(a => a.country == "Korea, South")(sampleData);
// const cdc = R.pipe(
//   R.find(a => a.country === "Korea, South"),
//   computeMetricsForEachCountry,
//   JSON.stringify
// )(sampleData);
// console.log(cdc);
