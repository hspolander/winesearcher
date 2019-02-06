import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

export const SearchResult = (props) => {
  const wines = props.wine.data;
  const rows = wines.map(wine =>
    <Row
      key={`wine${wine.wine.id}`} wine={wine}
      loadValuesAddWine={props.loadValuesAddWine}
      removeFromCellar={props.removeFromCellar}
      loadValuesReview={props.loadValuesReview}
    />);
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
SearchResult.propTypes = {
  wine: PropTypes.object,
  loadValuesReview: PropTypes.func.isRequired,
};

export const SearchResultDetailed = (props) => {
  const wines = props.wine.data;
  let rows;
  if (props.isSmallScreen) {
    rows = wines.map(wine =>
      <RowMobile key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} removeFromCellar={props.removeFromCellar} loadValuesReview={props.loadValuesReview} />);
  } else {
    rows = wines.map(wine =>
      <RowDetailed key={`wine${wine.wine.id}`} wine={wine} loadValuesAddWine={props.loadValuesAddWine} removeFromCellar={props.removeFromCellar} loadValuesReview={props.loadValuesReview} />);
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
SearchResultDetailed.propTypes = {
  wine: PropTypes.object,
  isSmallScreen: PropTypes.bool.isRequired,
  loadValuesReview: PropTypes.func.isRequired,
};

const Row = (props) => {
  const wine = props.wine.wine;
  const grapes = wine.grapes;
  const graperows = grapes.map(grape =>
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
        <div>{ wine.color.indexOf('bubbel') > -1 ? wine.color : `${wine.color} vin` }
          { wine.color === 'Rött' && <i className="fa fa-glass red" aria-hidden="true" /> }
          { wine.color === 'Rosé' && <i className="fa fa-glass rosa" aria-hidden="true" /> }
          { wine.color === 'Vitt' && <i className="fa fa-glass white" aria-hidden="true" /> }
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
        <i className="fa fa-times" aria-hidden="true" onClick={() => props.removeFromCellar(wine.id)} />
      </td>
    </tr>
  );
};
Row.propTypes = {
  wine: PropTypes.object,
  loadValuesReview: PropTypes.func.isRequired,
  loadValuesAddWine: PropTypes.func.isRequired,
  removeFromCellar: PropTypes.func.isRequired,
};

const RowDetailed = (props) => {
  const wine = props.wine.wine;
  const grapes = wine.grapes;
  let reviews;
  let reviewrows;

  if (wine.reviews) {
    reviews = wine.reviews;
    reviewrows = reviews.map(review =>
      <div key={`review${review.id}`} className="review">
        <div className="result-header">Recension:</div>
        <div className="comment">{review.comment}</div>
      </div>);
  }

  const graperows = grapes.map(grape =>
    <div key={`grape${grape.id}`} className="grape">{grape.grape}</div>);

  return (
    <div className="single-wine-result-detailed">
      { reviews && reviews[0] && reviews[0].added &&
        <div className="header">
          <div className="reviewer">{reviews[0].reviewer}</div>
          <div className="date-time">{moment(reviews[0].added).format('YYYY-MM-DD HH:mm')}</div>
          <div className="score">{reviews[0].score} av 10</div>
        </div>
      }
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
                { wine.color === 'Rött' && <i className="fa fa-glass red" aria-hidden="true" /> }
                { wine.color === 'Vitt' && <i className="fa fa-glass white" aria-hidden="true" /> }
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
          {reviewrows && <tr>
            <td colSpan="5">
              <div className="reviewrows">{reviewrows}</div>
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
RowDetailed.propTypes = {
  wine: PropTypes.object,
  loadValuesReview: PropTypes.func.isRequired,
  loadValuesAddWine: PropTypes.func.isRequired,
  removeFromCellar: PropTypes.func.isRequired,
};

const RowMobile = (props) => {
  const wine = props.wine.wine;
  const grapes = wine.grapes;
  let reviews;
  let reviewrows;

  if (wine.reviews) {
    reviews = wine.reviews;
    reviewrows = reviews.map(review =>
      <div key={`review${review.id}`} className="review">
        <div className="result-header">Recension:</div>
        <div className="comment">{review.comment}</div>
      </div>);
  }
  const graperows = grapes.map(grape =>
    <div key={`grape${grape.id}`} className="grape">{grape.grape}</div>);
  return (
    <div className="single-review-result-detailed">
      { reviews && reviews[0] && reviews[0].added &&
        <div className="header">
          <div className="wine-name">{wine.name}</div>
          <div className="date-time">{moment(reviews[0].added).format('YYYY-MM-DD HH:mm')}</div>
          <div className="score">{reviews[0].score} av 10</div>
        </div>
      }
      <div className="header">
        <div className="wine-name">{wine.name}</div>
      </div>
      <table className="single-review-table-detailed">
        <tbody>
          <tr>
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
            <td colSpan="3">
              <div className="result-header">Druvor:</div>
              <div className="graperows">{graperows}</div>
            </td>
          </tr>}
          {reviewrows && <tr>
            <td colSpan="3">
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
            <td colSpan="2">
              {wine.price && <div>
                <div className="result-header">Pris: </div>
                <div>{wine.price} per </div>
                {wine.glass ? <div>Glas</div> : <div>Flaska</div>}
              </div>}
            </td>
          </tr>
          {<tr>
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
          </tr>}
        </tbody>
      </table>
    </div>
  );
};
RowMobile.propTypes = {
  wine: PropTypes.object,
  loadValuesReview: PropTypes.func.isRequired,
  loadValuesAddWine: PropTypes.func.isRequired,
};
