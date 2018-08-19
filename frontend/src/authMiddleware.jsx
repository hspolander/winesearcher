import Cookies from 'js-cookie';

export const authMiddleware = store => next => (action) => {
  try {
    if (action.payload && action.type.indexOf('@@redux') === -1) {
      console.log('action.payload');
      console.log(action.payload);
      if (action.payload && action.payload.session === 'nosession') {
        store.getState().loginReducer.isAuthenticated = false;
      } else if (action.payload && action.payload.session === 'nosessionRedirect') {
        Cookies.remove('WINE_UUID');
      }
    console.log('store.getState().loginReducer');
    console.log(store.getState().loginReducer);
    }
    next(action);
  } catch(e) {
    console.log('error occured.', e);
  }
};
