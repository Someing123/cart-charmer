
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Coffee, Pizza, Salad, Sandwich, Hamburger, Clock } from 'lucide-react';
import { FoodItem } from '@/context/CartContext';
import FoodCard from '@/components/FoodCard';
import CategoryPill from '@/components/CategoryPill';
import AnimatedPage from '@/components/AnimatedPage';
import { staggered } from '@/utils/animations';

// Mock data
const categories = [
  { id: 'all', name: 'All', icon: <Filter size={16} /> },
  { id: 'burgers', name: 'Burgers', icon: <Hamburger size={16} /> },
  { id: 'pizza', name: 'Pizza', icon: <Pizza size={16} /> },
  { id: 'salads', name: 'Salads', icon: <Salad size={16} /> },
  { id: 'sandwiches', name: 'Sandwiches', icon: <Sandwich size={16} /> },
  { id: 'drinks', name: 'Drinks', icon: <Coffee size={16} /> },
];

const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce on a brioche bun.',
    category: 'burgers',
    preparationTime: '15',
    calories: 650,
  },
  {
    id: '2',
    name: 'Margherita Pizza',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1604917877934-07d8d248d396?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Classic pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.',
    category: 'pizza',
    preparationTime: '20',
    calories: 800,
  },
  {
    id: '3',
    name: 'Caesar Salad',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing.',
    category: 'salads',
    preparationTime: '10',
    calories: 350,
  },
  {
    id: '4',
    name: 'Club Sandwich',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread.',
    category: 'sandwiches',
    preparationTime: '12',
    calories: 520,
  },
  {
    id: '5',
    name: 'Cappuccino',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Espresso with steamed milk and a layer of frothed milk.',
    category: 'drinks',
    preparationTime: '5',
    calories: 120,
  },
  {
    id: '6',
    name: 'Mushroom Swiss Burger',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Beef patty topped with sautéed mushrooms, Swiss cheese, and truffle aioli.',
    category: 'burgers',
    preparationTime: '18',
    calories: 780,
  },
  {
    id: '7',
    name: 'Greek Salad',
    price: 11.99,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Fresh cucumbers, tomatoes, olives, red onion, and feta cheese with olive oil dressing.',
    category: 'salads',
    preparationTime: '8',
    calories: 320,
  },
  {
    id: '8',
    name: 'Pepperoni Pizza',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80',
    description: 'Classic pizza topped with tomato sauce, mozzarella, and spicy pepperoni slices.',
    category: 'pizza',
    preparationTime: '20',
    calories: 860,
  },
];

const Index: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>(foodItems);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter items based on category and search query
  useEffect(() => {
    let results = foodItems;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        item =>
          item.name.toLowerCase().includes(lowercaseQuery) ||
          item.description.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredItems(results);
  }, [selectedCategory, searchQuery]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AnimatedPage className="pt-20 pb-12">
      <section className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 md:mb-16 grid md:grid-cols-2 gap-6 items-center">
          <div className="order-2 md:order-1">
            <motion.span 
              className={`inline-block mb-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium ${staggered.first}`}
            >
              Fast Delivery
            </motion.span>
            <motion.h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 ${staggered.second}`}
            >
              Delicious meals, <br />
              at your fingertips
            </motion.h1>
            <motion.p 
              className={`text-muted-foreground text-lg mb-6 ${staggered.third}`}
            >
              Order your favorite foods with just a few taps and enjoy 
              a seamless delivery experience.
            </motion.p>
            <motion.div 
              className={`relative rounded-full shadow-sm ${staggered.fourth}`}
            >
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search for food..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={searchQuery}
                onChange={handleSearchChange}
                ref={searchInputRef}
              />
            </motion.div>
          </div>
          <div className="order-1 md:order-2">
            <motion.div 
              className="relative h-64 md:h-80 lg:h-96"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80"
                alt="Delicious Food"
                className="w-full h-full object-cover rounded-3xl md:rounded-tr-[50px] md:rounded-bl-[50px] shadow-lg"
              />
              <div className="absolute -bottom-6 -left-4 md:-left-6 shadow-md rounded-2xl bg-white p-4 w-48 flex items-center gap-3 animate-pulse-subtle">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Fast Delivery</p>
                  <p className="text-xs text-muted-foreground">25-30 min</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="overflow-x-auto mb-8 pb-2 no-scrollbar">
          <div className="flex gap-3">
            {categories.map((category, index) => (
              <CategoryPill
                key={category.id}
                name={category.name}
                icon={category.icon}
                isActive={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
          </div>
        </div>
        
        {/* Food Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory + searchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((food, index) => (
                  <FoodCard key={food.id} food={food} index={index} />
                ))}
              </div>
            ) : (
              <div className="min-h-[200px] flex flex-col items-center justify-center text-center py-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center"
                >
                  <Search size={24} className="text-muted-foreground" />
                </motion.div>
                <h3 className="text-lg font-medium mb-1">No results found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any food matching your search. Try another category or search term.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </AnimatedPage>
  );
};

export default Index;
