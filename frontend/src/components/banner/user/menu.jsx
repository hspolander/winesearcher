import React from 'react';

import Dropdown from './dropdown';

import './menu.scss';

export default class Menu extends React.Component {

  constructor() {
    super();
    this.state = { hover: false, clicked: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
  }

  handleClick() {
    if (this.state.clicked) {
      this.setState({ clicked: false });
      this.setState({ hover: false });
    } else {
      this.setState({ clicked: true });
    }
  }

  handleMouseEnter() {
    this.setState({ hover: true });
  }

  handleMouseLeave() {
    this.setState({ hover: false });
  }

  render() {
    return (
      <div onMouseEnter={ this.handleMouseEnter } onMouseLeave={ this.handleMouseLeave } className="menu">
        <i className="fa fa-navicon fa-5x" onClick={ this.handleClick } />
        { (this.state.hover || this.state.clicked) && <Dropdown /> }
      </div>
    );
  }
};