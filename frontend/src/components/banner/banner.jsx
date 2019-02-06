import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Logout from './logout';
import Logo from './logo';
import Search from './search/search';

import './banner.scss';

const Banner = props => (
  <div className="banner-main">
    <Logo />
    { props.isAuthenticated && <Search /> }
    { props.isAuthenticated && <Logout /> }
  </div>
);

Banner.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state =>
  ({
    isAuthenticated: state.loginReducer.isAuthenticated,
  });

export default connect(mapStateToProps, null)(Banner);
