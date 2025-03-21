
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  preparationTime?: string;
  calories?: number;
}

interface CartItem extends FoodItem {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Calculate totals whenever items change
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const sum = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setItemCount(count);
    setSubtotal(sum);
  }, [items]);

  const addItem = (food: FoodItem, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === food.id);
      
      if (existingItem) {
        const updatedItems = prevItems.map(item => 
          item.id === food.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        
        toast.success(`${food.name} quantity updated in cart`);
        return updatedItems;
      } else {
        toast.success(`${food.name} added to cart`);
        return [...prevItems, { ...food, quantity }];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.name} removed from cart`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success("Cart cleared");
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
