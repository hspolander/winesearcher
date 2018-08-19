import {
  FETCH_REVIEWS_FULFILLED,
  FETCH_REVIEWS_REJECTED,
  FETCH_REVIEWS_NO_MATCH,
  FETCH_REVIEWS,
} from './constants';

const initialState = { reviews: null, error: null, fetching: false, fetched: false, initialValues: null };

export default function reviewResultReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_REVIEWS: {
      return { ...state, fetching: true, reviews: null };
    }
    case FETCH_REVIEWS_NO_MATCH: {
      return { ...state, fetching: false, fetched: true, reviews: action.payload };
    }
    case FETCH_REVIEWS_REJECTED: {
      return { ...state, fetching: false, error: action.payload };
    }
    case FETCH_REVIEWS_FULFILLED: {
      return { ...state, fetching: false, fetched: true, reviews: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}
