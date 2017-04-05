import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs-2").Bar;

const aggOptions = { scales: {
                  // xAxes: [{
                  //   stacked: true,
                  //   ticks: {
                  //     autoSkipPadding: 60,
                  //   }
                  // }],
                  // yAxes: [{
                  //   stacked: true
                  // }],
                    },
                    responsive: true,
                  };

export default class ChartAgg extends Component {
  chartAggData() {
    const passiveValues = this.props.passiveLoad.values;
    const activeValues = this.props.activeLoad.values;
    let i = 0;
    while(i < passiveValues.length) {
      passiveValues[i] = parseFloat(passiveValues[i]).toFixed(2);
      i++;
    }
    i = 0;
    while(i < activeValues.length) {
      activeValues[i] = parseFloat(activeValues[i]).toFixed(2);
      i++;
    }
    const labels = _.range(1, passiveValues.length+1);
    return {
      labels: labels,
      datasets: [{
        label: `Aggregate Passive Load (n=${this.props.passiveLoad.n})`,
        backgroundColor: [
          "#455A64","#455A64","#455A64","#455A64","#455A64","#455A64","#455A64",
          "#455A64","#455A64","#455A64","#455A64","#455A64","#455A64","#455A64",
          "#455A64","#455A64","#455A64","#455A64","#455A64","#455A64","#455A64",
          "#455A64","#455A64","#455A64",
        ],
        borderWidth: 1,
        data: passiveValues,
      }, {
        label: `Aggregate Active Load (n=${this.props.activeLoad.n})`,
        backgroundColor: [
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56",
        ],
        borderWidth: 1,
        data: activeValues,
      }]
    }
  }

  render() {
    return (
      <BarChart data={this.chartAggData()} options={aggOptions} />
    )
  }
}

ChartAgg.propTypes = {
  passiveLoad: React.PropTypes.object,
  activeLoad: React.PropTypes.object,
};
