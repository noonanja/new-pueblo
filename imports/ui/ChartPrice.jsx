import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs-2").Bar;

import { gridK } from '../api/loads/hourlyStats.js';

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

export default class ChartPrice extends Component {
  gridCost(value, i) {
    return (Math.pow(value/1000, 2) * gridK[i]).toFixed(2);
  }

  chartPriceData() {
    const passiveValues = this.props.passiveValues.slice(0);
    const initialPrices = [];
    let i = 0;
    while(i < passiveValues.length) {
      initialPrices[i] = this.gridCost(passiveValues[i], i+1);
      i++;
    }
    const finalPrices = [];
    const activeValues = this.props.activeValues.slice(0);
    for (i = 0; i < activeValues.length; i++) {
      finalPrices.push(this.gridCost(passiveValues[i]+activeValues[i], i+1));
    }
    const labels = _.range(1, passiveValues.length+1);
    return {
      labels: labels,
      datasets: [{
        label: `Initial Prices`,
        borderWidth: 1,
        data: initialPrices,
      }, {
        label: `Final Prices`,
        backgroundColor: [
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56",
        ],
        borderWidth: 1,
        data: finalPrices,
      }]
    }
  }

  render() {
    return (
      <BarChart data={this.chartPriceData()} options={aggOptions} />
    )
  }
}

ChartPrice.propTypes = {
  passiveValues: React.PropTypes.arrayOf(React.PropTypes.number),
  activeValues: React.PropTypes.arrayOf(React.PropTypes.number),
};
