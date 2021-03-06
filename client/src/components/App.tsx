import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './App.css';


import { Header } from './Header';
import { Content } from './Content';
import { Footer}  from './Footer';
import { ToastBox } from './ToastBox';

const notifications: any[] = [];

const initialState = {
  login: sessionStorage.getItem('login') || '',
  token: sessionStorage.getItem('token') || '',
  notifications
};

const reducer = (state = initialState, action) => {
  let notifications;
  switch (action.type) {
    case 'CHANGE_LOGIN':
      return { ...state, login: action.login };
    case 'CHANGE_TOKEN':
      return { ...state, token: action.token };
    case 'PUSH_NOTIFICATION':
      notifications = [action.notification, ...(state.notifications)];
      return { ...state, notifications };
    case 'DISMISS_NOTIFICATION':
      notifications = state.notifications.filter(notification => notification !== action.notification);
      return { ...state, notifications };
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
            <ToastBox />
            <Header />
            <Content />
            <Footer />
          </Provider>
        </Router>
    </div>
  );
}

export {
  App
};
