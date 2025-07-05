import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const GradientBackdrop = ({ 
  className, 
  children,
  gradientFrom = "from-violet-500",
  gradientTo = "to-purple-900",
  opacity = "opacity-60",
  blur = "blur-3xl",
  ...props 
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      {/* Background gradient element */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: { duration: 0.8 }
          }}
          className="absolute -inset-[100px] flex items-center justify-center"
        >
          <div 
            className={cn(
              "absolute h-[50%] w-[40%] rounded-full",
              gradientFrom, gradientTo, opacity, blur,
              "bg-gradient-to-r mix-blend-multiply"
            )}
            style={{ 
              top: '5%', 
              right: '10%',
              transform: 'translate(10%, -20%)' 
            }}
          />
          <div 
            className={cn(
              "absolute h-[50%] w-[40%] rounded-full",
              "from-blue-500 to-cyan-400", opacity, blur,
              "bg-gradient-to-r mix-blend-multiply"
            )}
            style={{ 
              bottom: '10%', 
              left: '15%',
              transform: 'translate(-5%, 20%)' 
            }}
          />
        </motion.div>
      </div>
      
      {children}
    </div>
  );
}; 