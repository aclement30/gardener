class GardenerClient {

  init() {
    this.climateDatasets = this.createClimateDatasets(gardenData.logs);
    this.errorDatasets = this.createErrorDatasets(gardenData.logs);
  }

  buildCharts() {
    const climateContext = document.getElementById('climate-chart').getContext('2d');
    this.createClimateChart(climateContext, gardenData.logs);

    const errorContext = document.getElementById('error-chart').getContext('2d');
    this.createErrorsChart(errorContext, gardenData.logs);
  }

  createClimateChart(context) {
    return new Chart(context, {
      type: 'line',
      data: { datasets: this.climateDatasets },
      options: {
        legend: false,
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'series',
            time: {
              unit: this.getChartTimeUnit(),
              displayFormats: {
                hour: 'HH:mm',
                day: 'D MMM',
                month: 'MMM YYYY',
              }
            },
            gridLines: {
              display: false,
            }
          }],
          yAxes: [
            {
              type: 'linear',
              ticks: {
                beginAtZero: true,
                padding: 10,
              },
              gridLines: {
                drawTicks: false,
              },
            }
          ],
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem) => {
              return this.getTooltipDate(tooltipItem[0].xLabel);
            },
            label: (tooltipItem) => {
              if (tooltipItem.datasetIndex === 0) {
                return ` Humidité : ${tooltipItem.yLabel} %`;
              } else {
                return ` Température : ${tooltipItem.yLabel}°C`;
              }
            }
          },
        },
      }
    });
  }

  createErrorsChart(context) {
    return new Chart(context, {
      type: 'scatter',
      data: { datasets: this.errorDatasets },
      options: {
        legend: false,
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'linear',
            time: {
              unit: this.getChartTimeUnit(),
              displayFormats: {
                hour: 'HH:mm',
                day: 'D MMM',
                month: 'MMM YYYY',
              }
            },
            gridLines: {
              display: false,
            }
          }],
          yAxes: [
            {
              type: 'category',
              labels: ['Arrêt urgence', 'Arrêt auto.', 'Écriture', 'Lecture', 'Initialisation'],
              ticks: {
                padding: 10,
              },
              gridLines: {
                drawTicks: false,
              },
            }
          ],
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem) => {
              return this.getTooltipDate(tooltipItem[0].xLabel);
            },
            label: (tooltipItem) => {
              return ' ' + this.errorDatasets[0].data[tooltipItem.index].description;
            }
          },
        },
      },
    });
  }

  createClimateDatasets(logs) {
    const humidityDataset = {
      label: 'Humidité',
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)',
      fill: false,
      data: logs.humidity.map(log => ({ x: new Date(log.timestamp * 1000), y: log.value }))
    };
    const temperatureDataset = {
      label: 'Température',
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgb(255, 159, 64)',
      fill: false,
      data: logs.temperature.map(log => ({x: new Date(log.timestamp * 1000), y: log.value}))
    };

    return [humidityDataset, temperatureDataset];
  }

  createErrorDatasets(logs) {
    const errorDataset = {
      label: 'Erreurs',
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgb(255, 99, 132)',
      fill: false,
      data: logs.errors.map(log => ({ x: new Date(log.timestamp * 1000), y: log.value, description: log.description }))
    };

    return [errorDataset];
  }

  getTooltipDate(date) {
    switch(gardenData.range) {
      case '24h':
        const day = date.toDateString() === new Date().toDateString() ? "Aujourd'hui" : "Hier";
        return `${day}, ${date.toTimeString().substr(0, 5)}`;
      default:
        return date.toDateString();
    }
  }

  getChartTimeUnit() {
    switch(gardenData.range) {
      case '24h':
        return 'hour';
      case '7d':
      case '30d':
        return 'day';
      case '3m':
      case '6m':
        return 'month';
    }
  }
}