
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FoodItem } from '@/context/CartContext';
import { useCart } from '@/context/CartContext';

interface FoodCardProps {
  food: FoodItem;
  index: number;
}

const FoodCard = ({ food, index }: FoodCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Stagger the animation based on index
  const delay = index * 0.1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(food);
  };

  return (
    <motion.div
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm card-hover group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/food/${food.id}`)}
    >
      <div className="relative h-52 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted/50 animate-pulse" />
        )}
        <img
          src={food.image}
          alt={food.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <motion.button
          className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg"
          onClick={handleAddToCart}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={18} />
        </motion.button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-primary font-medium uppercase tracking-wide mb-1">
              {food.category}
            </p>
            <h3 className="font-medium text-lg text-foreground truncate">
              {food.name}
            </h3>
          </div>
          <p className="text-lg font-semibold">${food.price.toFixed(2)}</p>
        </div>
        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
          {food.description}
        </p>
        {food.preparationTime && (
          <div className="mt-3 text-sm text-muted-foreground flex items-center gap-3">
            <span>{food.preparationTime} min</span>
            {food.calories && (
              <>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{food.calories} cal</span>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FoodCard;
