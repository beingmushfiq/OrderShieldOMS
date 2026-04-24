import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'tertiary' | 'error';
  sparklineData: number[];
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  isPositive, 
  icon: Icon, 
  color,
  sparklineData,
  onClick
}) => {
  const colorMap = {
    primary: 'text-primary bg-primary/10 stroke-primary',
    secondary: 'text-secondary bg-secondary/10 stroke-secondary',
    tertiary: 'text-tertiary bg-tertiary/10 stroke-tertiary',
    error: 'text-error bg-error/10 stroke-error',
  };

  const pathData = sparklineData.map((val, i) => {
    const x = (i / (sparklineData.length - 1)) * 100;
    const y = 30 - (val / 100) * 30;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "group relative bg-surface-container p-6 rounded-lg transition-all duration-300 border-b-2 border-transparent hover:border-primary/40",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg", colorMap[color].split(' ').slice(0, 2).join(' '))}>
          <Icon size={20} />
        </div>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          isPositive ? "text-secondary" : "text-error"
        )}>
          {isPositive ? '+' : ''}{change}
        </span>
      </div>
      
      <div className="flex flex-col mb-4">
        <span className="text-[0.75rem] font-semibold uppercase tracking-widest text-on-surface-variant">{title}</span>
        <span className="text-2xl font-bold text-on-surface">{value}</span>
      </div>

      <div className="h-12 w-full mt-auto">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={pathData}
            fill="none"
            stroke="currentColor"
            className={colorMap[color].split(' ').pop()}
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      </div>
    </motion.div>
  );
};
