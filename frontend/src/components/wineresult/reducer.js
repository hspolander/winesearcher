import {
  FETCH_WINES_FULFILLED,
  FETCH_WINES_REJECTED,
  FETCH_WINES_NO_MATCH,
  FETCH_WINES,
  REMOVE_FROM_CELLAR_FULFILLED,
  REMOVE_FROM_CELLAR_REJECTED,
  REMOVE_FROM_CELLAR,
  TOGGLE_DETAILED_WINE_RESULT_VIEW,
} from './constants';

const initialState = { wines: null, error: null, fetching: false, fetched: false, detailedView: true };

export default function wineResultReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_WINES: {
      return { ...state, fetching: true, wines: null };
    }
    case FETCH_WINES_NO_MATCH: {
      return { ...state, fetching: false, fetched: false, wines: action.payload };
    }
    case FETCH_WINES_REJECTED: {
      return { ...state, fetching: false, error: action.payload };
    }
    case FETCH_WINES_FULFILLED: {
      return { ...state, fetching: false, fetched: true, wines: action.payload };
    }
    case REMOVE_FROM_CELLAR_FULFILLED: {
      return { ...state };
    }
    case REMOVE_FROM_CELLAR_REJECTED: {
      return { ...state };
    }
    case TOGGLE_DETAILED_WINE_RESULT_VIEW: {
      return { ...state, detailedView: !state.detailedView };
    }
    case REMOVE_FROM_CELLAR: {
      return { ...state };
    }
    default: {
      return { ...state };
    }
  }
}
