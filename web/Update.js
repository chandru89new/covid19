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
          primary: {
            country: payload.countries[0],
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
            )
          },
          secondary: {
            country: "China",
            newCasesByDay: newCasesByDay("China")(confirmed),
            newCasesByDate: newCasesByDate("China")(confirmed),
            infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
              "China"
            )(confirmed),
            infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
              "China"
            )(confirmed)
          }
        },
        null
      ];
    case Msg.LoadCountriesAndSetCountry:
      return [
        {
          ...model,
          countries: payload.countries,
          primary: {
            country: payload.country.primary,
            infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
              payload.country.primary
            )(confirmed),
            infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
              payload.country.primary
            )(confirmed),
            newCasesByDate: newCasesByDate(payload.country.primary)(
              confirmed
            ),
            newCasesByDay: newCasesByDay(payload.country.primary)(
              confirmed
            )
          },
          secondary: {
            country: payload.country.secondary,
            newCasesByDay: newCasesByDay(payload.country.secondary)(
              confirmed
            ),
            newCasesByDate: newCasesByDate(payload.country.secondary)(
              confirmed
            ),
            infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
              payload.country.secondary
            )(confirmed),
            infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
              payload.country.secondary
            )(confirmed)
          }
        }
      ];
    case Msg.ChangePrimaryCountry:
      return [
        {
          ...model,
          primary: {
            country: payload.country,
            infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
              payload.country
            )(confirmed),
            infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
              payload.country
            )(confirmed),
            newCasesByDate: newCasesByDate(payload.country)(
              confirmed
            ),
            newCasesByDay: newCasesByDay(payload.country)(confirmed)
          }
        },
        null
      ];
    case Msg.ChangeSecondaryCountry:
      return [
        {
          ...model,
          secondary: {
            country: payload.country,
            infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
              payload.country
            )(confirmed),
            infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
              payload.country
            )(confirmed),
            newCasesByDate: newCasesByDate(payload.country)(
              confirmed
            ),
            newCasesByDay: newCasesByDay(payload.country)(confirmed)
          }
        },
        null
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
