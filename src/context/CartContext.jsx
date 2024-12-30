import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNotification } from "../hooks/useNotification";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [countItemsInCart, setCountItemsInCart] = useState(0);
  const { showNotification } = useNotification();

  const [cart, setCart] = useState(() => {
    // Recuperar carrito desde localStorage al inicializar
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sincronizar carrito con localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Agregar productos al carrito
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Si el producto no está en el carrito, agrégalo
      if (!prevCart.some((item) => item.idProductos === product.idProductos)) {
        showNotification({
          message: "Producto añadido al carrito",
          severity: "success",
          dimissible: true,
          duration: 3000,
        });
        return [...prevCart, product];
      }
      showNotification({
        message: "Producto ya en el carrito",
        severity: "info",
        color: "#ffaa00",
        dimissible: true,
        duration: 3000,
      });
      return prevCart;
    });
  };

  // Sumar o quititar cantidad de un producto en el carrito
  const updateQuantity = (product, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        // Si el producto está en el carrito, actualiza la cantidad
        if (item.idProductos === product.idProductos) {
          return { ...item, cantidad: quantity };
        }
        return item;
      })
    );
  };

  // Eliminar un producto del carrito
  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.idProductos !== product.idProductos));
    showNotification({
      message: "Producto eliminado del carrito",
      severity: "error",
      dimissible: true,
      duration: 3000,
    });
  };

  // Vaciar el carrito
  const clearCart = () => setCart([]);

  // Actualizar countItemsInCart
  useEffect(() => {
    setCountItemsInCart(cart.length);
  }, [cart]);

  // Todo lo que se pasa en el value es accesible desde cualquier componente
  const value = {
    countItemsInCart, // Cantidad de productos en el carrito
    setCountItemsInCart, // Setter para countItemsInCart
    cart, // Objeto con todos los productos en el carrito
    addToCart, // Función para añadir productos al carrito addToCart(producto)
    removeFromCart, // Función para eliminar productos del carrito removeFromCart(producto)
    updateQuantity, // Función para actualizar la cantidad de un producto en el carrito updateQuantity(producto, cantidad)
    clearCart, // Función para vaciar el carrito clearCart()
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
