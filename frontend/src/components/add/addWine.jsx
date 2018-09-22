import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddWineForm from './addWineForm';
import SearchSysForm from './searchSysForm';
import SearchSysResult from './searchSysResult';
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
import setScreenSize from '../global/actions';

import './add.scss';

class AddWine extends React.Component {

  constructor() {
    super();
    this.sendGetSystembolagetRequest = this.sendGetSystembolagetRequest.bind(this);
  }

  componentDidMount() {
    this.props.authUser();
    if (window.innerWidth <= 1024) {
      this.props.setScreenSize(true);
    } else {
      this.props.setScreenSize(false);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.systemWineData) {
      if (!prevProps.systemWineData || this.props.systemWineData.length !== prevProps.systemWineData.length) {
        const domNode = ReactDOM.findDOMNode(document.getElementById('sysbolag-result'));
        domNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (this.props.formValues) {
      if (!prevProps.formValues || prevProps.formValues.name !== prevProps.systemWineData.name) {
        const domNode = ReactDOM.findDOMNode(document.getElementById('addwine-formtitle'));
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
          <div className="formtitle" id="addwine-formtitle">
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
                  sendLoadSystembolagetRow={this.props.sendLoadSystembolagetAddRow}
                  sendLoadSystembolagetImage={this.props.sendLoadSystembolagetImage}
                  showImageOfWine={this.props.showImageOfWine}
                  hideImageOfWine={this.props.hideImageOfWine}
                  systemWineData={this.props.systemWineData}
                  isSmallScreen={this.props.isSmallScreen}
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
  setScreenSize: PropTypes.func.isRequired,
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
    formValues: state.addReducer.initialValue,
    isSmallScreen: state.globalReducer.isSmallScreen,
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
  setScreenSize,
  loadSysWines,
  loadAddWine,
  authUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddWine);
