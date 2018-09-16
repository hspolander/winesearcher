import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddReviewForm from './addReviewForm';
import SearchSysForm from './searchSysForm';
import { loadAddReview, loadSysWines, setInitialValues, resetForm, clearInitialValues, clearSysWines, sendLoadSystembolagetRow } from './actions';
import { authUser } from '../login/actions';

import './add.scss';

class AddReview extends React.Component {

  constructor() {
    super();
    this.sendAddReviewRequest = this.sendAddReviewRequest.bind(this);
    this.sendGetSystembolagetRequest = this.sendGetSystembolagetRequest.bind(this);
  }

  componentWillMount() {
    this.props.authUser();
    if (this.props.navigatedInitialValues) {
      this.props.setInitialValues(navigatedInitialValues);
    } else {
      resetForm('WineReview');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.systemWineData && this.props.systemWineData.length > 0 && this.props.systemWineData !== prevProps.systemWineData) {
      const domNode = ReactDOM.findDOMNode(document.getElementById('sysbolag-result'));
      domNode.scrollIntoView({behavior: "smooth", block: "start"});
    }
  }

  componentWillUnmount() {
    this.props.clearSysWines();
    this.props.clearInitialValues();
  }

  sendAddReviewRequest(values) {
    this.props.loadAddReview(values);
  }

  sendGetSystembolagetRequest(values) {
    this.props.loadSysWines(values);
    const domNode = ReactDOM.findDOMNode(document.getElementById('review-formtitle'));
    domNode.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    return (
      <div className="content">
        <div className="add-wine">
          <div className="formtitle" id="review-formtitle">
            <span>Skriv recension</span>
          </div>
          <AddReviewForm
            onSubmit={this.sendAddReviewRequest}
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
                <SearchSysResult systemWineData={this.props.systemWineData} sendLoadSystembolagetRow={this.props.sendLoadSystembolagetRow} />
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
  authUser: PropTypes.func.isRequired,
  loadAddReview: PropTypes.func.isRequired,
  loadSysWines: PropTypes.func.isRequired,
  clearSysWines: PropTypes.func.isRequired,
  clearInitialValues: PropTypes.func.isRequired,
  setInitialValues: PropTypes.func.isRequired,
  sendLoadSystembolagetRow: PropTypes.func.isRequired,
  systemWineData: PropTypes.array,
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
  sendLoadSystembolagetRow,
  clearSysWines,
  authUser,
};

const SearchSysResult = (props) => {
  const tbody = props.systemWineData.map( (wine, index) => <Row key={index} wine={wine} sendLoadSystembolagetRow={props.sendLoadSystembolagetRow} />);
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
              <div className="result-header">Lägg till recension</div>
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
  systemWineData: PropTypes.array,
};

const Row = props => (
  <tbody>
    <tr>
      <td>
        <div className="sys-wine-td">{props.wine.name}</div>
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
          <i className="fa fa-plus-square-o  fa-lg" aria-hidden="true" onClick={() => props.sendLoadSystembolagetRow(props.wine)} />
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
  wine: PropTypes.object.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(AddReview);
