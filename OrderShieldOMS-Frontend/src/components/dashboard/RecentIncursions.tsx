import React from 'react';
import { MoreVertical, ShieldAlert, MapPin, Search, ChevronRight, Activity, Clock, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Incursion, Page } from '@/src/types';

export const RecentIncursions: React.FC<{ 
  onPageChange: (page: Page) => void,
  data?: Incursion[] 
}> = ({ onPageChange, data = [] }) => {
  const incursionsList = data.length > 0 ? data : [];

  const severityColors = {
    critical: 'border-error text-error',
    review: 'border-tertiary text-tertiary',
    info: 'border-primary text-primary'
  };

  const icons = {
    order: ShieldAlert,
    customer: MapPin,
    system: Info
  };

  return (
    <div className="bg-surface-container-low rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary">Recent Threats</h3>
        <MoreVertical className="text-on-surface-variant cursor-pointer" size={16} />
      </div>

      <div className="space-y-4 flex-1">
        {incursionsList.map((item, index) => {
          const Icon = icons[item.type as keyof typeof icons] || ShieldAlert;
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center p-4 bg-surface-container rounded-lg border-l-2",
                (severityColors[item.severity as keyof typeof severityColors] || severityColors.info).split(' ')[0]
              )}
            >
              <div className="mr-4">
                <Icon className={(severityColors[item.severity as keyof typeof severityColors] || severityColors.info).split(' ')[1]} size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{item.title}</p>
                <p className="text-sm font-semibold text-on-surface">{item.description}</p>
              </div>
              <span className={cn("text-[10px] font-bold capitalize", (severityColors[item.severity as keyof typeof severityColors] || severityColors.info).split(' ')[1])}>
                {item.severity}
              </span>
            </motion.div>
          );
        })}
      </div>

      <button 
        onClick={() => onPageChange('alerts')}
        className="w-full py-3 mt-4 text-[10px] font-bold uppercase tracking-widest text-primary bg-surface-container-highest rounded-lg transition-colors hover:bg-primary/20 active:scale-95 transition-all"
      >
        View All Alerts
      </button>
    </div>
  );
};
