import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AutocompleteSelect from './autocompleteSelect';
import loadAutocompleteSearch from './actions';

import './search.scss';

class Search extends React.Component {

  constructor() {
    super();
    this.state = {
      clickedOutside: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.loadAutocompleteSearch(e.target.value);
  }

  render() {
    return (
      <div className="banner-search center-parent">
        <input type="text" placeholder="Sök" onChange={this.handleChange} className={this.props.match ? 'match' : 'noMatch'} />
        {this.props.fetched && <AutocompleteSelect autocompleteSelect={this.props.data} />}
        <div className="menu-items">
          <MenuIcon icon="fa-search" text="Recensioner" navTo="/reviews" />
          <MenuIcon icon="fa-flask" text="Vinförråd" navTo="/wines" />
          <MenuIcon icon="fa-commenting-o" text="Recensera" navTo="/addReview" />
          <MenuIcon icon="fa-cart-plus" text="Lägg till i vinförråd" navTo="/addWine" />
        </div>
      </div>
    );
  }
}
Search.propTypes = {
  match: PropTypes.bool,
  data: PropTypes.object,
  loadAutocompleteSearch: PropTypes.func,
  fetched: PropTypes.bool,
};

const mapStateToProps = state =>
  ({
    data: state.searchbarReducer.data,
    error: state.searchbarReducer.error,
    fetching: state.searchbarReducer.fetching,
    fetched: state.searchbarReducer.fetched,
    match: state.searchbarReducer.match,
  });

const mapDispatchToProps = {
  loadAutocompleteSearch,
};

const MenuIcon = props => (
  <Link className="nostyle-link" to={props.navTo}>
    <div className="menu-item">
      <i className={`fa ${props.icon} fa-3x`} />
      <i className="icon-title">{props.text}</i>
    </div>
  </Link>
);
MenuIcon.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  navTo: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
