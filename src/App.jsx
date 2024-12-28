import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import ProtectedRoute from "./layouts/ProtectedRoute";
import LoginPage from "./Views/LoginPage";
import Page404 from "./Views/Page404";
import HomePage from "./Views/HomePage";
import ProductPage from "./Views/ProductPage";

const Ordenes = () => <h1>Ordenes</h1>;
const Admin = () => <h1>Administración</h1>;
const Carrito = () => <h1>Carrito</h1>;

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
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
                  <Ordenes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/carrito"
              element={
                <ProtectedRoute>
                  <Carrito />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Page404 />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
