import {
  FETCH_AUTOCOMPLETE_FULFILLED,
  FETCH_AUTOCOMPLETE_NO_MATCH,
  FETCH_AUTOCOMPLETE_REJECTED,
  FETCH_AUTOCOMPLETE_TYPING,
  FETCH_AUTOCOMPLETE,
} from './constants';

export default function searchbarReducer(state = { data: null, fetching: false, fetched: false, typing: false, match: true }, action) {
  switch (action.type) {
    case FETCH_AUTOCOMPLETE: {
      return { ...state, fetching: true, fetched: false };
    }
    case FETCH_AUTOCOMPLETE_TYPING: {
      return { ...state, fetching: false, fetched: false, typing: true, match: true };
    }
    case FETCH_AUTOCOMPLETE_NO_MATCH: {
      return { ...state, fetching: false, fetched: false, typing: true, match: false, data: action.payload };
    }
    case FETCH_AUTOCOMPLETE_REJECTED: {
      return { ...state, fetching: false, match: false, data: null };
    }
    case FETCH_AUTOCOMPLETE_FULFILLED: {
      return { ...state, fetching: false, fetched: true, match: true, data: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}
