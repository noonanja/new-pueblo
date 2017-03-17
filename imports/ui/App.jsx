import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const Handle = Slider.Handle;
import 'rc-slider/assets/index.css';

const activeMax = 180;
const defaultValues= [40, 80, 120];
const marks = {0: '0'};
marks[activeMax]= `${activeMax}`;

const handle = (props) => {
  const {value, ...restProps} = props;
  return (
    <Tooltip overlay={value}> <Handle {...restProps} /> </Tooltip>
  )
}

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      values: defaultValues,
      handle: handle,
    };
  }

  updateTipValues(values) {
    this.setState({
      numGenStore: values[0],
      numStore: values[1]-values[0],
      numGen: values[2]-values[1],
    });
  }

  renderRange() {
    return (
      <Range
        className="range" min={0} max={activeMax} defaultValue={defaultValues}
        pushable={true} step= {5} included={false} marks = {marks}
        handle= {this.state.handle} tipFormatter= {value => `${value}`}
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
