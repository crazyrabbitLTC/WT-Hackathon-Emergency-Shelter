// Import React Modules
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// Import Drizzle
import { generateContractsInitialState } from 'drizzle';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
// Import Redux
import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { sessionService } from 'redux-react-session';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './redux/reducers';
import sagas from './redux/sagas';
// Import Global Styles
import './styles/sass/sass.scss';
// Import Scenes
import Home from './layouts/Home/Home';
// Import Services
// import registerServiceWorker from './services/registerServiceWorker';
// Init Drizzle contracts
import drizzleOptions from './drizzleOptions'
// Init Saga middleware and create store
const sagaMiddleware = createSagaMiddleware();

const initialState = {
  contracts: generateContractsInitialState(drizzleOptions),
};
const store = createStore(rootReducer, initialState, compose(applyMiddleware(thunkMiddleware, sagaMiddleware)));
sagaMiddleware.run(sagas);
// Init the session service
sessionService.initSessionService(store);

ReactDOM.render(
  <DrizzleProvider options={drizzleOptions} store={store}>
    <LoadingContainer>
      <BrowserRouter>
        <Home/>
      </BrowserRouter>
    </LoadingContainer>
  </DrizzleProvider>,
  document.getElementById('root'),
);
// registerServiceWorker();
