import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Critical Error: Root element '#root' not found.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to mount React application:", err);
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif; text-align: center; padding: 20px;">
        <h2 style="color: #ef4444;">Application Initialization Failed</h2>
        <p style="color: #64748b;">${err.message}</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #0f172a; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Retry Loading
        </button>
      </div>
    `;
  }
};

// Handle mounting when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}