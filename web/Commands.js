import Msg from "./Msgs";
import countries from "./metrics/countries.json";
const GetCountries = () => dispatch => {
  return dispatch(Msg.CountriesLoaded)({ countries });
};

const LoadCountriesAndSetCountry = ({ country }) => dispatch => {
  return dispatch(Msg.LoadCountriesAndSetCountry)({
    countries,
    country
  });
};

const SetCountryAsPath = ({ country }) => dispatch => {
  console.log({ ...country });
  history.pushState(
    null,
    "index",
    `/${country.primary}/${country.secondary}`
  );
};

export default {
  GetCountries,
  LoadCountriesAndSetCountry,
  SetCountryAsPath
};
