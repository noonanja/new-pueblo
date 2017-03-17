import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
import 'rc-slider/assets/index.css';



// App component - represents the whole app
class App extends Component {

  renderRange() {
    return (
      <Range className="range"
            min={0} max={180} defaultValue={[60, 120, 180]}
            pushable={true}
            tipFormatter={value => `${value}`} />
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
              <div>
                <p> {this.renderRange()} </p>
                <p className="mean-daily"> Mean Daily User Energy Requirements </p>
              </div>

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
