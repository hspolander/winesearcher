import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { killSession } from '../login/actions';

import './logout.scss';

const Logout = props => (
  <div className="banner-logout">
    <Link className="nostyle-link" onClick={() => props.killSession()} to="/">
      <div className="icons-menu">
        <i className="fa fa-3x fa-sign-out" />
        <i className="icon-title">Logga ut</i>
      </div>
    </Link>
  </div>
);

const mapDispatchToProps = {
  killSession,
};

export default connect(null, mapDispatchToProps)(Logout);
