import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CrosswordPuzzle from './crossword-puzzle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <CrosswordPuzzle />
  </React.StrictMode>
); 