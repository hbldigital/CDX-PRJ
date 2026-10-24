import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initClientApiFallback } from './utils/clientApiFallback';

// Initialize resilient API fallback for static environments like GitHub Pages
try {
  initClientApiFallback();
} catch (err) {
  console.warn('initClientApiFallback non-fatal notice:', err);
}

createRoot(document.getElementById('root')!).render(<App />);
