import { motion } from 'framer-motion';

interface MarqueeProps {
  items: React.ReactNode[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export default function Marquee({ items, speed = 20, direction = 'left', className = '' }: MarqueeProps) {
  return (
    <div className={`overflow-hidden flex w-full relative ${className}`}>
      {/* Optional gradient fades on edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex whitespace-nowrap gap-12 px-6 items-center"
        animate={{
          x: direction === 'left' ? [0, -1035] : [-1035, 0],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: speed,
        }}
      >
        {/* We map twice to create the infinite loop effect seamlessly */}
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="inline-block shrink-0">
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
