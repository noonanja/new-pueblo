import React, { Component } from 'react';
import PropTypes from 'prop-types';

const BarChart = require("react-chartjs-2").Bar;

import { gridK } from '../../api/loads/hourlyStats.js';

const aggOptions = { responsive: true, };

export default class ChartPrice extends Component {
  costPerKwH(value, h) {
    return (value * gridK[h]).toFixed(5);
  }

  chartPriceData() {
    const initialValues = this.props.initialValues.slice(0);
    const initialPrices = [];
    for (i = 0; i < initialValues.length; i++) {
      initialPrices.push(this.costPerKwH(initialValues[i], i+1));
    }

    const finalPassiveValues = this.props.finalPassiveValues.slice(0);
    const finalActiveValues = this.props.finalActiveValues.slice(0);
    const finalPrices = [];
    for (i = 0; i < finalActiveValues.length; i++) {
      finalPrices.push(this.costPerKwH(finalPassiveValues[i]+finalActiveValues[i], i+1));
    }
    const labels = _.range(1, initialValues.length+1);
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
  initialValues: PropTypes.arrayOf(PropTypes.number),
  finalActiveValues: PropTypes.arrayOf(PropTypes.number),
  finalPassiveValues: PropTypes.arrayOf(PropTypes.number),
};
