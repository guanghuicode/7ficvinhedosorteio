import React from 'react';
import { motion } from 'framer-motion';

interface ProgressProps {
  value: number; // 0 to 100
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
  const progress = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <motion.div
        className="bg-success h-4 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  );
};

export default Progress;

