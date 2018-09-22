import {
  SET_SCREEN_SIZE,
} from './constants';

const initialState = {
  isSmallScreen: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_SCREEN_SIZE: {
      return { ...state, isSmallScreen: action.payload };
    }
    default: {
      return { ...state };
    }
  }
}
