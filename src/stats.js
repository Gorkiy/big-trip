import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// export const getDefaultDateRange = () => {
//   let fromDate = new Date();
//   let dueDate = new Date();
//   const daysOverMonday = fromDate.getDay() - 1;
//   const daysBeforeSunday = 7 - fromDate.getDay();
//
//   fromDate.setDate(fromDate.getDate() - daysOverMonday);
//   dueDate.setDate(dueDate.getDate() + daysBeforeSunday);
//   return [fromDate, dueDate];
// };

export const chart = {
  colorChart: null,
  tagsChart: null,

  generateColorsChart(container, colorLabels, colorRepeats, hexColors) {
    this.colorChart = new Chart(container, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: colorLabels,
        datasets: [{
          data: colorRepeats,
          backgroundColor: hexColors
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: COLORS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
    return this.colorChart;
  },

  generateTagsChart(container, tags, tagRepeats) {
    this.tagsChart = new Chart(container, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: tags,
        datasets: [{
          data: tagRepeats,
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
    return this.tagsChart;
  }
};
