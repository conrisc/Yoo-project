import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Menu } from './Menu';
import './App.css';


import { Content } from './Content';

function App() {
  return (
    <div className="App">
      <article className="App-header">
        <Router>
          <Menu />
          <Content />
        </Router>
      </article>
    </div>
  );
}

export {
  App
};
