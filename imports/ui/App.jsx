import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

// to use react-meteor-data (allowing us to use data from a Meteor collection
// inside a React component), we need to wrap our component in a container using
// the createContainer Higher Order Component
import { createContainer } from 'meteor/react-meteor-data';
import { AggLoads } from '../api/loads/aggLoads.js';

import ChartAgg from './ChartAgg.jsx';
import ChartPrice from './ChartPrice.jsx';


import Range from 'rc-slider/lib/Range';
import Slider from 'rc-slider';
const Handle = Slider.Handle;
const Tooltip = require('rc-tooltip');
import 'rc-slider/assets/index.css';

// const activeMax = 180;
// const defaultUserTypes= [40, 80, 120];
// const defaultStep = 5
const activeMax = 8;
const defaultUserTypes= [2, 4, 6];
const defaultStep = 2
const marks = {0: '0'};
marks[activeMax]= `${activeMax}`;

const defaultRequirements = 12
    , defaultCEfficiency = 1
    , defaultDEfficiency = 2
    , defaultCapacity = 3
    , defaultMaxChargeRate = 4
    , defaultLeakRate = 5
    , defaultMaxHourlyProduction = 6
    , defaultMaxDailyProduction = 7;

const hourLabels = _.range(1,25);

const priceData = {
    labels: hourLabels,
    datasets: [
        {
            label: "Price per kWh",
            borderWidth: 1,
            data: [400, 380, 370, 370, 325, 390, 400, 405, 404, 420, 421, 420, 480,
            520, 522, 603, 690, 725, 780, 781, 680, 680, 603, 425],
            // xAxisID: "hour",
            // yAxisID: "$/ kWh",
        }
    ]
};

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userTypes: defaultUserTypes,
      requirements: defaultRequirements,
      cEfficiency: defaultCEfficiency,
      dEfficiency: defaultDEfficiency,
      capacity: defaultCapacity,
      maxChargeRate: defaultMaxChargeRate,
      leakRate: defaultLeakRate,
      maxHourlyProduction: defaultMaxHourlyProduction,
      maxDailyProduction: defaultMaxDailyProduction,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handle(props) {
    const {value, dragging, index, ...restProps} = props;
    const userValue = index==0 ? ` Generator-Storers: ${value} ` :
                     (index==1 ? ` Storers: ${value - this.state.userTypes[index-1]} ` :
                                 ` Generators: ${value - this.state.userTypes[index-1]} `);
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={userValue}
        placement="top"
        key={index}
      >
      <Handle {...restProps} />
      </Tooltip>
    )
  }

  updateTipValues(values) {
    this.setState({
      userTypes: values,
    });
  }

  renderRange() {
    return (
        <div className="range">
        <Range
          handle= {this.handle.bind(this)} onChange= {this.updateTipValues.bind(this)}
          ref= "range" min={0} max={activeMax} pushable={true}
          defaultValue={defaultUserTypes} step={defaultStep} included={false} marks ={marks} />
        </div>
    )
  }

  renderRequirements() {
    return (
      <label className="mean-daily">
        <p>Mean Daily User Energy Requirements</p>
        <input type="number" step="2" value={this.state.requirements} required
        min={defaultRequirements-4} max={defaultRequirements+4}
        name= "requirements" onChange={this.handleChange} /> kWh
      </label>
    )
  }

  renderStorage() {
    return (
      <div>
        <div className="row">
          <label className="one-half column energyStorage">
            <p>Charge Efficiency</p>
            <input type="number" step="2" value={this.state.cEfficiency} required
            min={defaultCEfficiency-4} max={defaultCEfficiency+4}
            name= "cEfficiency" onChange={this.handleChange} /> %
          </label>

          <label className="one-half column energyStorage">
            <p>Discharging Efficiency</p>
            <input type="number" step="2" value={this.state.dEfficiency} required
            min={defaultDEfficiency-4} max={defaultDEfficiency+4}
            name= "dEfficiency" onChange={this.handleChange} /> %
          </label>
        </div>
        <div className="row">
          <label className="one-half column energyStorage">
            <p>Capacity</p>
            <input type="number" step="2" value={this.state.capacity} required
            min={defaultCapacity-4} max={defaultCapacity+4}
            name= "capacity" onChange={this.handleChange} /> kWh
          </label>

          <label className="one-half column energyStorage">
            <p>Max Charge Rate</p>
            <input type="number" step="2" value={this.state.maxChargeRate} required
            min={defaultMaxChargeRate-4} max={defaultMaxChargeRate+4}
            name= "maxChargeRate" onChange={this.handleChange} /> kWh per hour
          </label>
        </div>
        <div className="row">
          <label className="energyStorage">
            <p>Leakage Rate</p>
            <input type="number" step="2" value={this.state.leakRate} required
            min={defaultLeakRate-4} max={defaultLeakRate+4}
            name= "leakRate" onChange={this.handleChange} /> %
          </label>
        </div>
      </div>
    )
  }

  renderProduction() {
    return (
      <div>
          <div className="row">
            <label>
              <p>Max Hourly Production</p>
              <input type="number" step="2" value={this.state.maxHourlyProduction} required
              min={defaultMaxHourlyProduction-4} max={defaultMaxHourlyProduction+4}
              name= "maxHourlyProduction" onChange={this.handleChange} /> kWh
            </label>
          </div>
          <div className="row">
            <label>
              <p>Max Daily Production</p>
              <input type="number" step="2" value={this.state.maxDailyProduction} required
              min={defaultMaxDailyProduction-4} max={defaultMaxDailyProduction+4}
              name= "maxDailyProduction" onChange={this.handleChange} dir="rtl"/> kWh
            </label>
          </div>
      </div>
    )
  }

  renderChartAgg() {
    let aggData = this.props.activeLoad;
    console.log(aggData);
    let data = {
      labels: hourLabels,
      datasets: [{
        label: "Aggregate Load",
        borderWidth: 1,
        data: aggData,
      }]
    }
    return <ChartAgg data={data}/>
  }

  renderChartPrice() {
    return <ChartPrice data={priceData}/>
  }

  handleChange(event) {
    const target = event.target;
    const value = parseInt(target.value);
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    Meteor.call('users.simulate', this.state, (err, res) => {
      if (err) {
        alert(err);
      }
    });
  }

  renderSubmit() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" id="run" className="u-pull-right" value="run" />
      </form>
    )
  }

  renderLoading() {
    return (<div>loading</div>)
  }

  renderSimulate() {
    return this.props.loading ? this.renderLoading() : this.renderSubmit()
  }

  render() {
    return (
      <div id="canvas">
        <div id="header-wrapper">
          <h1 className="header"> New Pueblo </h1>
          <ul id="main-nav">
            <li> <a href= "/"> model </a></li>
            <li> <a href= "/"> about</a></li>
          </ul>
        </div>

        <div className="container">
            <div className="row">
              {this.renderSimulate()}
              <h5> Demand-Side Users </h5>
                {this.renderRange()}
                {this.renderRequirements()}
            </div>

            <div className="row">
              <div className="two-thirds column">
                <h5> Storage </h5>
                {this.renderStorage()}
              </div>
              <div className="one-third column">
                <h5> Production </h5>
                {this.renderProduction()}
              </div>
            </div>

            <div className="row chart-section">
              <div className="one-half column">
                <h6 className="graph-header"> Aggregate Load </h6>
                {this.renderChartAgg()}
              </div>
              <div className="one-half column">
                <h6 className="graph-header"><strong> Price/ Unit Energy </strong></h6>
                {this.renderChartPrice()}
              </div>
            </div>

            <div className="row footer-wrapper">
              <footer id="footer" >
                © 2017 Jacob Noonan
              </footer>
            </div>

        </div>

      </div>
    );
  }
}

App.propTypes = {
  activeLoad: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default createContainer(({ params }) => {
  const subscription = Meteor.subscribe('aggLoads');
  return {
    activeLoad: AggLoads.find().fetch(),
    loading: !subscription.ready()
  };
}, App);
