import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Header extends Component {

  render() {
    const page  = this.props.page == "model" ? {model: "onPage", about: "offPage"} : {model: "offPage", about: "onPage"};
    return (
      <div id="header-wrapper">
        <h1 className="header"> New Pueblo </h1>
        <ul id="main-nav">
          <li> <a className={page.model} href= "/">      model </a></li>
          <li> <a className={page.about} href= "/about"> about </a></li>
        </ul>
      </div>
    )
  }
}

Header.propTypes = {
  page: PropTypes.string,
};
