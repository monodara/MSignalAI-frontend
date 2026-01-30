import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.module.css'; // Import as CSS module
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MarketETFsProvider } from './context/MarketETFsContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MarketETFsProvider>
      <App />
    </MarketETFsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// to send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();