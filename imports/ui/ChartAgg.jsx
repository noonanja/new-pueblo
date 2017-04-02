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
  chartAggData() {
    let labels = _.range(1, this.props.activeLoad.length+1);
    let data = this.props.activeLoad;
    return {
      labels: labels,
      datasets: [{
        label: "Aggregate Load",
        borderWidth: 1,
        data: data,
      }]
    }
  }

  render() {
    console.log(this.props.activeLoad);
    return (
      <BarChart data={this.chartAggData()} options={aggOptions} />
    )
  }
}

ChartAgg.propTypes = {
  activeLoad: React.PropTypes.array,
};
