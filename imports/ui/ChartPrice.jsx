import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs-2").Bar;

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
  data: PropTypes.object.isRequired,
};
