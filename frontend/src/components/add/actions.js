import axios from 'axios';
import { reset } from 'redux-form';
import { jsonToQueryString } from '../global/helpfunctions';

import {
  ADD_WINE_FETCHING,
  ADD_WINE_FULFILLED,
  ADD_WINE_REJECTED,
  ADD_REVIEW_FETCHING,
  ADD_REVIEW_FULFILLED,
  ADD_REVIEW_REJECTED,
  SYSTEMBOLAGET_FETCHING,
  SET_INITIAL_VALUES,
  SHOW_WINE_IMAGE,
  HIDE_WINE_IMAGE,
  CLEAR_INITIAL_VALUES,
  FETCH_SYSTEMBOLAGET_GRAPES_REVIEW_INFO_FULFILLED,
  FETCH_SYSTEMBOLAGET_GRAPES_REVIEW_INFO_REJECTED,
  FETCH_SYSTEMBOLAGET_GRAPES_REVIEW_INFO_NO_MATCH,
  FETCH_SYSTEMBOLAGET_GRAPES_ADD_INFO_FULFILLED,
  FETCH_SYSTEMBOLAGET_GRAPES_ADD_INFO_REJECTED,
  FETCH_SYSTEMBOLAGET_GRAPES_ADD_INFO_NO_MATCH,
  FETCH_SYSTEMBOLAGET_IMAGE_INFO_FULFILLED,
  FETCH_SYSTEMBOLAGET_IMAGE_INFO_REJECTED,
  FETCH_SYSTEMBOLAGET_IMAGE_INFO_NO_MATCH,
  FETCH_SYSTEMBOLAGET_FULFILLED,
  FETCH_SYSTEMBOLAGET_REJECTED,
  FETCH_SYSTEMBOLAGET_NO_MATCH,
  SYSTEMBOLAGET_CLEAR_VALUES,
  FIELD_AUTOCOMPLETE_FETCHING,
  FIELD_AUTOCOMPLETE_FULFILLED,
  FIELD_AUTOCOMPLETE_REJECTED,
  FIELD_AUTOCOMPLETE_NO_MATCH,
  FIELD_AUTOCOMPLETE_CLEAR_FOCUS,
  FIELD_AUTOCOMPLETE_FOCUS_FIELD,
} from './constants';


const addWine = (values, dispatch) => {
  axios.post('/api/insertWineToCellar', values)
  .then((response) => {
    dispatch({ type: ADD_WINE_FULFILLED, payload: response.data });
    alert('Vi har lagt till ditt vin i vinkällaren');
    dispatch(setInitialValues(null));
    dispatch(reset('AddWineForm'));
  })
  .catch((err) => {
    dispatch({ type: ADD_WINE_REJECTED, payload: err });
    alert('Något gick fel, vänligen sök hjälp hos din make');
  });
};

const addReview = (values, dispatch) => {
  axios.post('/api/insertWineReview', values)
  .then((response) => {
    dispatch({ type: ADD_REVIEW_FULFILLED, payload: response.data });
    alert('Vi har lagt till ditt vin');
    dispatch(setInitialValues(null));
    dispatch(reset('WineReview'));
  })
  .catch((err) => {
    dispatch({ type: ADD_REVIEW_REJECTED, payload: err });
    alert('Något gick fel, vänligen sök hjälp hos din make');
  });
};

const fieldAutocomplete = (value, dispatch) => {
  axios.get(`/api/autocompleteAddWine${value}`)
  .then((response) => {
    if (response.data && response.data.data) {
      dispatch({ type: FIELD_AUTOCOMPLETE_FULFILLED, payload: response.data.data });
    } else {
      dispatch({ type: FIELD_AUTOCOMPLETE_NO_MATCH });
    }
  })
  .catch((err) => {
    dispatch({ type: FIELD_AUTOCOMPLETE_REJECTED, payload: err });
  });
};

const getSysWines = (values, dispatch) => {
  axios.get(`/api/getSysWines${values}`)
  .then((response) => {
    if (response.data && response.data.data.length > 0) {
      dispatch({ type: FETCH_SYSTEMBOLAGET_FULFILLED, payload: response.data.data });
    } else {
      dispatch({ type: FETCH_SYSTEMBOLAGET_NO_MATCH });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_SYSTEMBOLAGET_REJECTED, payload: err });
  });
};

const getSysWineGrapesReviewInfo = (values, dispatch) => {
  axios.post('/api/getSysWineGrapesInfo', { url: values.url })
  .then((response) => {
    if (response.data && response.data.data.length > 0) {
      dispatch({ type: FETCH_SYSTEMBOLAGET_GRAPES_REVIEW_INFO_FULFILLED, payload: { grapes: response.data.data, values } });
    } else {
      dispatch({ type: FETCH_SYSTEMBOLAGET_GRAPES_REVIEW_INFO_NO_MATCH, payload: values });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_SYSTEMBOLAGET_GRAPES_REVIEW_INFO_REJECTED, payload: values, err });
  });
};

const getSysWineGrapesAddInfo = (values, dispatch) => {
  axios.post('/api/getSysWineGrapesInfo', { url: values.url })
  .then((response) => {
    if (response.data && response.data.data.length > 0) {
      dispatch({ type: FETCH_SYSTEMBOLAGET_GRAPES_ADD_INFO_FULFILLED, payload: { grapes: response.data.data, values } });
    } else {
      dispatch({ type: FETCH_SYSTEMBOLAGET_GRAPES_ADD_INFO_NO_MATCH, payload: values });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_SYSTEMBOLAGET_GRAPES_ADD_INFO_REJECTED, payload: values, err });
  });
};

const getSysWineImageInfo = async (values, rowId, dispatch) => {
  await axios.post('/api/getSysWineImageInfo', { url: values.url })
  .then((response) => {
    if (response.data && response.data.data) {
      dispatch({ type: FETCH_SYSTEMBOLAGET_IMAGE_INFO_FULFILLED, payload: { image: response.data.data, values, rowId } });
    } else {
      dispatch({ type: FETCH_SYSTEMBOLAGET_IMAGE_INFO_NO_MATCH, payload: { image: response.data.data, values, rowId } });
    }
  })
  .catch((err) => {
    dispatch({ type: FETCH_SYSTEMBOLAGET_IMAGE_INFO_REJECTED, payload: values, err });
  });
};

export const loadAddReview = values => (dispatch) => {
  dispatch({ type: ADD_REVIEW_FETCHING });
  addReview(values, dispatch);
};

export const loadAddWine = values => (dispatch) => {
  dispatch({ type: ADD_WINE_FETCHING });
  addWine(values, dispatch);
};

export const loadSysWines = values => (dispatch) => {
  dispatch({ type: SYSTEMBOLAGET_FETCHING });
  getSysWines(jsonToQueryString(values), dispatch);
};

export const clearSysWines = () => (dispatch) => {
  dispatch({ type: SYSTEMBOLAGET_CLEAR_VALUES, payload: null });
};

export const resetForm = name => (dispatch) => {
  dispatch(setInitialValues(null));
  dispatch(reset(name));
};

export const setInitialValuesResult = values => (dispatch) => {
  dispatch(setInitialValues(values));
};

export const sendLoadSystembolagetAddRow = values => (dispatch) => {
  getSysWineGrapesAddInfo(values, dispatch);
};

export const sendLoadSystembolagetReviewRow = values => (dispatch) => {
  getSysWineGrapesReviewInfo(values, dispatch);
};

export const sendLoadSystembolagetImage = (values, rowId) => (dispatch) => {
  getSysWineImageInfo(values, rowId, dispatch);
};

export const showImageOfWine = (values, rowId) => async (dispatch) => {
  if (!values.image) {
    await getSysWineImageInfo(values, rowId, dispatch);
  }
  dispatch({ type: SHOW_WINE_IMAGE, payload: rowId });
};

export const hideImageOfWine = rowId => (dispatch) => {
  dispatch({ type: HIDE_WINE_IMAGE, payload: rowId });
};

export const clearInitialValues = () => (dispatch) => {
  dispatch({ type: CLEAR_INITIAL_VALUES, payload: null });
};

export const loadFieldAutocomplete = (prop, value) => (dispatch) => {
  if (value.length > 3) {
    dispatch({ type: FIELD_AUTOCOMPLETE_FETCHING });
    if (prop === 'grape') {
      fieldAutocomplete(`?&startsWith=${value}`, dispatch);
    } else {
      fieldAutocomplete(`?&startsWith=${value}&prop=${prop}`, dispatch);
    }
  } else {
    dispatch({ type: FIELD_AUTOCOMPLETE_NO_MATCH });
  }
};

export const setInitialValues = values => ({
  type: SET_INITIAL_VALUES,
  payload: values,
});

export const onClearFieldFocus = () => ({
  type: FIELD_AUTOCOMPLETE_CLEAR_FOCUS,
});

export const onFieldFocus = field => ({
  type: FIELD_AUTOCOMPLETE_FOCUS_FIELD,
  payload: field,
});
