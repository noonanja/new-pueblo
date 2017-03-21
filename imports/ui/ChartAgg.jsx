import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs").Bar;


const aggOptions = { scales:
                  {
                    xAxes: [{stacked: true}],
                    yAxes: [{stacked: true}]
                  },
                  responsive: true,
              };

export default class ChartAgg extends Component {
  render() {
    return (
      <BarChart data={this.props.data} options={aggOptions}  />
  )}
}

ChartAgg.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  data: PropTypes.object.isRequired,
};
