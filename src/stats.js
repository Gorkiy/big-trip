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

export const chart = {
  transportChart: null,
  moneyChart: null,

  generateTransportChart(container, transportLabels, transportFreq) {
    this.transportChart = new Chart(container, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: transportLabels,
        datasets: [{
          data: transportFreq,
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
  }
};
