import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs").Bar;


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
  render() {
    return (
      <BarChart data={this.props.data} options={aggOptions} />
  )}
}

ChartAgg.propTypes = {
  data: PropTypes.object.isRequired,
};
