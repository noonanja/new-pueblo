import React, { Component } from 'react';

export default class Header extends Component {
  render() {
    return (
      <div id="header-wrapper">
        <h1 className="header"> New Pueblo </h1>
        <ul id="main-nav">
          <li> <a href= "/"> model </a></li>
          <li> <a href= "/"> about</a></li>
        </ul>
      </div>
    )
  }
}
