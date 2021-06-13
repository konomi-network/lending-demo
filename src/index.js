import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { logger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from 'modules/rootReducer';

import Main from './App';

// pls install devtools to chrome: https://extension.remotedev.io/
const ENABLE_DEV_TOOLS = process.env.NODE_ENV === 'development';

const store = ENABLE_DEV_TOOLS
  ? createStore(reducers, composeWithDevTools(applyMiddleware(logger)))
  : createStore(reducers);

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

render(<App />, document.getElementById('root'));
