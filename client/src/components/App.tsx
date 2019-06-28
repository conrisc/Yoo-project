import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './Header';
import './App.css';


import { Content } from './Content';

function App() {
  return (
    <div className="app">
        <Router>
          <Header />
          <Content />
        </Router>
    </div>
  );
}

export {
  App
};
