import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

export function Tooltip({ content, children, className, enabled = true }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!enabled) return <>{children}</>;

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-blue-600 text-white text-[10px] rounded shadow-xl pointer-events-none"
          >
            <div className="flex items-start gap-2">
              <HelpCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <p>{content}</p>
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
