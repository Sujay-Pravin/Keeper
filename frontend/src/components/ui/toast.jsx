import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster({ position = 'bottom-right', ...props }) {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: 'var(--radius)',
        },
        className: 'group',
      }}
      {...props}
    />
  );
} 