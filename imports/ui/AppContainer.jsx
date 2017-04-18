import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';


// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div id="canvas">
        <div className="container">
            {this.props.header}
            {this.props.main}
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
