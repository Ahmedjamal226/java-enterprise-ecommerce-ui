import axios from "../axios";
import { useState, useEffect, createContext, useCallback } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  clearCart: () => {}
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });

  // Global Add to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingProductIndex !== -1) {
        if (prevCart[existingProductIndex].quantity < product.stockQuantity) {
          return prevCart.map((item, index) =>
            index === existingProductIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          alert("Cannot add more than available stock!");
          return prevCart;
        }
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Global Remove from Cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Global Refresh Data
  const refreshData = useCallback(async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  }, []);

  // Global Clear Cart
  const clearCart = () => {
    setCart([]);
  };

  // Single cleanly integrated watcher for local storage updates
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <AppContext.Provider value={{ data, isError, cart, addToCart, removeFromCart, refreshData, clearCart }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;