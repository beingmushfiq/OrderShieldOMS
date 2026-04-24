import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ThemeToggleProps {
  compact?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2 border border-outline-variant group",
        compact ? "rounded-full" : ""
      )}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          {!compact && <span className="text-sm font-medium text-on-surface">Dark Mode</span>}
        </>
      ) : (
        <>
          <Sun className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          {!compact && <span className="text-sm font-medium text-on-surface">Light Mode</span>}
        </>
      )}
    </button>
  );
};


export default ThemeToggle;
