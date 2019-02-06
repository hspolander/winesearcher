import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import searchbarReducer from './components/banner/search/reducer';
import reviewResultReducer from './components/result/reducer';
import wineResultReducer from './components/result/reducer';
import addReducer from './components/add/reducer';
import loginReducer from './components/login/reducer';
import globalReducer from './components/global/reducer';

export default combineReducers({
  searchbarReducer,
  addReducer,
  reviewResultReducer,
  wineResultReducer,
  loginReducer,
  globalReducer,
  form: formReducer,
});
