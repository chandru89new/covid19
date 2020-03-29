const R = require("ramda");
const fs = require("fs");

/**elm pseudo
type alias Country = String
type alias Countries = List Country
type alias RawData = List SeriesData
type alias SeriesData = { country: String, province: Maybe String, [Any]: Any }

updateCountriesList : RawData -> ()
updateCountriesList rawData =
  let
    d = getCountriesList rawData
  in
    fs.writeFileSync(d)

getCountriesList : RawData -> Countries
getCountriesList data =
  rawData >> (extractCountries, getUnique)

extractCountries : RawData -> Countries
extractCountries rawData =
  List.map (\x -> x.country) rawData

getUnique : Countries -> Countries
getUnique countries =
  R.uniq countries
*/

const getCountriesList = rawData => {
  return R.pipe(extractCountries, R.uniq)(rawData);
};

const extractCountries = rawData => {
  return R.map(R.prop("country"), rawData);
};

const updateCountriesList = rawData => {
  const partialWrite = R.partial(fs.writeFileSync, [
    "./metrics/countries.json"
  ]);
  const a = R.pipe(
    getCountriesList,
    JSON.stringify,
    partialWrite
  )(rawData);
  return a;
};

module.exports = { updateCountriesList };
