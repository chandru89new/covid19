import Msg from "./Msgs";
import Cmd from "./Commands";
import confirmed from "./metrics/confirmed.json";
import {
  infectionsRateOfGrowthByDate,
  infectionsRateOfGrowthByDay,
  newCasesByDate,
  newCasesByDay,
  createAnnotationsByType
} from "./helpers";

const annotateNewCasesByDay = createAnnotationsByType("dayNumber");
const annotateNewCasesByDate = createAnnotationsByType("date");

export default msg => payload => model => {
  switch (msg) {
    case Msg.CountriesLoaded:
      return [
        {
          ...model,
          countries: payload.countries,
          primary: {
            annotations: {
              newCasesByDay: annotateNewCasesByDay("India")(
                confirmed
              ),
              newCasesByDate: annotateNewCasesByDate("India")(
                confirmed
              )
            },
            country: "India",
            infectionsRateOfGrowthByDate: infectionsRateOfGrowthByDate(
              "India"
            )(confirmed),
            infectionsRateOfGrowthByDay: infectionsRateOfGrowthByDay(
              "India"
            )(confirmed),
            newCasesByDate: newCasesByDate("India")(confirmed),
            newCasesByDay: newCasesByDay("India")(confirmed)
          },
          secondary: {
            annotations: {
              newCasesByDay: annotateNewCasesByDay("China")(
                confirmed
              ),
              newCasesByDate: annotateNewCasesByDate("China")(
                confirmed
              )
            },
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
            annotations: {
              newCasesByDay: annotateNewCasesByDay(
                payload.country.primary
              )(confirmed),
              newCasesByDate: annotateNewCasesByDate(
                payload.country.primary
              )(confirmed)
            },
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
            annotations: {
              newCasesByDay: annotateNewCasesByDay(
                payload.country.secondary
              )(confirmed),
              newCasesByDate: annotateNewCasesByDate(
                payload.country.secondary
              )(confirmed)
            },
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
        },
        Cmd.SetCountryAsPath({ country: payload.country })
      ];
    case Msg.ChangePrimaryCountry:
      return [
        {
          ...model,
          primary: {
            country: payload.country,
            annotations: {
              newCasesByDay: annotateNewCasesByDay(payload.country)(
                confirmed
              )
            },
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
        Cmd.SetCountryAsPath({
          country: {
            primary: payload.country,
            secondary: model.secondary.country
          }
        })
      ];
    case Msg.ChangeSecondaryCountry:
      return [
        {
          ...model,
          secondary: {
            country: payload.country,
            annotations: {
              newCasesByDay: annotateNewCasesByDay(payload.country)(
                confirmed
              )
            },
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
        Cmd.SetCountryAsPath({
          country: {
            primary: model.secondary.country,
            secondary: payload.country
          }
        })
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
