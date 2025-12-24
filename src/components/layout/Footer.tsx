import { AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            Loksewa Computer Operator Prep Hub • Designed for personal use by{' '}
            <span className="font-semibold text-foreground">Dhiaj Shahi</span>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-accent" />
            <span>Backup your notes and files regularly.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
