import React, { Component, PropTypes } from 'react';

const BarChart = require("react-chartjs-2").Bar;

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
    const values = this.props.passiveLoad.values;
    const labels = _.range(1, values.length+1);
    let i = 0;
    while(i < values.length) {
      values[i] = parseFloat(values[i]).toFixed(2);
      i++;
    }
    return {
      labels: labels,
      datasets: [{
        label: `Aggregate Passive Load (n=${this.props.passiveLoad.n})`,
        borderWidth: 1,
        data: values,
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
  passiveLoad: React.PropTypes.object,
  // activeLoad: React.PropTypes.object,
};
