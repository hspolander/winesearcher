import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { loadClickedItem, loadOrderedClickedItem } from './actions';
import { setInitialValuesResult } from '../add/actions';

import './reviewResult.scss';

class WineResult extends React.Component {

  constructor() {
    super();
    this.sortWines = this.sortWines.bind(this);
    this.loadValuesReview = this.loadValuesReview.bind(this);
    this.loadValuesAddWine = this.loadValuesAddWine.bind(this);
  }

  componentWillMount() {
    const params = this.props.match.params;
    this.props.loadClickedItem({ 'property': params.property, 'value': params.value, 'table': params.table });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      const params = nextProps.match.params;
      this.props.loadClickedItem({ 'property': params.property, 'value': params.value, 'table': params.table });
    }
  }

  sortWines(e) {
    if (e.target.value) {
      const params = this.props.match.params;
      this.props.loadOrderedClickedItem({ 'property': params.property, 'value': params.value, 'table': params.table, 'orderedProp': e.target.value });
    }
  }

  loadValuesReview(values) {
    const initialValues = { ...values };
    let grapes = [];
    for (var i = 0; i < values.grapes.length; i++) {
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
    let grapes = [];
    for (var i = 0; i < values.grapes.length; i++) {
      grapes.push(values.grapes[i].grape);
    }
    initialValues.grapes = grapes;
    delete initialValues.id;
    delete initialValues.reviews;
    this.props.setInitialValuesResult(initialValues);
    this.props.history.push('/addWine');
  }

  render() {
    return (
      <div className="content">
        <div className="input-div search">
          <span>Sortera på:</span>
          <select onChange={this.sortWines}>
            <option value=""></option>
            <option value="color">Färg</option>
            <option value="country">Land</option>
            <option value="name">Namn</option>
            <option value="producer">Producent</option>
            <option value="year">År</option>
            <option value="score">Betyg</option>
          </select>
        </div>
        { this.props.fetched && this.props.reviews.data && <SearchResult wine={this.props.reviews} loadValuesAddWine={this.loadValuesAddWine} loadValuesReview={this.loadValuesReview} />}
        { this.props.fetching &&  <Loader /> }
        { this.props.reviews && this.props.reviews.data && this.props.reviews.data.length === 0 && <Noresult /> }
      </div>
    );
  }
}


const SearchResult = (props) => {
  const wines = props.wine.data;
  const rows = wines.map((wine) =>
    <Row key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} loadValuesReview={props.loadValuesReview} />);
  return (
    <div className="search-result">
      { props.wine && <div className="wine-result">
        <div className="wine-result-div">
          {rows}
        </div>
      </div> }
    </div>
  );
};

const Row = (props) => {
  const wine = props.wine.wine;
  const grapes = wine.grapes;
  const reviews = wine.reviews;

  const graperows = grapes.map((grape) =>
    <div key={`grape${grape.id}`} className="grape">{grape.grape}</div>);
  const reviewrows = reviews.map((review) =>
    <div key={`review${review.id}`} className="review">
      <div className="result-header">Recension:</div>
      <div className="comment">{review.comment}</div>
    </div>);
  return (
    <div className="single-review-result">
    { reviews[0] && reviews[0].added &&
      <div className="header">
        <div className="reviewer">{reviews[0].reviewer}</div>
        <div className="date-time">{moment(reviews[0].added).format('YYYY-MM-DD HH:mm')}</div>
        <div className="score">{reviews[0].score} av 10</div>
      </div>
    }
      <table className="single-review-table">
        <tbody>
          <tr>
            <td>
              <div className="result-header">Namn:</div>
              <div>{wine.name}</div>
            </td>
            <td>
              <div className="result-header">Land:</div>
              <div>{wine.country}</div>
            </td>
            <td>
              <div className="result-header">Producent:</div>
              <div>{wine.producer}</div>
            </td>
            <td>
              <div className="result-header">Färg:</div>
              <div>{wine.color}</div>
            </td>
            <td>
              <div className="result-header">År:</div>
              <div>{wine.year}</div>
            </td>
          </tr>
          {graperows && <tr>
            <td colSpan="5">
              <div className="result-header">Druvor:</div>
              <div className="graperows">{graperows}</div>
            </td>
          </tr>}
          {reviewrows && <tr>
            <td colSpan="5">
              <div className="reviewrows">{reviewrows}</div>
            </td>
          </tr>}
          <tr>
            <td colSpan="2">
              {wine.boughtfrom && <div>
                <div className="result-header">Inköpsplats:</div>
                <div>{wine.boughtfrom}</div>
              </div>}
            </td>
            <td colSpan="3">
              {wine.price && <div>
                <div className="result-header">Pris: </div>
                <div>{wine.price} per </div>
                {wine.glass ? <div>Glas</div> : <div>Flaska</div>}
              </div>}
            </td>
          </tr>
          {<tr>
            <td colSpan="3" />
            <td>
              <div className="add-new-button" onClick={() => props.loadValuesReview(wine)}>
                <i className="fa fa-commenting-o" aria-hidden="true" /> Recensera
              </div>
            </td>
            <td>
              <div className="add-new-button" onClick={() => props.loadValuesAddWine(wine)}>
                <i className="fa fa-cart-plus" aria-hidden="true" /> Lägg till i förråd
              </div>
            </td>
          </tr>}
        </tbody>
      </table>
    </div>
  );
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
    reviews: state.reviewResultReducer.reviews,
    error: state.reviewResultReducer.error,
    fetching: state.reviewResultReducer.fetching,
    fetched: state.reviewResultReducer.fetched,
  });

const mapDispatchToProps = {
  loadClickedItem,
  loadOrderedClickedItem,
  setInitialValuesResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(WineResult);
