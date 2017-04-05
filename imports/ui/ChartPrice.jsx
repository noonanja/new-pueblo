import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs-2").Bar;

import { gridPrices } from '../api/loads/hourlyStats.js';

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
  chartPriceData() {
    const passiveValues = this.props.passiveValues;
    const activeValues = this.props.activeValues;
    console.log(activeValues);
    const initialPrices = [];
    const finalPrices = [];
    for (var i = 0; i < activeValues.length; i++) {
      finalPrices.push((Math.pow(passiveValues[i]+parseFloat(activeValues[i]),2)*gridPrices[i+1]).toFixed(2));
    }
    i = 0;
    while(i < passiveValues.length) {
      initialPrices[i] = parseFloat(Math.pow(passiveValues[i],2)*gridPrices[i+1]).toFixed(2);
      i++;
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
