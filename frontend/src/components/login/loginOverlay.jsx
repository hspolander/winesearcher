import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loginUser, authUser } from './actions';
import LoginForm from './loginform';

import './login.scss';

class LoginOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.sendLoginRequest = this.sendLoginRequest.bind(this);
  }

  sendLoginRequest(values) {
    this.props.loginUser(values);
  }

  render() {
    return (
      <div>
        { !this.props.isAuthenticated && <div className="loginOverlay" />}
        { !this.props.isAuthenticated &&
          <div className="login overlay" >
            <div className="sessionExpired"> Din session har tagit slut. Vänligen logga in igen för att fortsätta.</div>
            <LoginForm onSubmit={this.sendLoginRequest} />
          </div>
        }
      </div>
    );
  }
}
LoginOverlay.propTypes = {
  loginUser: PropTypes.func.isRequired,
};

const mapStateToProps = state =>
  ({
    redirectToReferrer: state.loginReducer.redirectToReferrer,
    isAuthenticated: state.loginReducer.isAuthenticated,
    fetching: state.loginReducer.fetching,
    fetched: state.loginReducer.fetched,
    error: state.loginReducer.error,
    redirectedToLogin: state.loginReducer.redirectedToLogin,
  });

const mapDispatchToProps = {
  loginUser,
  authUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginOverlay);
