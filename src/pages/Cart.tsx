
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Trash2,
  CreditCard, 
  ChevronRight
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import CartItem from '@/components/CartItem';
import AnimatedPage from '@/components/AnimatedPage';
import { staggered } from '@/utils/animations';

const Cart: React.FC = () => {
  const { items, clearCart, itemCount, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);
  
  const deliveryFee = 3.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handleClearCart = () => {
    setIsClearing(true);
    setTimeout(() => {
      clearCart();
      setIsClearing(false);
    }, 300);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <AnimatedPage className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Back button and title */}
        <div className="mb-6 pt-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Continue shopping
          </Link>
          
          <h1 className="text-xl font-bold">Your Cart</h1>
          
          <button
            onClick={handleClearCart}
            disabled={items.length === 0 || isClearing}
            className={`text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 ${
              items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Trash2 size={14} />
            Clear cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div 
            className={`lg:col-span-2 ${staggered.first}`}
          >
            {items.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <CartItem key={item.id} item={item} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4"
                >
                  <ShoppingBag size={32} className="text-muted-foreground" />
                </motion.div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet
                </p>
                <Link
                  to="/"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse menu
                </Link>
              </div>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            className={`${staggered.second} ${items.length === 0 ? 'lg:hidden' : ''}`}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
                  items.length === 0 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
                whileHover={items.length > 0 ? { scale: 1.02 } : {}}
                whileTap={items.length > 0 ? { scale: 0.98 } : {}}
              >
                <CreditCard size={18} />
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                <ChevronRight size={16} />
              </motion.button>
              
              {/* Accepted Payment Methods */}
              <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-2 text-center">
                  We accept
                </p>
                <div className="flex justify-center space-x-2">
                  {['visa', 'mastercard', 'amex', 'paypal'].map((method) => (
                    <div key={method} className="w-10 h-6 bg-muted rounded" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Cart;
