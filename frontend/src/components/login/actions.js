import axios from 'axios';
import Cookies from 'js-cookie';

import {
  USER_LOGIN_FETCHING,
  USER_LOGIN_FULFILLED,
  USER_LOGIN_REJECTED,
  USER_AUTH_FETCHING,
  USER_AUTH_FULFILLED,
  USER_AUTH_REJECTED,
  SET_USER_UNAUTHORIZED,
  KILL_SESSION_FULFILLED,
  KILL_SESSION_REJECTED,
  } from './constants';

export const loginUser = values => (dispatch) => {
  dispatch({ type: USER_LOGIN_FETCHING });
  sendLoginRequest(values, dispatch);
};

export const authUser = () => (dispatch) => {
  sendAuthRequest(dispatch);
};

export const killSession = () => (dispatch) => {
  axios.get('/api/killSession')
  .then((response) => {
    dispatch({ type: KILL_SESSION_FULFILLED, payload: response.data });
  })
  .catch((err) => {
    dispatch({ type: KILL_SESSION_REJECTED, payload: err });
  });
};

export const setUserUnauthorized = () => dispatch => (
  dispatch({ type: SET_USER_UNAUTHORIZED })
);

const sendLoginRequest = (values, dispatch) => {
  axios.post('/api/login', values)
  .then((response) => {
    Cookies.set('username', response.data.data.login.username);
    Cookies.set('WINE_UUID', response.data.data.UUID);
    dispatch({ type: USER_LOGIN_FULFILLED, payload: response.data });
  })
  .catch((err) => {
    dispatch({ type: USER_LOGIN_REJECTED, payload: err });
  });
};

const sendAuthRequest = (dispatch) => {
  dispatch({ type: USER_AUTH_FETCHING });
  axios.get('/api/keepalive')
  .then((response) => {
    dispatch({ type: USER_AUTH_FULFILLED, payload: response.data });
  })
  .catch((err) => {
    dispatch({ type: USER_AUTH_REJECTED, payload: err });
  });
};
