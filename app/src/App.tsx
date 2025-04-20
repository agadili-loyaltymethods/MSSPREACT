import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { PageNotFound } from './components/page-not-found';
import { Dashboard } from './components/dashboard';
import { Purchase } from './components/purchase';
import { Rewards } from './components/rewards';
import { PurchaseHistory } from './components/purchase-history';
import { Checkout } from './components/checkout';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/page-not-found" element={<PageNotFound />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        } />
        <Route path="/purchase" element={
          <AuthGuard>
            <Purchase />
          </AuthGuard>
        } />
        <Route path="/rewards" element={
          <AuthGuard>
            <Rewards />
          </AuthGuard>
        } />
        <Route path="/purchase-history" element={
          <AuthGuard>
            <PurchaseHistory />
          </AuthGuard>
        } />
        <Route path="/checkout" element={
          <AuthGuard>
            <Checkout />
          </AuthGuard>
        } />
        {/* <Route path="/purchase-confirmation" element={
          <AuthGuard>
            <PurchaseConfirmation />
          </AuthGuard>
        } /> */}
        
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Routes>
    </Router>
  );
};

export default App;