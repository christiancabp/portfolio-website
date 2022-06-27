import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import ThreeScene from './components/threeJS/ThreeScene';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <React.StrictMode>
      <App />
    </React.StrictMode>
    <div>
      <ThreeScene />
    </div>
  </>
);

// reportWebVitals();
