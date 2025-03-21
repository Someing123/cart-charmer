
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CreditCard, 
  MapPin, 
  Clock, 
  Check,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import AnimatedPage from '@/components/AnimatedPage';
import { staggered } from '@/utils/animations';

const Checkout: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: user?.name || '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [paymentFormData, setPaymentFormData] = useState({
    cardholderName: user?.name || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [deliveryOption, setDeliveryOption] = useState('standard');
  
  const deliveryFee = deliveryOption === 'express' ? 6.99 : 3.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;
  
  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces every 4 digits
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19); // Limit to 16 digits + spaces
      
      setPaymentFormData(prev => ({ 
        ...prev, 
        [name]: formatted 
      }));
      return;
    }
    
    if (name === 'expiryDate') {
      // Format expiry date as MM/YY
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      
      setPaymentFormData(prev => ({ 
        ...prev, 
        [name]: formatted 
      }));
      return;
    }
    
    if (name === 'cvv') {
      // Limit CVV to 3-4 digits
      const formatted = value.replace(/\D/g, '').slice(0, 4);
      
      setPaymentFormData(prev => ({ 
        ...prev, 
        [name]: formatted 
      }));
      return;
    }
    
    setPaymentFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate address form
    if (Object.values(addressFormData).some(value => !value)) {
      toast.error('Please fill in all address fields');
      return;
    }
    
    setActiveStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate payment form
    if (Object.values(paymentFormData).some(value => !value)) {
      toast.error('Please fill in all payment fields');
      return;
    }
    
    processPayment();
  };
  
  const processPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setActiveStep(3);
      
      // Clear cart after successful checkout
      setTimeout(() => {
        clearCart();
      }, 1000);
    }, 2000);
  };
  
  const handleGoToStep = (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  return (
    <AnimatedPage className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Back button */}
        {activeStep < 3 && (
          <div className="mb-6 pt-4">
            <button 
              onClick={() => navigate(-1)} 
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to cart
            </button>
          </div>
        )}
        
        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
          {activeStep < 3 && (
            <p className="text-muted-foreground mt-2">Complete your order</p>
          )}
        </div>
        
        {/* Checkout steps */}
        {activeStep < 3 && (
          <div className="flex items-center justify-center mb-10">
            <StepIndicator 
              number={1} 
              title="Shipping" 
              isActive={activeStep === 1} 
              isCompleted={activeStep > 1} 
              onClick={() => handleGoToStep(1)}
            />
            <div className="w-16 h-0.5 bg-muted mx-2">
              {activeStep > 1 && (
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>
            <StepIndicator 
              number={2} 
              title="Payment" 
              isActive={activeStep === 2} 
              isCompleted={activeStep > 2} 
              onClick={() => handleGoToStep(2)}
            />
          </div>
        )}
        
        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form area */}
          <div className="lg:col-span-2">
            {activeStep === 1 && (
              <motion.div 
                key="shipping-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>
                
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={addressFormData.fullName}
                        onChange={handleAddressFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={addressFormData.phone}
                        onChange={handleAddressFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="(123) 456-7890"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Street Address</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={addressFormData.streetAddress}
                      onChange={handleAddressFormChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={addressFormData.city}
                        onChange={handleAddressFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="San Francisco"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <input
                        type="text"
                        name="state"
                        value={addressFormData.state}
                        onChange={handleAddressFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="CA"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={addressFormData.zipCode}
                        onChange={handleAddressFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="94105"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="text-lg font-semibold mb-4">Delivery Options</h3>
                    
                    <div className="space-y-3">
                      <label className={`block p-4 border rounded-lg transition-colors cursor-pointer ${deliveryOption === 'standard' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="standard"
                          checked={deliveryOption === 'standard'}
                          onChange={() => setDeliveryOption('standard')}
                          className="sr-only"
                        />
                        <div className="flex items-start">
                          <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${deliveryOption === 'standard' ? 'border-primary' : 'border-muted-foreground'}`}>
                            {deliveryOption === 'standard' && (
                              <div className="w-3 h-3 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="ml-3">
                            <span className="font-medium">Standard Delivery</span>
                            <p className="text-sm text-muted-foreground">Estimated delivery: 30-45 minutes</p>
                            <p className="text-sm font-medium mt-1">$3.99</p>
                          </div>
                        </div>
                      </label>
                      
                      <label className={`block p-4 border rounded-lg transition-colors cursor-pointer ${deliveryOption === 'express' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <input
                          type="radio"
                          name="deliveryOption"
                          value="express"
                          checked={deliveryOption === 'express'}
                          onChange={() => setDeliveryOption('express')}
                          className="sr-only"
                        />
                        <div className="flex items-start">
                          <div className={`w-5 h-5 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${deliveryOption === 'express' ? 'border-primary' : 'border-muted-foreground'}`}>
                            {deliveryOption === 'express' && (
                              <div className="w-3 h-3 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="ml-3">
                            <span className="font-medium">Express Delivery</span>
                            <p className="text-sm text-muted-foreground">Estimated delivery: 15-25 minutes</p>
                            <p className="text-sm font-medium mt-1">$6.99</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to Payment
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
            
            {activeStep === 2 && (
              <motion.div 
                key="payment-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <h2 className="text-lg font-semibold mb-6">Payment Method</h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentFormData.cardholderName}
                      onChange={handlePaymentFormChange}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentFormData.cardNumber}
                        onChange={handlePaymentFormChange}
                        className="w-full px-4 py-2 pl-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                      <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentFormData.expiryDate}
                        onChange={handlePaymentFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentFormData.cvv}
                        onChange={handlePaymentFormChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <motion.button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
            
            {activeStep === 3 && (
              <motion.div 
                key="confirmation-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-8 text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={40} className="text-green-600" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-3">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your order has been placed successfully. We'll deliver your food as soon as possible.
                </p>
                
                <div className="bg-muted/30 rounded-lg p-4 mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Order number:</span>
                    <span className="font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Estimated delivery:</span>
                    <span className="font-medium">
                      {deliveryOption === 'express' ? '15-25 minutes' : '30-45 minutes'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total amount:</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={handleBackToHome}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Home
                </motion.button>
              </motion.div>
            )}
          </div>
          
          {/* Order summary */}
          {activeStep < 3 && (
            <motion.div 
              className={staggered.third}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>
                
                <div className="max-h-[300px] overflow-y-auto subtle-scroll mb-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center py-3 border-b border-border last:border-0">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-grow overflow-hidden">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="ml-2 font-medium whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
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
                
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-start">
                    {activeStep === 1 ? (
                      <>
                        <MapPin size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="ml-2">
                          <p className="text-sm font-medium">Delivery Address</p>
                          <p className="text-xs text-muted-foreground">
                            Please fill out your shipping information
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                        <div className="ml-2">
                          <p className="text-sm font-medium">Delivery Address</p>
                          <p className="text-xs text-muted-foreground">
                            {addressFormData.streetAddress}, {addressFormData.city}, {addressFormData.state} {addressFormData.zipCode}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-start mt-4">
                    <Clock size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="ml-2">
                      <p className="text-sm font-medium">Estimated Delivery Time</p>
                      <p className="text-xs text-muted-foreground">
                        {deliveryOption === 'express' ? '15-25 minutes' : '30-45 minutes'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

interface StepIndicatorProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  number,
  title,
  isActive,
  isCompleted,
  onClick,
}) => {
  return (
    <button 
      className="flex flex-col items-center"
      onClick={onClick}
      disabled={!isCompleted && !isActive}
    >
      <div 
        className={`
          h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors
          ${isActive 
            ? 'border-primary bg-primary text-white' 
            : isCompleted 
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-muted-foreground bg-muted text-muted-foreground'
          }
        `}
      >
        {isCompleted ? <Check size={16} /> : number}
      </div>
      <span 
        className={`
          text-sm mt-2 font-medium
          ${isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'}
        `}
      >
        {title}
      </span>
    </button>
  );
};

export default Checkout;
