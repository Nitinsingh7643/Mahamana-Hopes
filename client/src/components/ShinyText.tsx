import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function ShinyText({ text, className = '', speed = 3 }: ShinyTextProps) {
  return (
    <motion.div
      className={`relative inline-block overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="relative">
        <span className="opacity-30 dark:opacity-50">{text}</span>
        <motion.span
          className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent dark:via-green-400"
          style={{ backgroundSize: '200% 100%' }}
          animate={{
            backgroundPosition: ['200% 0', '-200% 0'],
          }}
          transition={{
            repeat: Infinity,
            duration: speed,
            ease: 'linear',
          }}
        >
          {text}
        </motion.span>
      </div>
    </motion.div>
  );
}
