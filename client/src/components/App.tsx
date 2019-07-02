import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './Header';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './App.css';


import { Content } from './Content';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_LOGIN':
      return { ...state, login: action.newLogin };
    default:
      return state;
    }
};

// @ts-ignore
const store = createStore(reducer, { login: '' });

function App() {
  return (
    <div className="app">
        <Router>
          <Provider store={store}>
            <Header />
            <Content />
          </Provider>
        </Router>
    </div>
  );
}

export {
  App
};
