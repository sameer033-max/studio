
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "text-sm font-medium transition-all duration-150 ease-in-out px-3 py-2 rounded-md", // Added padding and rounded for hover effect
      isActive 
        ? "text-primary font-semibold bg-primary/10" // Active link style
        : "text-muted-foreground hover:text-primary hover:bg-accent/30" // Inactive link hover style
    );
  };

  return (
    <header className="py-4 px-2 sm:px-4 shadow-md bg-card sticky top-0 z-50">
      <div className="flex items-center justify-center"> {/* Changed justify-end to justify-center */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className={getLinkClasses('/')}>
            Dashboard
          </Link>
          <Link href="/insights" className={getLinkClasses('/insights')}>
            Insights
          </Link>
          <Link href="/achievements" className={getLinkClasses('/achievements')}>
            Achievements
          </Link>
        </nav>
      </div>
    </header>
  );
}
