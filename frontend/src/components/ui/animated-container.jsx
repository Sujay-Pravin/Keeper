import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 24
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { duration: 0.2 } 
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30
    } 
  },
  exit: { 
    opacity: 0, 
    x: 20, 
    transition: { duration: 0.2 } 
  }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 20
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  }
};

// Animated container component
export const AnimatedContainer = ({ 
  children, 
  animation = "fadeIn", // Default animation
  className,
  delay = 0,
  ...props 
}) => {
  let selectedVariant;
  
  switch(animation) {
    case "slideUp":
      selectedVariant = slideUp;
      break;
    case "slideInRight":
      selectedVariant = slideInRight;
      break;
    case "scaleIn":
      selectedVariant = scaleIn;
      break;
    case "fadeIn":
    default:
      selectedVariant = fadeIn;
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={selectedVariant}
      transition={{ delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}; 