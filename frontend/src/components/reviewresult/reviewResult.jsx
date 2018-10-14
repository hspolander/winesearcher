import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { loadClickedItem, loadOrderedClickedItem, toggleDetailedView } from './actions';
import { setInitialValuesResult } from '../add/actions';
import { authUser } from '../login/actions';
import setScreenSize from '../global/actions';

import './reviewResult.scss';

class WineResult extends React.Component {

  constructor() {
    super();
    this.sortWines = this.sortWines.bind(this);
    this.loadValuesReview = this.loadValuesReview.bind(this);
    this.loadValuesAddWine = this.loadValuesAddWine.bind(this);
  }

  componentDidMount() {    
    this.props.authUser();
    const params = this.props.match.params;
    this.props.loadClickedItem({ 'property': params.property, 'value': params.value, 'table': params.table });
    if (window.innerWidth <= 1024) {
      this.props.setScreenSize(true);
    } else {
      this.props.setScreenSize(false);
    }
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
            <option value="price">Pris</option>
            <option value="year">År</option>
            <option value="score">Betyg</option>
          </select>
        </div>
        { !this.props.isSmallScreen &&
          <button onClick={ () => { this.props.toggleDetailedView(); }} className={this.props.detailedView ? 'activeButton' : 'notActiveButton'}>Detaljerad vy</button>
        }
        { this.props.fetched &&  this.props.reviews && this.props.reviews.data &&
          <div>
            {this.props.detailedView || this.props.isSmallScreen ?
              <SearchResultDetailed
                wine={this.props.reviews}
                loadValuesAddWine={this.loadValuesAddWine}
                loadValuesReview={this.loadValuesReview}
                isSmallScreen={this.props.isSmallScreen}
              />
              :
              <SearchResult
                wine={this.props.reviews}
                loadValuesAddWine={this.loadValuesAddWine}
                loadValuesReview={this.loadValuesReview}
              />
            }
          </div>
        }
        { this.props.fetching &&  <Loader /> }
        { this.props.reviews && this.props.reviews.data && this.props.reviews.data.length === 0 && <Noresult /> }
      </div>
    );
  }
}


const SearchResult = (props) => {
  const wines = props.wine.data;
  const rows = wines.map((wine) =>
    <Row key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} removeFromCellar={props.removeFromCellar} loadValuesReview={props.loadValuesReview} />);
  return (
    <div className="search-result-reviews">
      { props.wine && <div className="wine-result">
        <div className="wine-result-div">
          <table className="single-wine-table">
            <thead>
              <tr className="single-wine-result">
                <td>Namn</td>
                <td>Land</td>
                <td>Färg</td>
                <td>Pris</td>
                <td>År</td>
                <td>Druvor</td>
                <td>Recension</td>
                <td>Betyg</td>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div> }
    </div>
  );
};


const Row = (props) => {
  const wine = props.wine.wine;
  const grapes = wine.grapes;
  const graperows = grapes.map((grape) =>
    <div key={`grape${grape.id}`} className="grape">{grape.grape}</div>);
  return (
    <tr className="single-wine-result">
      <td>
        <div>{wine.name}</div>
      </td>
      <td>
        <div>{wine.country}</div>
      </td>
      <td>
        <div>{ wine.color.indexOf('bubbel') > -1 ? wine.color : wine.color + ' vin' }
          { wine.color === 'Rött' && <i className="fa fa-glass red" aria-hidden="true"></i> }
          { wine.color === 'Rosé' && <i className="fa fa-glass rosa" aria-hidden="true"></i> }
          { wine.color === 'Vitt' && <i className="fa fa-glass white" aria-hidden="true"></i> }
        </div>
      </td>
      <td>
        <div> {wine.price}</div>
      </td>
      <td>
        <div>{wine.year}</div>
      </td>
      {graperows &&
        <td>
          <div>{graperows}</div>
        </td>
      }
      <td>
        <div> {wine.reviews[0] && wine.reviews[0].comment}</div>
      </td>
      <td>
        <div> {wine.reviews[0] && wine.reviews[0].score}</div>
      </td>
      <td>
        <i className="fa fa-commenting-o" aria-hidden="true" onClick={() => props.loadValuesReview(wine)} />
        <i className="fa fa-cart-plus" aria-hidden="true" onClick={() => props.loadValuesAddWine(wine)} />
      </td>
    </tr>
  );
};


const SearchResultDetailed = (props) => {
  const wines = props.wine.data;
  let rows;

  if (props.isSmallScreen) {
    rows = wines.map((wine) =>
     <RowMobile key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} loadValuesReview={props.loadValuesReview} />);
  } else {
    rows = wines.map((wine) =>
     <RowDetailed key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} loadValuesReview={props.loadValuesReview} />);
  }

  return (
    <div className="search-result-detailed">
      { props.wine && <div className="wine-result">
        <div className="wine-result-div">
          {rows}
        </div>
      </div> }
    </div>
  );
};

const RowDetailed = (props) => {
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
    <div className="single-review-result-detailed">
    { reviews[0] && reviews[0].added &&
      <div className="header">
        <div className="reviewer">{reviews[0].reviewer}</div>
        <div className="date-time">{moment(reviews[0].added).format('YYYY-MM-DD HH:mm')}</div>
        <div className="score">{reviews[0].score} av 10</div>
      </div>
    }
      <table className="single-review-table-detailed">
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

const RowMobile = (props) => {
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
    <div className="single-review-result-detailed">
    { reviews[0] && reviews[0].added &&
      <div className="header">
        <div className="reviewer">{reviews[0].reviewer}</div>
        <div className="date-time">{moment(reviews[0].added).format('YYYY-MM-DD HH:mm')}</div>
        <div className="score">{reviews[0].score} av 10</div>
      </div>
    }
      <table className="single-review-table-detailed">
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
    detailedView: state.reviewResultReducer.detailedView,
    fetched: state.reviewResultReducer.fetched,
    isSmallScreen: state.globalReducer.isSmallScreen,
  });

const mapDispatchToProps = {
  loadClickedItem,
  loadOrderedClickedItem,
  setInitialValuesResult,
  toggleDetailedView,
  setScreenSize,
  authUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(WineResult);
