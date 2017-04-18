import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DoughnutChart = require('react-chartjs-2').Doughnut;

const aggOptions = { animation: {
                      animateScale: true,
                    },
                    // title: {
                    //   text: "Active Users",
                    //   fontSize: 16,
                    //   display: true,
                    // },
                    legend: {
                      position: 'right',
                    }
                  }

export default class ChartUsers extends Component {
  chartData() {
    const userTypes = this.props.userTypes;
    return {
        labels: [
            "Generator-Storers",
            "Storers",
            "Generators",
            "Passive",
        ],
        datasets: [
            {
                data: [userTypes[0],
                       userTypes[1] - userTypes[0],
                       userTypes[2] - userTypes[1],
                       this.props.userCount - userTypes[2],
                      ],
                backgroundColor: [
                    "#FF6384",
                    "#FFCE56",
                    "#36A2EB",
                    "#ddd9d3",
                ],
                hoverBackgroundColor: [
                    "#FF6384",
                    "#FFCE56",
                    "#36A2EB",
                    "#ddd9d3",
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
  userTypes: PropTypes.array,
  userCount: PropTypes.number,
};
