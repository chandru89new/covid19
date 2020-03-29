import Msg from "./Msgs";
import Cmd from "./Commands";
import confirmed from "./metrics/confirmed.json";
import {
  infectionsRateOfGrowthByDate,
  infectionsRateOfGrowthByDay,
  newCasesByDate,
  newCasesByDay,
  filterCountries
} from "./helpers";
export default msg => payload => model => {
  switch (msg) {
    case Msg.CountriesLoaded:
      return [
        {
          ...model,
          countries: payload.countries,
          selectedCountry: payload.countries[0],
          infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
            payload.countries[0]
          )(confirmed),
          infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
            payload.countries[0]
          )(confirmed),
          newCasesByDate: newCasesByDate(payload.countries[0])(
            confirmed
          ),
          newCasesByDay: newCasesByDay(payload.countries[0])(
            confirmed
          ),
          china: {
            newCasesByDay: newCasesByDay("China")(confirmed),
            newCasesByDate: newCasesByDate("China")(confirmed)
          }
        },
        null
      ];
    case Msg.LoadCountriesAndSetCountry:
      return [
        {
          ...model,
          countries: payload.countries,
          selectedCountry: payload.country,
          infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
            payload.country
          )(confirmed),
          infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
            payload.country
          )(confirmed),
          newCasesByDate: newCasesByDate(payload.country)(confirmed),
          newCasesByDay: newCasesByDay(payload.country)(confirmed),
          china: {
            newCasesByDay: newCasesByDay("China")(confirmed),
            newCasesByDate: newCasesByDate("China")(confirmed)
          }
        }
      ];
    case Msg.ChangeCountry:
      return [
        {
          ...model,
          selectedCountry: payload.country,
          infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
            payload.country
          )(confirmed),
          infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
            payload.country
          )(confirmed),
          newCasesByDate: newCasesByDate(payload.country)(confirmed),
          newCasesByDay: newCasesByDay(payload.country)(confirmed)
        },
        Cmd.SetCountryAsPath({ country: payload.country })
      ];
    case Msg.ToggleLogScale:
      return [
        {
          ...model,
          showLogarithmic: payload.value
        },
        null
      ];
    default:
      return [model, null];
  }
};
