import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product, CartItem } from "../types";
import { CartContext } from "../context/CartContext";

const CART_STORAGE_KEY = "biteswift_cart";

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      let newCart;

      if (existing) {
        newCart = prev.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        newCart = [...prev, { product, quantity: 1 }];
      }

      return newCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getTotalItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
