import h from "virtual-dom/h";
import hh from "hyperscript-helpers";
const { div, label, select, option, pre, input, span, br } = hh(h);
import Highcharts from "highcharts";
import annotations from "highcharts/modules/annotations-advanced";
annotations(Highcharts);
import Msg from "./Msgs";
import { getChartDefaults, allowNegativeLog } from "./helpers";
allowNegativeLog(Highcharts);

const renderGrowthByDateChart = model => {
  const hasElem = document.getElementById("growthByDate");
  if (!hasElem) return;
  return new Highcharts.chart("growthByDate", {
    ...getChartDefaults(model),
    xAxis: {
      type: "datetime",
      tickInterval: 7 * 24 * 3600 * 1000
    },
    yAxis: {
      ...getChartDefaults(model).yAxis[0],
      title: { text: "Percent" },
      min: null
    },
    series: [
      model.primary.infectionsRateOfGrowthByDate,
      model.secondary.infectionsRateOfGrowthByDate
    ]
  });
};
const renderNewCasesByDateChart = model => {
  const hasElem = document.getElementById("newCasesByDate");
  if (!hasElem) return;
  return new Highcharts.chart("newCasesByDate", {
    ...getChartDefaults(model),
    xAxis: {
      type: "datetime",
      tickInterval: 7 * 24 * 3600 * 1000
    },
    annotations: [
      {
        draggable: false,
        labelOptions: {
          allowOverlap: true,
          shape: "connector",
          align: "right",
          justify: true,
          crop: false,
          style: {
            fontSize: "0.8em",
            textOutline: "1px white",
            width: 100
          }
        },
        labels: [].concat(
          model.primary.annotations.newCasesByDate,
          model.secondary.annotations.newCasesByDate
        )
      }
    ],
    series: [
      model.primary.newCasesByDate,
      model.secondary.newCasesByDate
    ]
  });
};
const renderNewCasesByDayChart = model => {
  const hasElem = document.getElementById("newCasesByDay");
  if (!hasElem) return;
  return new Highcharts.chart("newCasesByDay", {
    ...getChartDefaults(model),
    tooltip: {
      ...getChartDefaults(model).tooltip,
      headerFormat: `<span style="font-size: 10px">Day {point.key}</span> <br />`
    },
    annotations: [
      {
        draggable: false,
        labelOptions: {
          allowOverlap: true,
          shape: "connector",
          align: "right",
          justify: true,
          crop: false,
          style: {
            fontSize: "0.8em",
            textOutline: "1px white",
            width: 100
          }
        },
        labels: [].concat(
          model.primary.annotations.newCasesByDay,
          model.secondary.annotations.newCasesByDay
        )
      }
    ],
    series: [
      model.primary.newCasesByDay,
      model.secondary.newCasesByDay
    ]
  });
};
const renderGrowthByDayChart = model => {
  const hasElem = document.getElementById("growthByDay");
  if (!hasElem) return;
  return new Highcharts.chart("growthByDay", {
    ...getChartDefaults(model),
    tooltip: {
      headerFormat: `<span style="font-size: 10px">Day {point.key}</span> <br />`
    },
    yAxis: {
      ...getChartDefaults(model).yAxis[0],
      title: { text: "Percent" }
    },
    series: [
      model.primary.infectionsRateOfGrowthByDay,
      model.secondary.infectionsRateOfGrowthByDay
    ]
  });
};

const viewNewCasesByDate = dispatch => model => {
  renderNewCasesByDateChart(model);
  return div(".mt-5.p-5.border.rounded", [
    div(".font-bold.mb-5.text-center.pt-5.mb-5", "New Cases By Date"),
    div("#newCasesByDate")
  ]);
};

const viewNewCasesByDay = dispatch => model => {
  renderNewCasesByDayChart(model);
  return div(".mt-5.p-5.border.rounded", [
    div(".font-bold.mb-5.text-center.pt-5.mb-5", "New Cases By Day"),
    div("#newCasesByDay")
  ]);
};

const viewGrowthRateChart = dispatch => model => {
  renderGrowthByDateChart(model);
  return div(".mt-5.p-5.border.rounded", [
    div(
      ".font-bold.mb-5.text-center.pt-5.mb-5",
      "Rate of new confirmed cases"
    ),
    div("#growthByDate")
  ]);
};
const viewGrowthRateByDayNumber = dispatch => model => {
  renderGrowthByDayChart(model);
  return div(".mt-5.p-5.border.rounded", [
    div(
      ".font-bold.mb-5.text-center.pt-5.mb-5",
      "Rate of new confirmed cases by day number"
    ),
    div("#growthByDay")
  ]);
};

const viewLogOption = dispatch => model => {
  return div(".my-5", [
    input({
      type: "checkbox",
      onchange: e =>
        dispatch(Msg.ToggleLogScale)({ value: e.target.checked })
    }),
    label(".ml-3", "Logarithmic")
  ]);
};

export default dispatch => model => {
  window.onpopstate = ev => {
    const country = new URL(window.location.href).pathname.split(
      "/"
    )[1];
    dispatch(Msg.ChangeCountry)({ country });
  };
  return div([
    div(".font-bold.text-xl.border-b.border-gray-200.pb-3.mb-5", [
      span("Covid-19 "),
      select(
        {
          className: "ml-2",
          onchange: e =>
            dispatch(Msg.ChangePrimaryCountry)({
              country: e.target.value
            })
        },
        model.countries.map(country =>
          option(
            {
              value: country,
              selected: model.primary.country == country
            },
            country
          )
        )
      ),
      span(" – "),
      select(
        {
          className: "ml-2",
          onchange: e =>
            dispatch(Msg.ChangeSecondaryCountry)({
              country: e.target.value
            })
        },
        model.countries.map(country =>
          option(
            {
              value: country,
              selected: model.secondary.country == country
            },
            country
          )
        )
      )
    ]),
    viewLogOption(dispatch)(model),
    viewNewCasesByDay(dispatch)(model),
    viewNewCasesByDate(dispatch)(model),
    viewGrowthRateChart(dispatch)(model),
    // viewGrowthRateByDayNumber(dispatch)(model),
    div(".text-xs.mt-5", [
      `*The data starts from 22nd January, which is much later from the time China started recording the cases.`,
      br(),
      ` So, Day 1 for China is not really Day 1.`
    ]),
    pre(".text-xs.mt-10", JSON.stringify(model, null, 2))
  ]);
};
