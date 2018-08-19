import React from 'react';

import { connect } from 'react-redux';

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
        <input type="text" onChange={this.handleChange} className={this.props.match ? 'match' : 'noMatch'} />
        {this.props.fetched && <AutocompleteSelect autocompleteSelect={this.props.data} />}
      </div>
    );
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(Search);
