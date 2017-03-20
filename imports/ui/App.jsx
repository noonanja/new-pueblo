import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';


import Range from 'rc-slider/lib/Range';
import Slider from 'rc-slider';
const Handle = Slider.Handle;
const Tooltip = require('rc-tooltip');
import 'rc-slider/assets/index.css';

const activeMax = 180;
const defaultValues= [40, 80, 120];
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

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: defaultValues,
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
                     (index==1 ? ` Storers: ${value - this.state.values[index-1]} ` :
                                 ` Generators: ${value - this.state.values[index-1]} `);
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
      values: values,
    });
  }

  renderRange() {
    return (
        <div className="range">
        <Range
          handle= {this.handle.bind(this)} onChange= {this.updateTipValues.bind(this)}
          ref= "range" min={0} max={activeMax} pushable={true}
          defaultValue={defaultValues} step={5} included={false} marks ={marks} />
        </div>
    )
  }

  handleChange(event) {
    this.setState({requirements: event.target.value});
  }

  handleSubmit(event) {
    alert('Form was completed: ' + this.state.requirements);
    event.preventDefault();
  }

  renderRequirements() {
    // <input type="submit" value="Submit" />
    return (
      <label className="mean-daily">
        <p>Mean Daily User Energy Requirements</p>
        <input type="number" step="2" value={this.state.requirements} required
        min={defaultRequirements-4} max={defaultRequirements+4}
        onChange={this.handleChange} dir="rtl"/> kWh
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
            onChange={this.handleChange} dir="rtl"/> %
          </label>

          <label className="one-half column energyStorage">
            <p>Discharging Efficiency</p>
            <input type="number" step="2" value={this.state.dEfficiency} required
            min={defaultDEfficiency-4} max={defaultDEfficiency+4}
            onChange={this.handleChange} dir="rtl"/> %
          </label>
        </div>
        <div className="row">
          <label className="one-half column energyStorage">
            <p>Capacity</p>
            <input type="number" step="2" value={this.state.capacity} required
            min={defaultCapacity-4} max={defaultCapacity+4}
            onChange={this.handleChange} dir="rtl"/> kWh
          </label>

          <label className="one-half column energyStorage">
            <p>Max Charge Rate</p>
            <input type="number" step="2" value={this.state.maxChargeRate} required
            min={defaultMaxChargeRate-4} max={defaultMaxChargeRate+4}
            onChange={this.handleChange} dir="rtl"/> kWh per hour
          </label>
        </div>
        <div className="row">
          <label className="energyStorage">
            <p>Leakage Rate</p>
            <input type="number" step="2" value={this.state.leakRate} required
            min={defaultLeakRate-4} max={defaultLeakRate+4}
            onChange={this.handleChange} dir="rtl"/> %
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
              onChange={this.handleChange} dir="rtl"/> kWh
            </label>
          </div>
          <div className="row">
            <label>
              <p>Max Daily Production</p>
              <input type="number" step="2" value={this.state.maxDailyProduction} required
              min={defaultMaxDailyProduction-4} max={defaultMaxDailyProduction+4}
              onChange={this.handleChange} dir="rtl"/> kWh
            </label>
          </div>
      </div>
    )
  }

  render() {
    // <form onSubmit={this.handleSubmit()}>
    // </form>
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
              <h5> Demand-Side Users </h5>
                {this.renderRange()}
                {this.renderRequirements()}
            </div>

            <div className="row">
              <div className="two-thirds column grid-constraints">
                <h5> Storage </h5>
                {this.renderStorage()}
              </div>
              <div className="one-third column grid-constraints">
                <h5> Production </h5>
                {this.renderProduction()}
              </div>
            </div>

            <div className="row">
              <div className="one-half column">
                <h5> Aggregate Load </h5>
              </div>
              <div className="one-half column">
                <h5> Price/ Unit Energy </h5>
              </div>
            </div>

        </div>

      </div>
    );
  }
}

App.propTypes = {
  // value: PropTypes.number.isRequired,
  // tasks: PropTypes.array.isRequired,
};

export default createContainer(() => {
  return {
    // tasks: Tasks.find({}).fetch(),
  };
}, App);
