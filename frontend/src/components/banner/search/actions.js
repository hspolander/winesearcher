import axios from 'axios';

import {
  FETCH_AUTOCOMPLETE_FULFILLED,
  FETCH_AUTOCOMPLETE_NO_MATCH,
  FETCH_AUTOCOMPLETE_REJECTED,
  FETCH_AUTOCOMPLETE_TYPING,
  FETCH_AUTOCOMPLETE,
} from './constants';

const fetchAutocompleteSearch = (input, dispatch) => {
  axios.get(`/api/autocompleteSearch?startsWith=${input}`)
  .then((response) => {
    if (response.data.error) {
      dispatch({ type: FETCH_AUTOCOMPLETE_REJECTED, payload: response.data });
    } else if (Object.keys(response.data.data).length === 0) {
      dispatch({ type: FETCH_AUTOCOMPLETE_NO_MATCH, payload: response.data });
    } else {
      dispatch({ type: FETCH_AUTOCOMPLETE_FULFILLED, payload: response.data });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_AUTOCOMPLETE_REJECTED, payload: err });
  });
};

const loadAutocompleteSearch = input => (dispatch, getState) => {
  if (input.length > 1) {
    dispatch({ type: FETCH_AUTOCOMPLETE });
    fetchAutocompleteSearch(input, dispatch, getState);
  } else {
    dispatch({ type: FETCH_AUTOCOMPLETE_TYPING });
  }
};

export default loadAutocompleteSearch;
