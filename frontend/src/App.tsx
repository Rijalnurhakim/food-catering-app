import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartProvider from './providers/CartProvider'; // UPDATE IMPORT PATH
import ProductListPage from './pages/ProductListPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 no-p">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;