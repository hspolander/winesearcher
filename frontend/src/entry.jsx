import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import { AppContainer } from 'react-hot-loader';
import { errorHandlerMiddleware } from './errorHandlerMiddleware';
import { authMiddleware } from './authMiddleware';

import '../css/global.scss';
import '../css/_util_global.scss';
import '../css/styles.scss';

import Client from './client';
import reducers from './reducers';

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk, promiseMiddleware(), errorHandlerMiddleware, authMiddleware));

const content = document.getElementById('content');

ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <Client />
    </Provider>
  </AppContainer>,
  content,
);

// Hotswap in changes:
if (module.hot) {
  module.hot.accept('./client', () => {
    const UpdatedApp = require('./client').default; // eslint-disable-line global-require
    ReactDOM.render(
      <AppContainer>
        <Provider store={store}>
          <UpdatedApp />
        </Provider>
      </AppContainer>,
      content,
    );
  });
}
