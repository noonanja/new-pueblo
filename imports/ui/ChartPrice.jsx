import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs").Bar;

const priceOptions = { scales: {
                          xAxes: [{stacked: true}],
                          yAxes: [{stacked: true}],
                          ticks: {
                            autoSkipPadding: 10,
                          },
                      },
                      responsive: true,
};

export default class ChartPrice extends Component {

  render() {
    return (
      <BarChart data={this.props.data} options={priceOptions} />
  )}
}

ChartPrice.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  data: PropTypes.object.isRequired,
};
