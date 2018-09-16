import update from 'immutability-helper';

import {
  ADD_REVIEW_FETCHING,
  ADD_REVIEW_FULFILLED,
  ADD_REVIEW_REJECTED,
  ADD_WINE_FETCHING,
  ADD_WINE_FULFILLED,
  ADD_WINE_REJECTED,
  SET_INITIAL_VALUES,
  CLEAR_INITIAL_VALUES,
  SYSTEMBOLAGET_FETCHING,
  FETCH_SYSTEMBOLAGET_FULFILLED,
  FETCH_SYSTEMBOLAGET_REJECTED,
  FETCH_SYSTEMBOLAGET_NO_MATCH,
  FETCH_SYSTEMBOLAGETADDITIONAL_INFO_FULFILLED,
  FETCH_SYSTEMBOLAGETADDITIONAL_INFO_REJECTED,
  FETCH_SYSTEMBOLAGETADDITIONAL_INFO_NO_MATCH,
  SYSTEMBOLAGET_CLEAR_VALUES,
  FIELD_AUTOCOMPLETE_FETCHING,
  FIELD_AUTOCOMPLETE_FULFILLED,
  FIELD_AUTOCOMPLETE_REJECTED,
  FIELD_AUTOCOMPLETE_NO_MATCH,
  FIELD_AUTOCOMPLETE_CLEAR_FOCUS,
  FIELD_AUTOCOMPLETE_FOCUS_FIELD,
} from './constants';

const initialState = {
  data: null,
  fetching: false,
  fetched: false,
  fieldData: null,
  focusedField: null,
  systemWineData: null,
  initialValue: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_WINE_FETCHING: {
      return { ...state, fetching: true };
    }
    case ADD_WINE_FULFILLED: {
      return { ...state, fetched: true, fetching: false, data: action.payload };
    }
    case ADD_WINE_REJECTED: {
      return { ...state, fetched: true, fetching: false, data: null };
    }
    case ADD_REVIEW_FETCHING: {
      return { ...state, fetching: true };
    }
    case ADD_REVIEW_FULFILLED: {
      return { ...state, fetched: true, fetching: false, data: action.payload };
    }
    case ADD_REVIEW_REJECTED: {
      return { ...state, fetched: true, fetching: false, data: null };
    }
    case SET_INITIAL_VALUES: {
      return { ...state, initialValue: action.payload };
    }
    case CLEAR_INITIAL_VALUES: {
      return { ...state, initialValue: action.payload };
    }
    case FIELD_AUTOCOMPLETE_FETCHING: {
      return { ...state, fetched: false, fetching: true };
    }
    case FIELD_AUTOCOMPLETE_FULFILLED: {
      return { ...state, fetched: true, fetching: false, fieldData: action.payload };
    }
    case FIELD_AUTOCOMPLETE_NO_MATCH: {
      return { ...state, fetched: true, fetching: false, fieldData: null };
    }
    case FIELD_AUTOCOMPLETE_REJECTED: {
      return { ...state, fetched: true, fetching: false, fieldData: null };
    }
    case SYSTEMBOLAGET_FETCHING: {
      return { ...state, fetched: false, fetching: true };
    }
    case SYSTEMBOLAGET_CLEAR_VALUES: {
      return { ...state, systemWineData: action.payload };
    }
    case FETCH_SYSTEMBOLAGET_FULFILLED: {
      return { ...state, fetched: true, fetching: false, systemWineData: action.payload };
    }
    case FETCH_SYSTEMBOLAGET_REJECTED: {
      return { ...state, fetched: true, fetching: false, systemWineData: null };
    }
    case FETCH_SYSTEMBOLAGET_NO_MATCH: {
      return { ...state, fetched: true, fetching: false, systemWineData: [] };
    }
    case FETCH_SYSTEMBOLAGETADDITIONAL_INFO_FULFILLED: {
      return { ...state,
        initialValue: update(action.payload.values,
          { $merge: { comment: `\r\nAlk.: ${action.payload.values.Alkoholhalt}`, boughtFrom: 'Systembolaget', grapes: action.payload.grapes, score: 5 } }) };
    }
    case FETCH_SYSTEMBOLAGETADDITIONAL_INFO_REJECTED: {
      return { ...state,
        initialValue: update(action.payload.values,
          { $merge: { comment: `\r\nAlk.: ${action.payload.values.Alkoholhalt}`, boughtFrom: 'Systembolaget', score: 5 } }) };
    }
    case FETCH_SYSTEMBOLAGETADDITIONAL_INFO_NO_MATCH: {
      return { ...state,
        initialValue: update(action.payload.values,
          { $merge: { comment: `\r\nAlk.: ${action.payload.values.Alkoholhalt}`, boughtFrom: 'Systembolaget', score: 5 } }) };
    }
    case FIELD_AUTOCOMPLETE_CLEAR_FOCUS: {
      return { ...state, fetched: false, fetching: false, fieldData: null, focusedField: null };
    }
    case FIELD_AUTOCOMPLETE_FOCUS_FIELD: {
      return { ...state, fetched: false, fetching: false, fieldData: null, focusedField: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}
