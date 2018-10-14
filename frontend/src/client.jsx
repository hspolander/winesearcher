import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'js-cookie';

import Banner from './components/banner/banner';
import AddWine from './components/add/addWine';
import AddReview from './components/add/addReview';
import WineResult from './components/wineresult/wineResult';
import LoginOverlay from './components/login/loginOverlay';
import ReviwResult from './components/reviewresult/reviewResult';
import Login from './components/login/login';

import PrivateRoute from './components/global/privateRoute';

import './client.scss';

const Client = () => (
  <BrowserRouter>
    <div>
      <Banner />
      { Cookies.get('WINE_UUID') && <LoginOverlay /> }
      <div className="main-content">
        <Switch>
          <PrivateRoute path="/addwine" component={AddWine} />
          <PrivateRoute path="/addreview" component={AddReview} />
          <PrivateRoute path="/wines" component={WineResult} />
          <PrivateRoute path="/reviews/:table?/:property?/:value?" component={ReviwResult} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" component={AddWine} />
        </Switch>
      </div>
    </div>
  </BrowserRouter>
);

const mapStateToProps = state =>
  ({
    isAuthenticated: state.loginReducer.isAuthenticated,
  });

export default connect(mapStateToProps, null)(Client);
