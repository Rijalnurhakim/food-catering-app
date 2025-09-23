import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartProvider from "./providers/CartProvider"; // UPDATE IMPORT
import ProductListPage from "./pages/ProductListPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import OrderHistoryPage from "./pages/OrderHistoryPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            {/* <Route path="/checkout" element={<CheckoutPage />} /> */}
            {/* <Route path="/orders" element={<OrderHistoryPage />} /> */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
