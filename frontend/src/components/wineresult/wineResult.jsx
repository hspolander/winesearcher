import React from 'react';
import { connect } from 'react-redux';

import { loadCellarOrdered, loadCellar, removeWineFromCellar, toggleDetailedView } from './actions';
import { setInitialValuesResult } from '../add/actions';

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
    const params = this.props.match.params;
    this.props.loadCellar();
  }

  sortWines(e) {
    if (e.target.value) {
      const params = this.props.match.params;
      this.props.loadCellarOrdered({ 'orderedProp': e.target.value });
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

  removeFromCellar(id) {
    this.props.removeWineFromCellar(id);
    this.props.loadCellar();
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
          </select>
        </div>
        <button onClick={ () => { this.props.toggleDetailedView() }} className={this.props.detailedView ? 'activeButton' : 'notActiveButton' }>Detaljerad vy</button>
        { this.props.fetched && this.props.wines && this.props.wines.data && <div>
            {this.props.detailedView ?
              <SearchResultDetailed
                wine={this.props.wines}
                removeFromCellar={this.removeFromCellar}
                loadValuesAddWine={this.loadValuesAddWine}
                loadValuesReview={this.loadValuesReview}
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
        { this.props.fetching &&  <Loader /> }
        { this.props.wines && this.props.wines.data && this.props.wines.data.length === 0 && <Noresult /> }
      </div>
    );
  }
}

const SearchResult = (props) => {
  const wines = props.wine.data;
  const rows = wines.map((wine) =>
    <Row key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} removeFromCellar={props.removeFromCellar} loadValuesReview={props.loadValuesReview} />);
  return (
    <div className="search-result">
      { props.wine && <div className="wine-result">
        <div className="wine-result-div">
          <table className="single-wine-table">
            <thead>
              <tr className="single-wine-result">
                <td>Namn</td>
                <td>Land</td>
                <td>Färg</td>
                <td>Producent</td>
                <td>År</td>
                <td>Druvor</td>
                <td>Volym</td>
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
          { wine.color === 'Vitt' && <i className="fa fa-glass white" aria-hidden="true"></i> }
          { wine.color === 'Vitt' && <i className="fa fa-glass rosa" aria-hidden="true"></i> }
        </div>
      </td>
      <td>
        { wine.producer ? <div> {wine.producer}</div> : <div /> }
      </td>
      <td>
        <div>{wine.year}</div>
      </td>
      {graperows &&
        <td>
          <div>{graperows}</div>
        </td>
      }
      { wine.sizeml ? <td>
        <div> {wine.sizeml}</div>
      </td> : <td />}
      <td> 
        <i className="fa fa-commenting-o" aria-hidden="true" onClick={() => props.loadValuesReview(wine)} />
        <i className="fa fa-cart-plus" aria-hidden="true" onClick={() => props.loadValuesAddWine(wine)} />
      </td>
    </tr>
  );
};
        //<i className="fa fa-times" aria-hidden="true" onClick={() => props.removeFromCellar(wine)} />


const SearchResultDetailed = (props) => {
  const wines = props.wine.data;
  const rows = wines.map((wine) =>
    <RowDetailed key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} removeFromCellar={props.removeFromCellar} loadValuesReview={props.loadValuesReview} />);
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

  const graperows = grapes.map((grape) =>
    <div key={`grape${grape.id}`} className="grape">{grape.grape}</div>);

  return (
    <div className="single-wine-result-detailed">
      <table className="single-wine-table-detailed">
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
              <div>{wine.color}
                { wine.color === 'Rött' && <i className="fa fa-glass red" aria-hidden="true"></i> }
                { wine.color === 'Vitt' && <i className="fa fa-glass white" aria-hidden="true"></i> }
              </div>
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
          {wine.boughtfrom || wine.price ? <tr>
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
          </tr> : <tr />}
          <tr>
            <td />
            <td />
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
            <td>
              <div className="add-new-button" onClick={() => props.removeFromCellar(wine.id)}>
                <i className="fa fa-times" aria-hidden="true" /> Ta bort från vinkällare
              </div>
            </td>
          </tr>
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
    wines: state.wineResultReducer.wines,
    error: state.wineResultReducer.error,
    fetching: state.wineResultReducer.fetching,
    detailedView: state.wineResultReducer.detailedView,
    fetched: state.wineResultReducer.fetched,
  });

const mapDispatchToProps = {
  setInitialValuesResult,
  removeWineFromCellar,
  toggleDetailedView,
  loadCellarOrdered,
  loadCellar,
};

export default connect(mapStateToProps, mapDispatchToProps)(WineResult);
