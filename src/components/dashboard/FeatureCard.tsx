import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  href: string;
  color?: 'primary' | 'accent';
  delay?: number;
}

export function FeatureCard({ icon, title, description, features, href, color = 'primary', delay = 0 }: FeatureCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
    accent: 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground',
  };

  return (
    <Link 
      to={href}
      className="group glass-card rounded-2xl p-6 hover-lift animate-fade-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 ${colorClasses[color]}`}>
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {description}
      </p>
      
      <ul className="space-y-2 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
        <span>Get Started</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}
