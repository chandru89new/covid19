import Cmd from "./Commands";
const url = new URL(window.location.href);
const country = url.pathname.split("/").splice(1);
console.log(country);
export default [
  {
    countries: [],
    selectedCountry: null,
    primary: {
      country: "",
      newCasesByDate: [],
      newCasesByDay: [],
      infectionsRateOfGrowthByDate: [],
      infectionsRateOfGrowthByDay: []
    },
    showLogarithmic: false,
    secondary: {
      country: "",
      newCasesByDate: [],
      newCasesByDay: [],
      infectionsRateOfGrowthByDate: [],
      infectionsRateOfGrowthByDay: []
    }
  },
  country && country.length
    ? Cmd.LoadCountriesAndSetCountry({
        country: { primary: country[0], secondary: country[1] }
      })
    : Cmd.GetCountries()
];
