
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ThemeToggleButton } from './theme-toggle-button';

export function AppHeader() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "text-base font-medium transition-all duration-150 ease-in-out px-4 py-2 rounded-md",
      isActive 
        ? "text-primary font-semibold bg-primary/10 border-b-2 border-primary"
        : "text-muted-foreground hover:text-primary hover:bg-accent/30"
    );
  };

  return (
    <header className="py-3 px-2 sm:px-4 border-b shadow-sm bg-card sticky top-0 z-50">
      {/* Increased max-width for more space and adjusted padding on header py-3 */}
      <div className="relative flex items-center justify-center max-w-7xl mx-auto px-2"> {/* Added px-2 here for small internal padding */}
        <nav className="flex items-center gap-6 sm:gap-8">
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
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
