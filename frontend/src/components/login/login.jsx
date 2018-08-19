import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import { loginUser, authUser, setUserUnauthorized } from './actions';
import LoginForm from './loginform';

import './login.scss';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
  }

  componentWillMount() {
    this.props.authUser();
  }

  sendLoginRequest(values) {
    this.props.loginUser(values);
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    if (Cookies.get('WINE_UUID')) {
      return (
        <Redirect to={from.pathname} />
      );
    }
    return (
      <div className="login">
        <LoginForm onSubmit={this.sendLoginRequest} />
      </div>
    );
  }
}
Login.propTypes = {
  authUser: PropTypes.func.isRequired,
  location: PropTypes.object,
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = state =>
  ({
    isAuthenticated: state.loginReducer.isAuthenticated,
    fetching: state.loginReducer.fetching,
    fetched: state.loginReducer.fetched,
    error: state.loginReducer.error,
  });

const mapDispatchToProps = {
  setUserUnauthorized,
  loginUser,
  authUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
