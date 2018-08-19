import React from 'react';
import { connect } from 'react-redux';

import Menu from './user/menu';
import Logo from './logo';
import Search from './search/search';

import './banner.scss';

const Banner = (props) => (
  <div className="banner-main">
    <Logo />
    { props.isAuthenticated && <Search /> }
    { props.isAuthenticated && <Menu /> }
  </div>
);

const mapStateToProps = state =>
  ({
    isAuthenticated: state.loginReducer.isAuthenticated,
  });

export default connect(mapStateToProps, null)(Banner);
