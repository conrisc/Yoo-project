import React from 'react';
import { Menu } from './Menu';
import './App.css';

import { Content } from './Content';

function App() {
  return (
    <div className="App">
      <article className="App-header">
        <Menu />
        <Content />
      </article>
    </div>
  );
}

export {
  App
};
