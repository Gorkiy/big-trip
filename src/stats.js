import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export const typeToChartLabel = (type) => {
  switch (type) {
    case `Taxi`:
      return `🚕 RIDE`;
    case `Flight`:
      return `✈️ FLY`;
    case `Ship`:
      return `🛳️ SAIL`;
    case `Drive`:
      return `🚗 DRIVE`;
    case `Bus`:
      return `🚗 DRIVE`;
    case `Train`:
      return `🚂 TRAIN`;
    case `Check-in`:
      return `🏨 STAY`;
    case `Sightseeing`:
      return `🏛️ LOOK`;
    default:
      return type + `OTHER`;
  }
};

export const calcTimeSpend = (ms) => {
  return Math.floor(ms / 3600000) % 24;
};

export const chartData = {
  transportLabels: [],
  transportFrequency: [],
  transportChartHeight: 0,
  typeLabels: [],
  cost: [],
  moneyChartHeight: 0,
  timeSpend: [],
};

export const getChartsData = (data) => {
  const transportTypes = new Set([`Taxi`, `Flight`, `Ship`, `Drive`, `Bus`, `Train`]);
  const transportOnlyPoints = data.filter((point) => transportTypes.has(point.type));
  const transporsData = new Map();
  const costData = new Map();
  const timeSpend = new Map();
  let label = ``;
  const BAR_HEIGHT = 55;

  for (const point of transportOnlyPoints) {
    label = typeToChartLabel(point.type);
    if (!transporsData.has(label)) {
      transporsData.set(label, 1);
    } else {
      transporsData.set(label, transporsData.get(label) + 1);
    }
  }

  for (const point of data) {
    label = typeToChartLabel(point.type);
    let price = +point.price;
    if (!costData.has(label)) {
      costData.set(label, price);
      timeSpend.set(label, point.time.timeDifferenceMs);
    } else {
      costData.set(label, costData.get(label) + price);
      timeSpend.set(label, timeSpend.get(label) + point.time.timeDifferenceMs);
    }
  }

  chartData.transportLabels = [...transporsData.keys()];
  chartData.transportFrequency = [...transporsData.values()];
  chartData.typeLabels = [...costData.keys()];
  chartData.cost = [...costData.values()];
  chartData.timeSpend = [...timeSpend.values()].map((ms) => calcTimeSpend(ms));
  chartData.transportChartHeight = BAR_HEIGHT * chartData.transportLabels.length;
  chartData.moneyChartHeight = BAR_HEIGHT * chartData.typeLabels.length;
};

export const chart = {
  transportChart: null,
  moneyChart: null,
  timeChart: null,

  generateTransportChart(container, transportLabels, transportFrequency) {
    this.transportChart = new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: transportLabels,
        datasets: [{
          data: transportFrequency,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
    return this.transportChart;
  },

  generateMoneyChart(container, typeLabels, cost) {
    this.moneyChart = new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: typeLabels,
        datasets: [{
          data: cost,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
    return this.moneyChart;
  },

  generateTimeChart(container, typeLabels, timeSpend) {
    this.timeChart = new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: typeLabels,
        datasets: [{
          data: timeSpend,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });
    return this.moneyChart;
  }
};
