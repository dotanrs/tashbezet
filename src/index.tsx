import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PostHogProvider } from 'posthog-js/react';
import CrosswordPuzzle from './crossword-puzzle';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={process.env.REACT_APP_POSTHOG_KEY || ''}
      options={{
        api_host: process.env.REACT_APP_POSTHOG_HOST,
        capture_exceptions: true,
      }}
    >
      <CrosswordPuzzle />
    </PostHogProvider>
  </React.StrictMode>
);
