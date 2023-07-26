import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { TokenContextProvider } from './context/TokenContext.tsx';
import "./style/App.css";
import { CourseContextProvider } from './context/CourseContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TokenContextProvider>
      <CourseContextProvider>
        <App />
      </CourseContextProvider>
    </TokenContextProvider>
  </React.StrictMode>,
);
