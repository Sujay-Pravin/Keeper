import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Call logout API
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.success("Logged out successfully!");
      
      // Redirect to login
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // If API fails, still clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-background/70 backdrop-blur-sm border-b border-slate-200/30">
      <AnimatedContainer animation="slideInRight">
        <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Keeper
        </div>
      </AnimatedContainer>
      
      <AnimatedContainer animation="slideInRight" delay={0.1}>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-medium text-slate-700"
              >
                Welcome, <span className="text-violet-600 font-semibold">{user.username}</span>
              </motion.div>
              <Button 
                variant="outline" 
                className="border-violet-500 text-violet-700 hover:text-destructive transition-all duration-300"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </AnimatedContainer>
    </nav>
  );
};

export default Navbar;