import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export interface TrendData {
  name: string;
  value: number;
  risk: 'low' | 'high';
}

interface TrendsChartProps {
  data?: TrendData[];
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : [
    { name: '01', value: 400, risk: 'low' },
    { name: '02', value: 550, risk: 'low' },
    { name: '03', value: 350, risk: 'low' },
    { name: '04', value: 850, risk: 'high' },
    { name: '05', value: 600, risk: 'low' },
    { name: '06', value: 450, risk: 'low' },
    { name: '07', value: 700, risk: 'low' },
    { name: '08', value: 900, risk: 'high' },
    { name: '09', value: 300, risk: 'low' },
    { name: '10', value: 650, risk: 'low' },
    { name: '11', value: 500, risk: 'low' },
    { name: '12', value: 400, risk: 'low' },
  ];

  return (
    <div className="bg-surface-container rounded-lg p-8 relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Fraud Detection Trends</h3>
          <p className="text-on-surface-variant text-sm">Automated pattern analysis for current billing cycle</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest rounded-full text-primary">Live</button>
          <button className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-transparent rounded-full text-on-surface-variant">History</button>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <Tooltip 
              cursor={{ fill: 'rgba(195, 192, 255, 0.1)' }}
              contentStyle={{ 
                backgroundColor: '#171f33', 
                border: '1px solid #464555',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.risk === 'high' ? '#c3c0ff' : 'rgba(195, 192, 255, 0.2)'} 
                  className="hover:fill-primary/60 transition-all cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between border-t border-outline-variant/10 pt-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Identified Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
            <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Verified Legitimate</span>
          </div>
        </div>
      </div>
    </div>
  );
};
