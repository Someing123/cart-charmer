
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Menu as MenuIcon, 
  X, 
  Home,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/" 
          className="font-bold text-lg flex items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <span className="text-primary font-bold text-xl">Plates</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" isActive={isActive('/')}>
            Home
          </NavLink>
          <NavLink to="/cart" isActive={isActive('/cart')}>
            Cart
            {itemCount > 0 && (
              <motion.span 
                key={itemCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white"
              >
                {itemCount}
              </motion.span>
            )}
          </NavLink>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center gap-2 py-1">
                <span className="text-sm font-medium text-foreground">
                  {user?.name}
                </span>
                <User size={18} className="text-muted-foreground" />
              </button>
              
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-48">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button 
                  className="w-full flex items-center gap-2 p-3 text-sm text-muted-foreground hover:bg-muted transition-colors duration-200"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" isActive={isActive('/login')}>
              Sign in
            </NavLink>
          )}
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <motion.span 
                key={itemCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs rounded-full bg-primary text-white"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <nav className="container mx-auto p-4 flex flex-col space-y-3">
              <MobileNavLink to="/" label="Home" icon={<Home size={18} />} />
              <MobileNavLink to="/cart" label="Cart" icon={<ShoppingBag size={18} />} />
              
              {isAuthenticated ? (
                <>
                  <div className="py-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="flex items-center gap-2 py-3 text-red-500"
                    onClick={logout}
                  >
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <MobileNavLink to="/login" label="Sign in" icon={<User size={18} />} />
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`relative py-1 text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-foreground hover:text-primary'
    }`}
  >
    <span className="flex items-center gap-1.5">{children}</span>
    {isActive && (
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
        layoutId="navIndicator"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    )}
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center justify-between py-3 ${
        isActive ? 'text-primary font-medium' : 'text-foreground'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight size={16} className="text-muted-foreground" />
    </Link>
  );
};

export default Header;
