import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
// components
import ScrollToTop from './components/ScrollToTop';

import AuthProvider from './context/AuthContext';

import { store, persistor } from './store';
import './index.css';
// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <ScrollToTop />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </PersistGate>
      </Provider>
    </ThemeConfig>
  );
}
