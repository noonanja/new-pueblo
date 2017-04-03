import React, { Component, PropTypes } from 'react';

const DoughnutChart = require('react-chartjs-2').Doughnut;

const aggOptions = { animation: {
                      animateScale: true,
                    }
                  }

export default class ChartUsers extends Component {
  chartData() {
    const userTypes = this.props.userTypes;
    console.log(userTypes);
    return {
        labels: [
            "Red",
            "Blue",
            "Yellow"
        ],
        datasets: [
            {
                data: [userTypes[0],
                       userTypes[0] - userTypes[1],
                       userTypes[1] - userTypes[2]],
                backgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#36A2EB",
                    "#FFCE56"
                ]
            }]
    };
  }

  render() {
    return (
      <DoughnutChart data={this.chartData()} options={aggOptions} />
    )
  }
}

ChartUsers.propTypes = {
  userTypes: React.PropTypes.array,
};
