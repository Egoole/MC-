import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix for missing JSX types for React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      planeGeometry: any;
      meshBasicMaterial: any;
      ambientLight: any;
      pointLight: any;
    }
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);