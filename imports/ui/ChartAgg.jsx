import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs-2").Bar;

const aggOptions = { responsive: true, };

export default class ChartAgg extends Component {
  chartAggData() {
    // create copies of the arrays
    const initialValues = this.props.initialLoad.slice(0);
    const finalValues = [];
    // const finalValues = this.props.finalLoad.values.slice(0);
    let i = 0;
    while(i < initialValues.length) {
      initialValues[i] = (initialValues[i]).toFixed(2);
      i++;
    }
    i = 0;
    // while(i < finalValues.length) {
    //   finalValues[i] = (finalValues[i]).toFixed(2);
    //   i++;
    // }
    const labels = _.range(1, initialValues.length+1);
    return {
      labels: labels,
      datasets: [{
        label: `Aggregate Initial Load (0 active users)`,
        borderWidth: 1,
        data: initialValues,
      }, {
        label: `Aggregate Final Load (n=//)`,
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
  initialLoad: React.PropTypes.arrayOf(React.PropTypes.number),
  // finalLoad: React.PropTypes.object,
};
