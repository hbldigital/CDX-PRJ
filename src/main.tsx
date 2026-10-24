import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initClientApiFallback } from './utils/clientApiFallback';

// Initialize resilient API fallback for static environments like GitHub Pages
try {
  initClientApiFallback();
} catch (err) {
  console.warn('initClientApiFallback non-fatal notice:', err);
}

const mountApp = () => {
  const container = document.getElementById('root');
  if (container) {
    createRoot(container).render(<App />);
  } else {
    console.error('DOM Error: #root container element missing.');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
