import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SortWines from './sortWines';
import { SearchResult, SearchResultDetailed } from './result';
import { loadCellarOrdered, loadCellar, removeWineFromCellar, toggleDetailedView } from './actions';
import { setInitialValuesResult } from '../add/actions';
import setScreenSize from '../global/actions';

import './wineResult.scss';

class WineResult extends React.Component {

  constructor() {
    super();
    this.sortWines = this.sortWines.bind(this);
    this.removeFromCellar = this.removeFromCellar.bind(this);
    this.loadValuesReview = this.loadValuesReview.bind(this);
    this.loadValuesAddWine = this.loadValuesAddWine.bind(this);
  }

  componentWillMount() {
    this.props.loadCellar();
    if (window.innerWidth <= 1024) {
      this.props.setScreenSize(true);
    } else {
      this.props.setScreenSize(false);
    }
  }

  sortWines(e) {
    if (e.target.value) {
      this.props.loadCellarOrdered({ 'orderedProp': e.target.value });
    }
  }

  loadValuesReview(values) {
    const initialValues = { ...values };
    const grapes = [];
    for (let i = 0; i < values.grapes.length; i += 1) {
      grapes.push(values.grapes[i].grape);
    }
    initialValues.grapes = grapes;
    delete initialValues.id;
    delete initialValues.reviews;
    this.props.setInitialValuesResult(initialValues);
    this.props.history.push('/addReview');
  }

  loadValuesAddWine(values) {
    const initialValues = { ...values };
    const grapes = [];
    for (let i = 0; i < values.grapes.length; i += 1) {
      grapes.push(values.grapes[i].grape);
    }
    initialValues.grapes = grapes;
    delete initialValues.id;
    delete initialValues.reviews;
    this.props.setInitialValuesResult(initialValues);
    this.props.history.push('/addWine');
  }

  removeFromCellar(id) {
    this.props.removeWineFromCellar(id);
    this.props.loadCellar();
  }

  render() {
    return (
      <div className="content">
        <SortWines sortWines={this.sortWines} />
        { !this.props.isSmallScreen &&
          <button onClick={() => { this.props.toggleDetailedView(); }} className={this.props.detailedView ? 'activeButton' : 'notActiveButton'}>Detaljerad vy</button>
        }
        { this.props.fetched && this.props.wines && this.props.wines.data &&
          <div>
            {this.props.detailedView || this.props.isSmallScreen ?
              <SearchResultDetailed
                wine={this.props.wines}
                removeFromCellar={this.removeFromCellar}
                loadValuesAddWine={this.loadValuesAddWine}
                loadValuesReview={this.loadValuesReview}
                isSmallScreen={this.props.isSmallScreen}
              />
              :
              <SearchResult
                wine={this.props.wines}
                removeFromCellar={this.removeFromCellar}
                loadValuesAddWine={this.loadValuesAddWine}
                loadValuesReview={this.loadValuesReview}
              />
            }
          </div>
        }
        { this.props.fetching && <Loader /> }
        { this.props.wines && this.props.wines.data && this.props.wines.data.length === 0 && <Noresult /> }
      </div>
    );
  }
}
WineResult.propTypes = {
  fetched: PropTypes.bool,
  fetching: PropTypes.bool,
  detailedView: PropTypes.bool,
  isSmallScreen: PropTypes.bool,
  wines: PropTypes.object,
  history: PropTypes.object.isRequired,
  setScreenSize: PropTypes.func.isRequired,
  toggleDetailedView: PropTypes.func.isRequired,
  setInitialValuesResult: PropTypes.func.isRequired,
  removeWineFromCellar: PropTypes.func.isRequired,
  loadCellar: PropTypes.func.isRequired,
  loadCellarOrdered: PropTypes.func.isRequired,
};

const Loader = () => (
  <div className="loader">
    <div>
      <i className="fa fa-spinner fa-spin fa-3x" aria-hidden="true" />
      <span>Laddar...</span>
    </div>
  </div>
);

const Noresult = () => (
  <div className="loader">
    <div>
      <span>Vi hittade tyvärr inga recensioner...</span>
    </div>
  </div>
);

const mapStateToProps = state =>
  ({
    wines: state.wineResultReducer.wines,
    error: state.wineResultReducer.error,
    fetching: state.wineResultReducer.fetching,
    detailedView: state.wineResultReducer.detailedView,
    isSmallScreen: state.globalReducer.isSmallScreen,
    fetched: state.wineResultReducer.fetched,
    setScreenSize: true,
  });

const mapDispatchToProps = {
  setInitialValuesResult,
  removeWineFromCellar,
  toggleDetailedView,
  loadCellarOrdered,
  loadCellar,
  setScreenSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(WineResult);
