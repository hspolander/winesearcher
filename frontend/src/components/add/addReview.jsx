import React from 'react';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddReviewForm from './addReviewForm';
import SearchSysForm from './searchSysForm';
import { loadAddReview, loadSysWines, setInitialValues, resetForm, clearInitialValues, clearSysWines } from './actions';
import { authUser } from '../login/actions';

import './add.scss';

class AddReview extends React.Component {

  constructor() {
    super();
    this.state = {
      range: '5',
      price: false,
    };
    this.priceChange = this.priceChange.bind(this);
    this.sendAddReviewRequest = this.sendAddReviewRequest.bind(this);
    this.sendGetSystembolagetRequest = this.sendGetSystembolagetRequest.bind(this);
    this.sendLoadSystembolagetRow = this.sendLoadSystembolagetRow.bind(this);
    this.rangeChange = this.rangeChange.bind(this);
  }

  componentWillMount() {
    this.props.authUser();
    if (this.props.navigatedInitialValues) {
      this.props.setInitialValues(navigatedInitialValues);
    } else {
      resetForm('WineReview');
    }
  }

  componentWillUnmount() {
    this.props.clearSysWines();
    this.props.clearInitialValues();
  }

  rangeChange(e) {
    this.setState({ range: e.target.value });
  }

  priceChange(e) {
    if (e.target.value) {
      this.setState({ price: true });
    } else {
      this.setState({ price: false });
    }
  }

  sendAddReviewRequest(values) {
    this.props.loadAddReview(values);
  }

  sendGetSystembolagetRequest(values) {
    this.props.loadSysWines(values);
  }

  sendLoadSystembolagetRow(values) {
    values.comment = `\r\nAlk.: ${values.Alkoholhalt}`;
    values.boughtFrom = 'Systembolaget';
    this.setState({ price: true });
    this.props.setInitialValues(values);
  }

  render() {
    return (
      <div className="content">
        <div className="add-wine">
          <div className="formtitle">
            <span>Skriv recension</span>
          </div>
          <AddReviewForm
            range={this.state.range}
            price={this.state.price}
            priceChange={this.priceChange}
            onSubmit={this.sendAddReviewRequest}
            rangeChange={this.rangeChange}
            enableReinitialize={true}
          />
          <div className="formtitle">
            <span>Sök i systembolagets sortiment</span>
          </div>
          <SearchSysForm
            onSubmit={this.sendGetSystembolagetRequest}
          />
          {
            this.props.systemWineData &&
            <div>
              { this.props.systemWineData.length > 0 ?
                <SearchSysResult systemWineData={this.props.systemWineData} sendLoadSystembolagetRow={this.sendLoadSystembolagetRow} />
                :
                <p>Inget resultat på din sökning</p>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}
AddReview.propTypes = {
  loadAddReview: PropTypes.func.isRequired,
  setInitialValues: PropTypes.func.isRequired,
};

const mapStateToProps = state =>
  ({
    data: state.addReducer.data,
    error: state.addReducer.error,
    fetching: state.addReducer.fetching,
    fetched: state.addReducer.fetched,
    systemWineData: state.addReducer.systemWineData,
  });

const mapDispatchToProps = {
  setInitialValues,
  loadAddReview,
  loadSysWines,
  resetForm,
  clearInitialValues,
  clearSysWines,
  authUser,
};

const SearchSysResult = ({ systemWineData, sendLoadSystembolagetRow }) => {
  const tbody = systemWineData.map( wine => <Row key={wine.systembolagetartnr} wine={wine} sendLoadSystembolagetRow={sendLoadSystembolagetRow} />);
  return (
    <div className="sysWineRows">
      <table className="single-systembolag-table">
        <thead>
          <tr>
            <td>
              <div className="result-header">Namn</div>
            </td>
            <td>
              <div className="result-header">År</div>
            </td>
            <td>
              <div className="result-header">Land</div>
            </td>
            <td>
              <div className="result-header">Färg</div>
            </td>
            <td>
              <div className="result-header">Förpackning</div>
            </td>
            <td>
              <div className="result-header">Producent</div>
            </td>
            <td>
              <div className="result-header">Pris</div>
            </td>
            <td>
              <div className="result-header">Lägg till recension</div>
            </td>
          </tr>
        </thead>
          {tbody}
      </table>
    </div>);
};

const Row = ({ wine, sendLoadSystembolagetRow }) => {
  return (
    <tbody>
      <tr>
        <td>
           <div className="sys-wine-td">{wine.name}</div>
        </td>
        <td>
           <div className="sys-wine-td">{wine.year}</div>
        </td>
        <td>
           <div className="sys-wine-td">{wine.country}</div>
        </td>
        <td>
           <div className="sys-wine-td">{wine.color}</div>
        </td>
        <td>
           <div className="sys-wine-td">{wine.container}</div>
        </td>
        <td>
           <div className="sys-wine-td">{wine.producer}</div>
        </td>
        <td>
           <div className="sys-wine-td">{wine.price}</div>
        </td>
        <td>
           <div className="sys-wine-td">
             <i className="fa fa-plus-square-o" aria-hidden="true" onClick={() => sendLoadSystembolagetRow(wine)} />
           </div>
        </td>
      </tr>
    </tbody>
    );
};


export default connect(mapStateToProps, mapDispatchToProps)(AddReview);
