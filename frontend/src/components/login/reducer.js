import {
  USER_LOGIN_FETCHING,
  USER_LOGIN_FULFILLED,
  USER_LOGIN_REJECTED,
  USER_AUTH_FETCHING,
  USER_AUTH_FULFILLED,
  USER_AUTH_REJECTED,
  SET_USER_AUTHORIZED,
  SET_USER_UNAUTHORIZED,
  KILL_SESSION_FULFILLED,
  KILL_SESSION_REJECTED,
  } from './constants';

const initialState = {
  redirectToReferrer: false,
  isAuthenticated: true,
  fetching: false,
  fetched: false,
  error: false,
  data: null,
  redirectedToLogin: false,
};

export default function Loginreducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN_FETCHING: {
      return { ...state,
        fetching: true,
      };
    }
    case USER_LOGIN_FULFILLED: {
      return { ...state,
        redirectToReferrer: true,
        fetching: false,
        isAuthenticated: true,
        data: action.payload,
      };
    }
    case USER_LOGIN_REJECTED: {
      return { ...state,
        fetching: false,
        isAuthenticated: false,
        data: action.payload,
      };
    }
    case USER_AUTH_FETCHING: {
      return { ...state,
        fetching: true,
      };
    }
    case USER_AUTH_FULFILLED: {
      return { ...state,
        fetching: false,
        data: action.payload,
      };
    }
    case USER_AUTH_REJECTED: {
      return { ...state,
        fetching: false,
        isAuthenticated: false,
        data: action.payload,
      };
    }
    case SET_USER_AUTHORIZED: {
      return { ...state,
        isAuthenticated: true,
      };
    }
    case SET_USER_UNAUTHORIZED: {
      return { ...state,
        isAuthenticated: false,
      };
    }
    case KILL_SESSION_FULFILLED: {
      return { ...state,
        isAuthenticated: false,
      };
    }
    case KILL_SESSION_REJECTED: {
      return { ...state,
        isAuthenticated: false,
      };
    }
    default : {
      return { ...state };
    }
  }
}
