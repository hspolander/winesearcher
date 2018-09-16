import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddWineForm from './addWineForm';
import SearchSysForm from './searchSysForm';
import { loadAddWine, loadSysWines, setInitialValues, clearInitialValues, clearSysWines } from './actions';
import { authUser } from '../login/actions';

import './add.scss';

class AddWine extends React.Component {

  constructor() {
    super();
    this.state = {
      price: false,
    };
    this.priceChange = this.priceChange.bind(this);
    this.sendAddWineRequest = this.sendAddWineRequest.bind(this);
    this.sendGetSystembolagetRequest = this.sendGetSystembolagetRequest.bind(this);
    this.sendLoadSystembolagetRow = this.sendLoadSystembolagetRow.bind(this);
  }

  componentWillMount() {
    this.props.authUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.systemWineData && this.props.systemWineData.length > 0 && this.props.systemWineData !== prevProps.systemWineData) {
      const domNode = ReactDOM.findDOMNode(document.getElementById('sysbolag-result'));
      domNode.scrollIntoView({behavior: "smooth", block: "start"});
    }
  }

  componentWillUnmount() {
    this.props.authUser();
    this.props.clearSysWines();
    this.props.clearInitialValues();
  }

  priceChange(e) {
    if (e.target.value) {
      this.setState({ price: true });
    } else {
      this.setState({ price: false });
    }
  }

  sendAddWineRequest(values) {
    this.props.loadAddWine(values);
  }

  sendGetSystembolagetRequest(values) {
    this.props.loadSysWines(values);
  }

  sendLoadSystembolagetRow(values) {
    values.boughtFrom = 'Systembolaget';
    this.setState({ price: true });
    this.props.setInitialValues(values);
  }

  render() {
    return (
      <div className="content">
        <div className="add-wine">
          <div className="formtitle">
            <span>Lägg till vin</span>
          </div>
          <AddWineForm
            price={this.state.price}
            priceChange={this.priceChange}
            onSubmit={this.sendAddWineRequest}
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
AddWine.propTypes = {
  loadAddWine: PropTypes.func.isRequired,
  setInitialValues: PropTypes.func.isRequired,
  enableReinitialize: PropTypes.bool,
  systemWineData: PropTypes.array,
  authUser: PropTypes.func.isRequired,
  clearSysWines: PropTypes.func.isRequired,
  clearInitialValues: PropTypes.func.isRequired,
  loadSysWines: PropTypes.func.isRequired,
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
  loadSysWines,
  loadAddWine,
  clearInitialValues,
  clearSysWines,
  authUser,
};

const SearchSysResult = ({ systemWineData, sendLoadSystembolagetRow }) => {
  const tbody = systemWineData.map((wine, index) => <Row key={index} wine={wine} sendLoadSystembolagetRow={sendLoadSystembolagetRow} />);
  return (
    <div id="sysbolag-result" className="sysWineRows">
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
              <div className="result-header">Recensera</div>
            </td>
            <td>
              <div className="result-header">Länk</div>
            </td>
          </tr>
        </thead>
        {tbody}
      </table>
    </div>);
};

const Row = ({ wine, sendLoadSystembolagetRow }) => (
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
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-link fa-lg" aria-hidden="true" onClick={() => window.open(wine.url, '_blank')} />
        </div>
      </td>
    </tr>
  </tbody>
);

export default connect(mapStateToProps, mapDispatchToProps)(AddWine);
