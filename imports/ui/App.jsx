import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';

const Tooltip = require('rc-tooltip');
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);
import Range from 'rc-slider/lib/Range';
const Handle = Slider.Handle;

import 'rc-slider/assets/index.css';

const activeMax = 180;
const defaultValues= [40, 80, 120];
const marks = {0: '0'};
marks[activeMax]= `${activeMax}`;


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: defaultValues,
      numGenStore: defaultValues[0],
      numStore: defaultValues[1]-defaultValues[0],
      numGen: defaultValues[2]-defaultValues[1],
    };
  }

  handle(props) {
    const {value, dragging, index, ...restProps} = props;
    const userValue = index==0 ? `Generator-Storers: ${value}` :
                     (index==1 ? `Storers: ${value - this.state.values[index-1]}` :
                                 `Generators: ${value - this.state.values[index-1]}`);
    return (
      <Tooltip
        prefixCls="rc-slider-tooltip"
        overlay={userValue}
        visible={dragging}
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
      numGenStore: values[0],
      numStore: values[1]-values[0],
      numGen: values[2]-values[1],
    });
  }

  renderRange() {
    return (
      <Range
        className="range" min={0} max={activeMax} defaultValue={defaultValues}
        pushable={true} step={5} included={false} marks ={marks}
        ref= "range"
        handle= {this.handle.bind(this)}
        onChange= {this.updateTipValues.bind(this)}
        onAfterChange={this.updateTipValues.bind(this)} />

    )
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
            <h5> Demand-Side Users </h5>
                {this.renderRange()}
                <p className="mean-daily"> Mean Daily User Energy Requirements </p>
          </div>

          <div className="row">
            <div className="one-half column">
              <h5> Energy Storage </h5>
            </div>
            <div className="one-half column">
              <h5> Energy Production </h5>
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
