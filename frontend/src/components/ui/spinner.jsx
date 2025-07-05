import React from 'react';
import { PuffLoader, BeatLoader } from 'react-spinners';
import { cn } from '@/lib/utils';

const spinnerSizes = {
  xs: { puff: 20, beat: 5 },
  sm: { puff: 30, beat: 8 },
  md: { puff: 50, beat: 10 },
  lg: { puff: 70, beat: 15 },
  xl: { puff: 100, beat: 20 },
};

export const Spinner = ({
  size = "md",
  variant = "puff",
  color = "#5b21b6", // Purple color that matches premium aesthetic
  className,
  ...props
}) => {
  const dimensions = spinnerSizes[size] || spinnerSizes.md;
  
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      {variant === "puff" ? (
        <PuffLoader
          color={color}
          size={dimensions.puff}
          speedMultiplier={0.7}
        />
      ) : (
        <BeatLoader
          color={color}
          size={dimensions.beat}
          speedMultiplier={0.7}
        />
      )}
    </div>
  );
};

export const FullPageSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner size="lg" />
      <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}; 