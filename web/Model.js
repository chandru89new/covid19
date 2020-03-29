import Cmd from "./Commands";
const url = new URL(window.location.href);
const country = url.pathname.split("/").splice(1);
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
    },
    annotations: {
      newCasesByDay: []
    }
  },
  country && country.length === 2
    ? Cmd.LoadCountriesAndSetCountry({
        country: {
          primary: window.decodeURI(country[0]),
          secondary: window.decodeURI(country[1])
        }
      })
    : Cmd.LoadCountriesAndSetCountry({
        country: { primary: "India", secondary: "China" }
      })
];
