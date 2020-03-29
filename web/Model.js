import Cmd from "./Commands";
const url = new URL(window.location.href);
const country = url.pathname.split("/")[1];
export default [
  {
    countries: [],
    selectedCountry: null,
    newCasesByDate: [],
    newCasesByDay: [],
    infectionsRateOfGrowthByDate: [],
    infectionsRateOfGrowthByDay: [],
    showLogarithmic: false,
    china: {
      newCasesByDate: [],
      newCasesByDay: [],
      infectionsRateOfGrowthByDate: [],
      infectionsRateOfGrowthByDay: []
    }
  },
  country
    ? Cmd.LoadCountriesAndSetCountry({ country })
    : Cmd.GetCountries()
];
