import React from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import { authUser } from '../login/actions';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={
    props => (
    Cookies.get('WINE_UUID') ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: props.location },
        }}
      />
    )
  )}
  />
);
PrivateRoute.propTypes = {
  location: PropTypes.object.isRequired,
  component: PropTypes.func.isRequired,
};

const mapStateToProps = state =>
  ({
    isAuthenticated: state.loginReducer.isAuthenticated,
  });

const mapDispatchToProps = {
  authUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PrivateRoute));
