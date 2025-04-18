import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppProvider } from './components/AppContext';
import { loadAppConfig } from './services/configService';

await loadAppConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </AppProvider>
);
