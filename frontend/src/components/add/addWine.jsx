import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddWineForm from './addWineForm';
import SearchSysForm from './searchSysForm';
import {
  sendLoadSystembolagetAddRow,
  sendLoadSystembolagetImage,
  clearInitialValues,
  setInitialValues,
  showImageOfWine,
  hideImageOfWine,
  clearSysWines,
  loadSysWines,
  loadAddWine,
} from './actions';
import { authUser } from '../login/actions';

import './add.scss';

class AddWine extends React.Component {

  constructor() {
    super();
    this.sendGetSystembolagetRequest = this.sendGetSystembolagetRequest.bind(this);
  }

  componentWillMount() {
    this.props.authUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.systemWineData) {
      if (!prevProps.systemWineData || this.props.systemWineData.length !== prevProps.systemWineData.length) {
        const domNode = ReactDOM.findDOMNode(document.getElementById('sysbolag-result'));
        domNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

  render() {
    return (
      <div className="content">
        <div className="add-wine">
          <div className="formtitle">
            <span>Lägg till vin</span>
          </div>
          <AddWineForm
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
                <SearchSysResult
                  systemWineData={this.props.systemWineData}
                  sendLoadSystembolagetRow={this.props.sendLoadSystembolagetAddRow}
                  sendLoadSystembolagetImage={this.props.sendLoadSystembolagetImage}
                  showImageOfWine={this.props.showImageOfWine}
                  hideImageOfWine={this.props.hideImageOfWine}
                />
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
  sendLoadSystembolagetImage: PropTypes.func.isRequired,
  systemWineData: PropTypes.array,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
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
  sendLoadSystembolagetAddRow,
  sendLoadSystembolagetImage,
  clearInitialValues,
  setInitialValues,
  showImageOfWine,
  hideImageOfWine,
  clearSysWines,
  loadSysWines,
  loadAddWine,
  authUser,
};

const SearchSysResult = (props) => {
  const tbody = props.systemWineData.map((wine, index) =>
    <Row
      key={index}
      wine={wine}
      rowId={index}
      sendLoadSystembolagetRow={props.sendLoadSystembolagetRow}
      sendLoadSystembolagetImage={props.sendLoadSystembolagetImage}
      showImageOfWine={props.showImageOfWine}
      hideImageOfWine={props.hideImageOfWine}
    />);
  return (
    <div id="sysbolag-result" className="sysWineRows">
      <table className="single-systembolag-table">
        <thead>
          <tr>
            <td>
              <div className="result-header">Namn</div>
            </td>
            <td>
              <div className="result-header">Bild</div>
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
        { tbody }
      </table>
    </div>
  );
};
SearchSysResult.propTypes = {
  sendLoadSystembolagetRow: PropTypes.func.isRequired,
  sendLoadSystembolagetImage: PropTypes.func.isRequired,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
  systemWineData: PropTypes.array,
};

const Row = props => (
  <tbody>
    <tr>
      <td>
        <div className="sys-wine-td">{props.wine.name}</div>
      </td>
      <td>
        <div className="sys-wine-td">
          {
            props.wine.image !== null ? <i
              className="fa fa-image fa-lg"
              aria-hidden="true"
              onMouseEnter={() => props.showImageOfWine(props.wine, props.rowId)}
              onMouseLeave={() => props.hideImageOfWine(props.rowId)}
            /> :
            <i
              className="fa fa-image fa-lg disabled"
              aria-hidden="true"
            />
          }
          {
            props.wine.image && props.wine.imageVisible &&
            <div>
              <img alt="Bild på vin" className="sysWineImage" src={props.wine.image} />
            </div>
          }
        </div>
      </td>
      <td>
        <div className="sys-wine-td">{props.wine.year}</div>
      </td>
      <td>
        <div className="sys-wine-td">{props.wine.country}</div>
      </td>
      <td>
        <div className="sys-wine-td">{props.wine.color}</div>
      </td>
      <td>
        <div className="sys-wine-td">{props.wine.container}</div>
      </td>
      <td>
        <div className="sys-wine-td">{props.wine.producer}</div>
      </td>
      <td>
        <div className="sys-wine-td">{props.wine.price}</div>
      </td>
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-plus-square-o" aria-hidden="true" onClick={() => props.sendLoadSystembolagetRow(props.wine)} />
        </div>
      </td>
      <td>
        <div className="sys-wine-td">
          <i className="fa fa-link fa-lg" aria-hidden="true" onClick={() => window.open(props.wine.url, '_blank')} />
        </div>
      </td>
    </tr>
  </tbody>
);
Row.propTypes = {
  sendLoadSystembolagetRow: PropTypes.func.isRequired,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
  rowId: PropTypes.number.isRequired,
  wine: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWine);
