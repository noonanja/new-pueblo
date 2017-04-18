import React, { Component } from 'react';
import PropTypes from 'prop-types';

const BarChart = require("react-chartjs-2").Bar;

const aggOptions = { responsive: true, };

export default class ChartAgg extends Component {
  chartAggData() {
    // create copies of the arrays
    const initialValues = this.props.initialLoad.values.slice(0);
    const passiveValues = this.props.passiveLoad.values.slice(0);
    const activeValues = this.props.activeLoad.values.slice(0);
    let i = 0;
    while(i < initialValues.length) {
      initialValues[i] = (initialValues[i]).toFixed(2);
      i++;
    }
    i = 0;
    const finalValues = [];
    while(i < activeValues.length) {
      finalValues.push((activeValues[i] + passiveValues[i]).toFixed(2));
      i++;
    }
    const labels = _.range(1, initialValues.length+1);
    return {
      labels: labels,
      datasets: [{
        label: `Aggregate Initial Load (${this.props.initialLoad.n} passive users)`,
        borderWidth: 1,
        data: initialValues,
      }, {
        label: `Aggregate Final Load (${this.props.activeLoad.n} active, ${this.props.passiveLoad.n} passive)`,
        backgroundColor: [
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56","#FFCE56",
          "#FFCE56","#FFCE56","#FFCE56",
        ],
        borderWidth: 1,
        data: finalValues,
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
  initialLoad: PropTypes.object,
  passiveLoad: PropTypes.object,
  activeLoad: PropTypes.object,
};
