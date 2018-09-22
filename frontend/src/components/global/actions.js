import {
  SET_SCREEN_SIZE,
} from './constants';

const setScreenSize = isSmall => (dispatch) => {
  dispatch({ type: SET_SCREEN_SIZE, payload: isSmall });
};

export default setScreenSize;
