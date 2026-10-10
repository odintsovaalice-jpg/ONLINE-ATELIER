import React from 'react';
import { createRoot } from 'react-dom/client';
import ModellerPrototype from './ModellerPrototype.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModellerPrototype />
  </React.StrictMode>
);
