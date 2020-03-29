import * as R from "ramda";

export const infectionsRateOfGrowthByDate = country => rawData => {
  const match = country => object => object.country === country;
  const makeHCSeries = r => [
    new Date(r.date).getTime(),
    r.rateOfGrowth
  ];
  const makeSeries = rawData => ({
    name: R.prop("country")(rawData),
    data: R.propOr([])("data")(rawData).map(makeHCSeries)
  });
  return R.pipe(R.find(match(country)), makeSeries)(rawData);
};

export const infectionsRateOfGrowthByDay = country => rawData => {
  const match = country => object => object.country === country;
  const removeNulls = o => o.dayNumber !== null;
  const makeHCSeries = r => [r.dayNumber, r.rateOfGrowth];
  const makeSeries = rawData => ({
    name: R.prop("country")(rawData),
    data: R.propOr([])("data")(rawData)
      .filter(removeNulls)
      .map(makeHCSeries)
  });
  return R.pipe(R.find(match(country)), makeSeries)(rawData);
};

export const newCasesByDate = country => rawData => {
  const match = country => object => object.country === country;
  const makeHCSeries = r => [
    new Date(r.date).getTime(),
    r.newIncidents
  ];
  const makeSeries = rawData => ({
    name: R.prop("country")(rawData),
    data: R.propOr([])("data")(rawData).map(makeHCSeries)
  });
  return R.pipe(R.find(match(country)), makeSeries)(rawData);
};

export const newCasesByDay = country => rawData => {
  const match = country => object => object.country === country;
  const removeNulls = o => o.dayNumber !== null;
  const makeHCSeries = r => [r.dayNumber, r.newIncidents];
  const makeSeries = rawData => ({
    name: R.prop("country")(rawData),
    data: R.propOr([])("data")(rawData)
      .filter(removeNulls)
      .map(makeHCSeries)
  });
  return R.pipe(R.find(match(country)), makeSeries)(rawData);
};

export const getChartDefaults = model => ({
  chart: {
    type: "line"
  },
  title: {
    enabled: false,
    text: ""
  },
  xAxis: {
    // type: "datetime",
    // tickInterval: 7 * 24 * 3600 * 1000
  },
  yAxis: [
    {
      min: !model.showLogarithmic ? 0 : null,
      type: model.showLogarithmic ? "logarithmic" : "linear",
      title: { text: "Numbers" },
      allowNegativeLog: true
    }
    // {
    //   type: model.showLogarithmic ? "logarithmic" : "linear",
    //   opposite: true,
    //   title: { text: "Numbers" },
    //   allowNegativeLog: true
    // }
  ],
  credits: {
    enabled: false
  },
  tooltip: {
    shared: true,
    pointFormatter() {
      return `---<br/><b>${
        this.series.name
      }</b>: ${new Intl.NumberFormat("en-US").format(this.y)}<br/>`;
    }
  },
  plotOptions: {
    series: {
      marker: {
        radius: 1
      }
    }
  }
});

export const allowNegativeLog = H => {
  {
    H.addEvent(H.Axis, "afterInit", function() {
      const logarithmic = this.logarithmic;

      if (logarithmic && this.options.allowNegativeLog) {
        // Avoid errors on negative numbers on a log axis
        this.positiveValuesOnly = false;

        // Override the converter functions
        logarithmic.log2lin = num => {
          const isNegative = num < 0;

          let adjustedNum = Math.abs(num);

          if (adjustedNum < 10) {
            adjustedNum += (10 - adjustedNum) / 10;
          }

          const result = Math.log(adjustedNum) / Math.LN10;
          return isNegative ? -result : result;
        };

        logarithmic.lin2log = num => {
          const isNegative = num < 0;

          let result = Math.pow(10, Math.abs(num));
          if (result < 10) {
            result = (10 * (result - 1)) / (10 - 1);
          }
          return isNegative ? -result : result;
        };
      }
    });
  }
};

export const filterCountries = R.curry((filterList, countries) =>
  countries.filter(country => !filterList.includes(country))
);
