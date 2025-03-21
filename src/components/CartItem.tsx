
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem as CartItemType } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
  index: number;
}

const CartItem: React.FC<CartItemProps> = ({ item, index }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  return (
    <motion.div
      className="flex items-center py-4 border-b border-border last:border-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      exit={{ opacity: 0, x: -100 }}
      layout
    >
      <div className="h-20 w-20 rounded-lg overflow-hidden mr-4 bg-muted">
        <img 
          src={item.image} 
          alt={item.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium text-foreground">{item.name}</h3>
          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button 
              className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center text-foreground" 
              whileTap={{ scale: 0.95 }}
              onClick={handleDecrement}
            >
              {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
            </motion.button>
            
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            
            <motion.button 
              className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center" 
              whileTap={{ scale: 0.95 }}
              onClick={handleIncrement}
            >
              <Plus size={14} />
            </motion.button>
          </div>
          
          <motion.button 
            className="text-muted-foreground hover:text-destructive transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => removeItem(item.id)}
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CartItem;
