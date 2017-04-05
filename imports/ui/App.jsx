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

// Contraints for DERs drawn from paper
import {Constraints} from '/lib/constraints.js';
const userCount = Constraints.userCount;
const maxActive = Constraints.maxActive;

// Range slider component
import Range from 'rc-slider/lib/Range';
import Slider from 'rc-slider';
const Handle = Slider.Handle;
const Tooltip = require('rc-tooltip');
import 'rc-slider/assets/index.css';

const defaultUserTypes= [40, 80, 120];
const defaultStep = 5;
const marks = {0: '0'};
marks[maxActive]= `${maxActive}`;


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userTypes: defaultUserTypes,
      requirements: Constraints.defaultRequirements,
      cEfficiency: Constraints.defaultCEfficiency,
      dEfficiency: Constraints.defaultDEfficiency,
      capacity: Constraints.defaultCapacity,
      maxChargeRate: Constraints.defaultMaxChargeRate,
      leakRate: Constraints.defaultLeakRate,
      maxHourlyProduction: Constraints.defaultMaxHourlyProduction,
      maxDailyProduction: Constraints.defaultMaxDailyProduction,
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

  renderChartUsers() {
    return (
        <ChartUsers userTypes={this.state.userTypes} userCount={userCount} />
    )
  }

  renderRange() {
    return (
        <div className="range">
        <Range
          handle= {this.handle.bind(this)} onChange= {this.updateTipValues.bind(this)}
          ref= "range" min={0} max={maxActive} pushable={true}
          defaultValue={defaultUserTypes} step={defaultStep} included={false}
          marks ={marks} />
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
            min={Constraints.defaultCEfficiency-4} max={Constraints.defaultCEfficiency+4}
            name= "cEfficiency" onChange={this.handleChange} /> %
          </label>

          <label className="one-half column energyStorage">
            <p>Discharging Efficiency</p>
            <input type="number" step="2" value={this.state.dEfficiency} required
            min={Constraints.defaultDEfficiency-4} max={Constraints.defaultDEfficiency+4}
            name= "dEfficiency" onChange={this.handleChange} /> %
          </label>
        </div>
        <div className="row">
          <label className="one-half column energyStorage">
            <p>Capacity</p>
            <input type="number" step="2" value={this.state.capacity} required
            min={Constraints.defaultCapacity-4} max={Constraints.defaultCapacity+4}
            name= "capacity" onChange={this.handleChange} /> kWh
          </label>

          <label className="one-half column energyStorage">
            <p>Max Charge Rate</p>
            <input type="number" step="2" value={this.state.maxChargeRate} required
            min={Constraints.defaultMaxChargeRate-4} max={Constraints.defaultMaxChargeRate+4}
            name= "maxChargeRate" onChange={this.handleChange} /> kWh per hour
          </label>
        </div>
        <div className="row">
          <label className="energyStorage">
            <p>Leakage Rate</p>
            <input type="number" step="2" value={this.state.leakRate} required
            min={Constraints.defaultLeakRate-4} max={Constraints.defaultLeakRate+4}
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
              min={Constraints.defaultMaxHourlyProduction-4} max={Constraints.defaultMaxHourlyProduction+4}
              name= "maxHourlyProduction" onChange={this.handleChange} /> kWh
            </label>
          </div>
          <div className="row">
            <label>
              <p>Max Daily Production</p>
              <input type="number" step="2" value={this.state.maxDailyProduction} required
              min={Constraints.defaultMaxDailyProduction-4} max={Constraints.defaultMaxDailyProduction+4}
              name= "maxDailyProduction" onChange={this.handleChange} /> kWh
            </label>
          </div>
      </div>
    )
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
        <input type="submit" id="run" value="run" />
      </form>
    )
  }

  renderLoading() {
    return (
        <img src="/loading.svg" />
    )
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
              <div className="one-half column">
                <h5> Demand-Side Users </h5>
                  <p>Active Users</p>
                  {this.renderRange()}
              </div>
              <div className="one-half column">
                {this.renderChartUsers()}
              </div>
            </div>

            <div className="row der-constraints">
              <div className="two-thirds column">
                <h5> Storage </h5>
                {this.renderStorage()}
              </div>
              <div className="one-third column">
                <h5> Production </h5>
                {this.renderProduction()}
              </div>
            </div>

            <div className= "row simulate">
              {this.renderSimulate()}
            </div>

            <div className="chart-section">
              <div className="row">
                <h6 className="graph-header"> Aggregate Load </h6>
                <ChartAgg passiveLoad={this.props.passiveLoad} activeLoad={this.props.activeLoad}/>
              </div>
              <div className="row">
                <h6 className="graph-header"><strong> Price/ Unit Energy </strong></h6>
                <ChartPrice passiveValues={this.props.passiveLoad.values} activeValues={this.props.activeLoad.values}/>
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
  passiveLoad: React.PropTypes.object,
  activeLoad: React.PropTypes.object,
  loading: React.PropTypes.bool,
};

export default createContainer(({ params }) => {
  const aggLoadsHandle = Meteor.subscribe('aggLoads');
  const loading = !aggLoadsHandle.ready();
  const passiveLoad = AggLoads.findOne({active: false});
  const passiveLoadExists = !loading && !!passiveLoad;
  const activeLoad = AggLoads.findOne({active: true});
  const activeLoadExists = !loading && !!activeLoad;
  return {
    loading,
    activeLoad: activeLoadExists   ? { n:  activeLoad.n, values: _.values(activeLoad.l) }  : { n: 0, values: [] },
    passiveLoad: passiveLoadExists ? { n: passiveLoad.n, values: _.values(passiveLoad.l) } : { n: 0, values: [] },
  };
}, App);
