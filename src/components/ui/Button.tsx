import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';
import { LoaderCircle } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading = false, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          'w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          className
        )}
        whileTap={{ scale: 0.97 }}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

export default Button;

