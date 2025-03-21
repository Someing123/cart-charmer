
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Minus, 
  Plus, 
  Clock, 
  Star, 
  ShoppingBag,
  HelpCircle 
} from 'lucide-react';
import { useCart, FoodItem } from '@/context/CartContext';
import AnimatedPage from '@/components/AnimatedPage';
import { staggered } from '@/utils/animations';

// Import mock data from Index
import { foodItems } from '../pages/Index';

const FoodDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [food, setFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    // Find the food item with the matching id
    const foundFood = foodItems.find(item => item.id === id);
    
    if (foundFood) {
      setFood(foundFood);
    } else {
      navigate('/'); // Redirect to home if food not found
    }
  }, [id, navigate]);

  if (!food) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addItem(food, quantity);
  };

  return (
    <AnimatedPage className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-4 pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to menu
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Food Image */}
          <div className="md:sticky md:top-20">
            <motion.div 
              className={`relative h-72 sm:h-96 md:h-[500px] rounded-3xl overflow-hidden ${staggered.first}`}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted/50 animate-pulse" />
              )}
              <img 
                src={food.image} 
                alt={food.name}
                className={`h-full w-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
            
            {/* Food stats */}
            <motion.div 
              className={`flex justify-between mt-6 ${staggered.second}`}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-primary/10 mr-3">
                  <Clock size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Preparation time</p>
                  <p className="font-medium">{food.preparationTime} min</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 mr-3">
                  <Star size={16} className="text-yellow-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-medium">4.8 (120+)</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-muted mr-3">
                  <HelpCircle size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Calories</p>
                  <p className="font-medium">{food.calories} cal</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Food Details */}
          <div className="flex flex-col">
            <motion.div 
              className={`${staggered.second} mb-6`}
            >
              <span className="text-sm font-medium uppercase tracking-wider text-primary mb-1 block">
                {food.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{food.name}</h1>
              <p className="text-muted-foreground mb-6">{food.description}</p>
              <div className="flex items-baseline mb-6">
                <span className="text-2xl md:text-3xl font-bold">${food.price.toFixed(2)}</span>
                <span className="text-muted-foreground text-sm ml-2">/ per item</span>
              </div>
            </motion.div>
            
            <motion.div 
              className={`flex flex-col space-y-6 ${staggered.third}`}
            >
              {/* Quantity Selector */}
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-sm font-medium mb-3">Quantity</p>
                <div className="flex items-center">
                  <motion.button
                    onClick={handleDecrement}
                    className="w-10 h-10 rounded-full bg-white shadow border border-border flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </motion.button>
                  
                  <motion.span 
                    key={quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-medium text-xl mx-6 w-6 text-center"
                  >
                    {quantity}
                  </motion.span>
                  
                  <motion.button
                    onClick={handleIncrement}
                    className="w-10 h-10 rounded-full bg-white shadow border border-border flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>
              
              {/* Toppings */}
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-sm font-medium mb-3">Add extras (optional)</p>
                <div className="space-y-2">
                  {['Cheese', 'Bacon', 'Avocado', 'Egg'].map((topping, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="ml-2">{topping}</span>
                      </label>
                      <span className="text-sm text-muted-foreground">+$1.50</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Special Instructions */}
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-sm font-medium mb-3">Special instructions (optional)</p>
                <textarea 
                  className="w-full h-20 p-3 rounded-lg border border-border resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Add any special requests..."
                />
              </div>
              
              {/* Add to Cart */}
              <div className="mt-auto pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Total price:</span>
                  <span className="text-xl font-bold">${(food.price * quantity).toFixed(2)}</span>
                </div>
                
                <motion.button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-primary text-white rounded-xl font-medium shadow flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag size={18} />
                  Add to cart
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FoodDetails;
