import axios from 'axios';

import {
  TOGGLE_DETAILED_REVIEW_RESULT_VIEW,
  FETCH_REVIEWS_FULFILLED,
  FETCH_REVIEWS_REJECTED,
  FETCH_REVIEWS_NO_MATCH,
  FETCH_REVIEWS,
} from './constants';

const fetchClickedItem = (query, dispatch) => {
  axios.get(`/api/${query}`)
  .then((response) => {
    if (response.data.data && response.data.data.length > 0) {
      dispatch({ type: FETCH_REVIEWS_FULFILLED, payload: response.data });
    } else {
      dispatch({ type: FETCH_REVIEWS_NO_MATCH, payload: response.data });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_REVIEWS_REJECTED, payload: err });
  });
};

export const loadClickedItem = item => (dispatch, getState) => {
  dispatch({ type: FETCH_REVIEWS });
  if (!item.table) {
    fetchClickedItem('getAllReviews', dispatch, getState);
  } else if (item.table === 'wine') {
    fetchClickedItem(`getWineByProperty?property=${item.property}&value=${item.value}&table=${item.table}`, dispatch, getState);
  } else {
    fetchClickedItem(`getWineByForeignProperty?property=${item.property}&value=${item.value}&table=${item.table}`, dispatch, getState);
  }
};

export const loadOrderedClickedItem = item => (dispatch, getState) => {
  dispatch({ type: FETCH_REVIEWS });
  if (!item.table) {
    fetchClickedItem(`getAllReviews?orderedProp=${item.orderedProp}`, dispatch, getState);
  } else if (item.table === 'wine') {
    fetchClickedItem(`getWineByProperty?property=${item.property}&value=${item.value}&table=${item.table}&orderedProp=${item.orderedProp}`, dispatch, getState);
  } else {
    fetchClickedItem(`getWineByForeignProperty?property=${item.property}&value=${item.value}&table=${item.table}&orderedProp=${item.orderedProp}`, dispatch, getState);
  }
};

export const loadOrderedCellarClickedItem = item => (dispatch, getState) => {
  dispatch({ type: FETCH_REVIEWS });
  if (!item.table) {
    fetchClickedItem(`getAllCellar?orderedProp=${item.orderedProp}`, dispatch, getState);
  } else if (item.table === 'wine') {
    fetchClickedItem(`getWineByProperty?property=${item.property}&value=${item.value}&table=${item.table}&orderedProp=${item.orderedProp}`, dispatch, getState);
  } else {
    fetchClickedItem(`getWineByForeignProperty?property=${item.property}&value=${item.value}&table=${item.table}&orderedProp=${item.orderedProp}`, dispatch, getState);
  }
};

export const toggleDetailedView = id => (dispatch) => {
  dispatch({ type: TOGGLE_DETAILED_REVIEW_RESULT_VIEW });
};
