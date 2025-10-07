
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add Google Fonts
const linkEl = document.createElement('link');
linkEl.rel = 'stylesheet';
linkEl.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap';
document.head.appendChild(linkEl);

createRoot(document.getElementById("root")!).render(<App />);
