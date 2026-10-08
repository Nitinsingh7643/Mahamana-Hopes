import { motion } from 'framer-motion';
import React from 'react';

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function HoverButton({
  children,
  className = '',
  variant = 'primary',
  ...props
}: HoverButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium rounded-lg transition-colors duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
    secondary: "text-white bg-gray-800 hover:bg-gray-900 focus:ring-gray-800",
    outline: "text-green-600 border-2 border-green-600 hover:bg-green-50 focus:ring-green-500 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-900/20"
  };

  return (
    <motion.button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-white/20 z-0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  );
}
