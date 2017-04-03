import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

// to use react-meteor-data (allowing us to use data from a Meteor collection
// inside a React component), we need to wrap our component in a container using
// the createContainer Higher Order Component
import { createContainer } from 'meteor/react-meteor-data';
import { Users }    from '../api/users/users.js';
import { AggLoads } from '../api/aggLoads/aggLoads.js';

import ChartUsers from './ChartUsers.jsx';
import ChartAgg from './ChartAgg.jsx';
import ChartPrice from './ChartPrice.jsx';


import Range from 'rc-slider/lib/Range';
import Slider from 'rc-slider';
const Handle = Slider.Handle;
const Tooltip = require('rc-tooltip');
import 'rc-slider/assets/index.css';

const defaultMaxActive = 180;
const defaultUserTypes= [40, 80, 120];
const defaultStep = 5;

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
      userTypes: defaultUserTypes,
      requirements: defaultRequirements,
      maxActive: defaultMaxActive,
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

  renderDemandSide() {
    return (
      <div>
        <div className="row">
          <label className="mean-daily">
            <p>Mean Daily User Consumption</p>
            <input type="number" step="2" value={this.state.requirements} required
            min={defaultRequirements-4} max={defaultRequirements+4}
            name= "requirements" onChange={this.handleChange} /> kWh
          </label>
        </div>
        <div className="row">
          <label>
            <p>Number Active Users</p>
            <input type="number" step="10" value={this.state.maxActive} required
            min={defaultMaxActive-60} max={defaultMaxActive+60}
            name= "maxActive" onChange={this.handleChange} /> users
          </label>
        </div>
      </div>
    )
  }

  renderChartUsers() {
    return <ChartUsers userTypes={this.state.userTypes} />
  }

  rangeMarks() {
    const marks = {0: '0'};
    marks[this.state.maxActive]= `${this.state.maxActive}`;
    return marks
  }

  renderRange() {
    return (
        <div className="range">
        <Range
          handle= {this.handle.bind(this)} onChange= {this.updateTipValues.bind(this)}
          ref= "range" min={0} max={this.state.maxActive} pushable={true}
          defaultValue={defaultUserTypes} step={defaultStep} included={false}
          marks ={this.rangeMarks()} />
        </div>
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
              name= "maxDailyProduction" onChange={this.handleChange} /> kWh
            </label>
          </div>
      </div>
    )
  }

  renderChartPrice() {
    // return <ChartPrice data={priceData}/>
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
              <div className="one-third column">
                <h5> Demand-Side Users </h5>
                {this.renderDemandSide()}
              </div>
              <div className="two-thirds column">
                {this.renderChartUsers()}
              </div>
            </div>

            <div className="row">
              <div className="two-thirds column">
                <h6> Active Users </h6>
                  {this.renderRange()}
              </div>
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

            <div className ="row">
              {this.renderSimulate()}
            </div>

            <div className="row chart-section">
              <div className="one-half column">
                <h6 className="graph-header"> Aggregate Load </h6>
                <ChartAgg activeLoad={this.props.activeLoad}/>
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
  activeAggLoad: React.PropTypes.array,
  loading: React.PropTypes.bool,
};

export default createContainer(({ params }) => {
  const aggLoadsHandle = Meteor.subscribe('aggLoads');
  const loading = !aggLoadsHandle.ready();
  const activeLoad = AggLoads.findOne({active: true});
  const activeLoadExists = !loading && !!activeLoad;
  return {
    loading,
    activeLoad: activeLoadExists ? _.values(activeLoad.l) : [],
  };
}, App);
