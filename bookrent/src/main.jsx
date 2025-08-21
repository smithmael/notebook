// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
import App from './App';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* By wrapping App with Router here, everything inside App has access to the router context */}
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);