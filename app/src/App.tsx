import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PurchaseHistoryComponent } from './components/purchase-history/purchase-history.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PurchaseConfirmationComponent } from './components/purchase-confirmation/purchase-confirmation.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/page-not-found" element={<PageNotFoundComponent />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <AuthGuard>
            <DashboardComponent />
          </AuthGuard>
        } />
        <Route path="/purchase" element={
          <AuthGuard>
            <PurchaseComponent />
          </AuthGuard>
        } />
        <Route path="/rewards" element={
          <AuthGuard>
            <RewardsComponent />
          </AuthGuard>
        } />
        <Route path="/purchase-history" element={
          <AuthGuard>
            <PurchaseHistoryComponent />
          </AuthGuard>
        } />
        <Route path="/checkout" element={
          <AuthGuard>
            <CheckoutComponent />
          </AuthGuard>
        } />
        <Route path="/purchase-confirmation" element={
          <AuthGuard>
            <PurchaseConfirmationComponent />
          </AuthGuard>
        } />
        
        <Route path="*" element={<Navigate to="/page-not-found" replace />} />
      </Routes>
    </Router>
  );
};

export default App;