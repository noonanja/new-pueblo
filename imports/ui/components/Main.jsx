import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';

// to use react-meteor-data (allowing us to use data from a Meteor collection
// inside a React component), we need to wrap our component in a container using
// the createContainer Higher Order Component
import { createContainer } from 'meteor/react-meteor-data';

import { Users }    from '../../api/users/users.js';
import { AggLoads } from '../../api/aggLoads/aggLoads.js';
import { Loads } from '../../api/loads/loads.js';

import ChartUsers from '../components/ChartUsers.jsx';
import ChartAgg from '../components/ChartAgg.jsx';
import ChartPrice from '../components/ChartPrice.jsx';

// Contraints for DERs drawn from paper
import { Constraints } from '/lib/constraints.js';

// Range slider component
import Range from 'rc-slider/lib/Range';
import Slider from 'rc-slider';
const Handle = Slider.Handle;
const Tooltip = require('rc-tooltip');
import 'rc-slider/assets/index.css';

const userCount = Constraints.userCount;
const maxActive = Constraints.maxActive;
const marks = {0: '0'};
marks[maxActive]= `${maxActive}`;


// App component - represents the whole app
class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userTypes: Constraints.defaultUserTypes,
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
            min={0} max={maxActive} pushable={true} marks ={marks} ref= "range"
            defaultValue={Constraints.defaultUserTypes} step={Constraints.defaultStep} included={false}/>
        </div>
    )
  }

  renderStorage() {
    return (
      <div>
        <div className="row">
          <label className="one-half column energyStorage">
            <p>Charge Efficiency</p>
            <input type="number" step={2.0} value={this.state.cEfficiency} required
            min={80.0} max={100.0}
            name= "cEfficiency" onChange={this.handleChange} /> %
          </label>

          <label className="one-half column energyStorage">
            <p>Discharging Efficiency</p>
            <input type="number" step={2.0} value={this.state.dEfficiency} required
            min={100.0} max={120.0}
            name= "dEfficiency" onChange={this.handleChange} /> %
          </label>
        </div>
        <div className="row">
          <label className="one-half column energyStorage">
            <p>Capacity</p>
            <input type="number" step={1.0} value={this.state.capacity} required
            min={1.0} max={Constraints.defaultCapacity+10}
            name= "capacity" onChange={this.handleChange} /> kWh
          </label>

          <label className="one-half column energyStorage">
            <p>Max Charge Rate</p>
            <input type="number" step={0.2} value={this.state.maxChargeRate} required
            min={0.1} max={2.0}
            name= "maxChargeRate" onChange={this.handleChange} /> kWh / h
          </label>
        </div>
        <div className="row">
          <label className="energyStorage">
            <p>Leakage Rate</p>
            <input type="number" step={0.1} value={this.state.leakRate} required
            min={99.0} max={100.0}
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
    const value = parseFloat(target.value);
    const name = target.name;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();

    // Partition the passive users into active and passive users
    // using the local mongo collections
    Meteor.call('users.partition', {userTypes: this.state.userTypes});

    const passiveLoad = this.props.finalPassiveLoad;
    Meteor.call('simulations.setSim', {formInput: this.state, passiveLoadValues: passiveLoad.values}, (err, res) => {
      if (err) {
        alert(err);
      }
      if (res) {
        FlowRouter.go(`/simulations/${res}`);
        let countdown = 1;
        while (countdown > 0) {
          Meteor.call('simulations.simulate',
          {
            simId: res,
            activeAggLoad: this.props.finalActiveLoad.values,
            activeLoads: this.props.activeLoads,
          });
          console.log(activeLoads);
          activeLoads.forEach(function(load) {
            const sPrime = Math.subtract(load.sCCentroid, load.sDCentroid);
            Loads.update({_id: load._id},
                         {
                          $set: {
                            l: Math.add(load.e, sPrime),
                            s: sPrime,
                            sCCentroid: load.sCCentroid,
                            sDCentroid: load.sDCentroid,
                          },
                         })
            })
        }
        countdown -= 1;
        }
      }
    );
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
    <div>
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
          <ChartAgg initialLoad={this.props.initialLoad} finalPassiveLoad={this.props.finalPassiveLoad}
                    finalActiveLoad={this.props.finalActiveLoad} />
        </div>
        <div className="row">
          <h6 className="graph-header"><strong> Price/ Unit Energy </strong></h6>
          <ChartPrice initialValues={this.props.initialLoad.values}
                      finalPassiveValues = {this.props.finalPassiveLoad.values}
                      finalActiveValues  = {this.props.finalActiveLoad.values} />
        </div>
      </div>
    </div>
    );
  }
}

Main.propTypes = {
  loading: PropTypes.bool,
  initialLoad: PropTypes.object,
  finalPassiveLoad: PropTypes.object,
  finalActiveLoad: PropTypes.object,
  activeLoads: PropTypes.arrayOf(PropTypes.object),
};

export default MainContainer = createContainer(({ params }) => {
  const aggLoadsHandle = Meteor.subscribe('aggLoads');
  const loading = !aggLoadsHandle.ready();
  const initialLoad = AggLoads.findOne({initial: true});
  const initialLoadExists = !loading && !!initialLoad;

  const finalPassiveLoad = AggLoads.findOne({initial: false, active: false});
  const finalPassiveLoadExists = !loading && !!finalPassiveLoad;

  const finalActiveLoad = AggLoads.findOne({initial: false, active: true});
  const finalActiveLoadExists = !loading && !!finalActiveLoad;

  const activeLoads = Loads.find({ $or: [{hasStore: true}, {hasGen: true}] }).fetch();

  // const simulationsHandle = Meteor.subscribe('simulations');
  // const console
  console.log(params);

  return {
    loading,
    initialLoad: initialLoadExists    ? {n: initialLoad.n, values: initialLoad.l} : { n: 0, values: [] },
    finalPassiveLoad: finalPassiveLoadExists ? {n: finalPassiveLoad.n, values: finalPassiveLoad.l} : { n: 0, values: [] },
    finalActiveLoad: finalActiveLoadExists  ? {n: finalActiveLoad.n, values: finalActiveLoad.l} : { n: 0, values: [] },
    activeLoads: activeLoads,
  };
}, Main);
