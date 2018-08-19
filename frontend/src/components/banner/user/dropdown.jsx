import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import { killSession } from '../../login/actions';

import './dropdown.scss';

const Dropdown = (props) => (
  <div className="dropdown-navigation-menu">
    <ul>
      <li>
        <i className="fa fa-user" aria-hidden="true" />{Cookies.get('username')}
      </li>
      <li>
        <Link className="nostyle-link" to="/reviews">
          <i className="fa fa-search" aria-hidden="true" />Recensioner
        </Link>
      </li>
      <li>
        <Link className="nostyle-link" to="/wines">
          <i className="fa fa-flask" aria-hidden="true" />Vinförråd
        </Link>
      </li>
      <li>
        <Link className="nostyle-link" to="/addReview">
          <i className="fa fa-commenting-o" aria-hidden="true" />Recensera
        </Link>
      </li>
      <li>
        <Link className="nostyle-link" to="/addWine">
          <i className="fa fa-cart-plus" aria-hidden="true" />Lägg till i vinförråd
        </Link>
      </li>
      <li>
        <Link className="nostyle-link" onClick={() => props.killSession()} to="/">
          <i className="fa fa-sign-out" aria-hidden="true" />Logga ut
        </Link>
      </li>
    </ul>
  </div>
);

const mapDispatchToProps = {
  killSession,
};

export default connect(null, mapDispatchToProps)(Dropdown);
