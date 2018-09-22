import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AddReviewForm from './addReviewForm';
import SearchSysForm from './searchSysForm';
import SearchSysResult from './searchSysResult';

import {
  sendLoadSystembolagetReviewRow,
  sendLoadSystembolagetImage,
  clearInitialValues,
  setInitialValues,
  showImageOfWine,
  hideImageOfWine,
  clearSysWines,
  loadAddReview,
  loadSysWines,
  resetForm,
  } from './actions';

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

  sendAddReviewRequest(values) {
    this.props.loadAddReview(values);
  }

  sendGetSystembolagetRequest(values) {
    this.props.loadSysWines(values);
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
                <SearchSysResult
                  sendLoadSystembolagetRow={this.props.sendLoadSystembolagetReviewRow}
                  sendLoadSystembolagetImage={this.props.sendLoadSystembolagetImage}
                  showImageOfWine={this.props.showImageOfWine}
                  hideImageOfWine={this.props.hideImageOfWine}
                  systemWineData={this.props.systemWineData}
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
AddReview.propTypes = {
  authUser: PropTypes.func.isRequired,
  loadAddReview: PropTypes.func.isRequired,
  loadSysWines: PropTypes.func.isRequired,
  clearSysWines: PropTypes.func.isRequired,
  clearInitialValues: PropTypes.func.isRequired,
  setInitialValues: PropTypes.func.isRequired,
  sendLoadSystembolagetReviewRow: PropTypes.func.isRequired,
  sendLoadSystembolagetImage: PropTypes.func.isRequired,
  systemWineData: PropTypes.array,
  showImageOfWine: PropTypes.func.isRequired,
  hideImageOfWine: PropTypes.func.isRequired,
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
  sendLoadSystembolagetReviewRow,
  sendLoadSystembolagetImage,
  clearInitialValues,
  setInitialValues,
  showImageOfWine,
  hideImageOfWine,
  loadAddReview,
  clearSysWines,
  loadSysWines,
  resetForm,
  authUser,
};


export default connect(mapStateToProps, mapDispatchToProps)(AddReview);
