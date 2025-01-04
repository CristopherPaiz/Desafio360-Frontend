import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./layouts/ProtectedRoute";
import LoginPage from "./Views/LoginPage";
import Page404 from "./Views/Page404";
import HomePage from "./Views/HomePage";
import ProductPage from "./Views/ProductPage";
import CartPage from "./Views/CartPage";
import ProductsFilterPage from "./Views/ProductFilterPage";
import OrdenesPage from "./Views/OrdenesPage/OrdenesPage";
import AdminPage from "./Views/AdminPage/AdminPage";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos/:id"
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ordenes"
              element={
                <ProtectedRoute>
                  <OrdenesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrito"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categorias/:id"
              element={
                <ProtectedRoute>
                  <ProductsFilterPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
