import React from 'react';
import { cn } from '../utils/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}

export const Container = ({ as: Component = 'div', className, children, ...props }: ContainerProps) => {
  return (
    <Component
      className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Component>
  );
};
