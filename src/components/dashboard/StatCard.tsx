import { ReactNode, useEffect, useState } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
  max: number;
  suffix?: string;
  delay?: number;
}

export function StatCard({ icon, label, value, max, suffix = '', delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * value);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="glass-card rounded-xl p-5 hover-lift">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold">{displayValue}</span>
        <span className="text-muted-foreground">/ {max}{suffix}</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full gradient-bg rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}
