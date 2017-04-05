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
    // create copies of the arrays 
    const passiveValues = this.props.passiveLoad.values.slice(0);
    const activeValues = this.props.activeLoad.values.slice(0);
    let i = 0;
    const totalValues = [];
    for (i = 0; i < passiveValues.length; i++) {
      totalValues.push(passiveValues[i]+activeValues[i]);
    }
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
        borderWidth: 1,
        data: passiveValues,
      }, {
        label: `Aggregate Active Load (n=${this.props.activeLoad.n})`,
        backgroundColor: [
          "#455A64","#455A64","#455A64","#455A64","#455A64","#455A64","#455A64",
          "#455A64","#455A64","#455A64","#455A64","#455A64","#455A64","#455A64",
          "#455A64","#455A64","#455A64","#455A64","#455A64","#455A64","#455A64",
          "#455A64","#455A64","#455A64",
        ],
        borderWidth: 1,
        data: activeValues,
      }, {
        label: `Aggregate Load (n=${this.props.activeLoad.n+this.props.passiveLoad.n})`,
        backgroundColor: [
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56",
        ],
        borderWidth: 1,
        data: totalValues,
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
