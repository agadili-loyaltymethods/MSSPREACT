import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
// import { loadAppConfig } from './services/configService';
import { store } from './lib/store';
import { AppProvider } from './lib/providers/app-provider';

// await loadAppConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </AppProvider>
);
