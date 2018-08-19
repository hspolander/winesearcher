import axios from 'axios';

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

const removeFromCellar = (query, dispatch) => {
  axios.get(`/api/${query}`)
  .then((response) => {
    dispatch({ type: REMOVE_FROM_CELLAR_FULFILLED, payload: response.data });
  })
  .catch((err) => {
    dispatch({ type: REMOVE_FROM_CELLAR_REJECTED, payload: err });
  });
};
const fetchClickedItem = (query, dispatch) => {
  axios.get(`/api/${query}`)
  .then((response) => {
    if (response.data.data && response.data.data.length > 0) {
      dispatch({ type: FETCH_WINES_FULFILLED, payload: response.data });
    } else {
      dispatch({ type: FETCH_WINES_NO_MATCH, data: response.data });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_WINES_REJECTED, payload: err });
  });
};

export const loadCellar = () => (dispatch) => {
  dispatch({ type: FETCH_WINES });
  fetchClickedItem('getAllCellar', dispatch);
};

export const loadCellarOrdered = item => (dispatch) => {
  dispatch({ type: FETCH_WINES });
  fetchClickedItem(`getAllCellar?orderedProp=${item.orderedProp}`, dispatch);
};

export const removeWineFromCellar = id => (dispatch) => {
  dispatch({ type: REMOVE_FROM_CELLAR });
  removeFromCellar(`removeFromCellar?id=${id}`, dispatch);
};

export const toggleDetailedView = id => (dispatch) => {
  dispatch({ type: TOGGLE_DETAILED_WINE_RESULT_VIEW });
};
