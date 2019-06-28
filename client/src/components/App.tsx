import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Menu } from './Menu';
import './App.css';


import { Content } from './Content';

function App() {
  return (
    <div className="app">
        <Router>
          <Menu />
          <Content />
        </Router>
    </div>
  );
}

export {
  App
};
