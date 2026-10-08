import { motion } from 'framer-motion';
import React from 'react';

interface PartnerCardProps {
  name: string;
  logoUrl?: string;
  description: string;
  websiteUrl?: string;
  className?: string;
}

export default function PartnerCard({
  name,
  logoUrl,
  description,
  websiteUrl,
  className = ''
}: PartnerCardProps) {
  return (
    <motion.div
      className={`group relative p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col h-full">
        {logoUrl ? (
          <div className="h-20 mb-6 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 group-hover:scale-105 transition-transform duration-300">
            <img 
              src={logoUrl} 
              alt={`${name} logo`} 
              className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>
        ) : (
          <div className="h-20 mb-6 flex items-center justify-center bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {name.charAt(0)}
            </span>
          </div>
        )}
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {name}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 flex-grow text-sm leading-relaxed mb-6">
          {description}
        </p>

        {websiteUrl && (
          <a 
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors mt-auto"
          >
            Visit Website
            <svg 
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}
