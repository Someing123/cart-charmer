
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryPillProps {
  name: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ 
  name, 
  icon, 
  isActive = false, 
  onClick 
}) => {
  return (
    <motion.button
      className={`
        relative px-4 py-2 rounded-full flex items-center gap-2 transition-all
        ${isActive 
          ? 'bg-primary text-primary-foreground font-medium shadow-md' 
          : 'bg-secondary text-foreground hover:bg-secondary/70'}
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{name}</span>
      
      {isActive && (
        <motion.span
          className="absolute -bottom-1 left-1/2 w-1 h-1 bg-primary rounded-full"
          layoutId="activeCategoryIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};

export default CategoryPill;
