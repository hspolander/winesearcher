import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Responseheader from './responseheader';
import Responselist from './responselist';

import './search.scss';

class AutocompleteSelect extends React.Component {

  constructor() {
    super();
    this.state = { collapsed: false };
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillReceiveProps() {
    if (this.props && this.props.navigated) {
      this.setState({ collapsed: true });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.node && !this.node.contains(event.target)) {
      this.setState({ collapsed: true });
    } else {
      this.setState({ collapsed: false });
    }
  }

  render() {
    const data = this.props.autocompleteSelect.data;
    const responsedivs = [];
    for (const responsetype in data) {
      const responselist = data[responsetype];
      responsedivs.push(
        <li key={responsetype}>
          <Responseheader responseheader={responsetype} />
          <Responselist responselist={responselist} />
        </li>);
    }

    return (
      <div ref={(node) => { this.node = node; }} className="autocomplete-select">
        { !this.state.collapsed && <ul className="autocomplete-result noSelect">{responsedivs}</ul> }
      </div>
    );
  }
}

AutocompleteSelect.propTypes = {
  navigated: PropTypes.bool,
  autocompleteSelect: PropTypes.object,
};

const mapStateToProps = state =>
  ({
    navigated: state.searchbarReducer.fetching,
  });


export default connect(mapStateToProps, null)(AutocompleteSelect);
