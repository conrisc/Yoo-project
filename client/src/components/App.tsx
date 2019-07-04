import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './Header';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './App.css';


import { Content } from './Content';

const initialState = {
  login: sessionStorage.getItem('login') || '',
  token: sessionStorage.getItem('token') || ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_LOGIN':
      return { ...state, login: action.login };
    case 'CHANGE_TOKEN':
      return { ...state, token: action.token };
    default:
      return state;
    }
};

const store = createStore(reducer);

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
