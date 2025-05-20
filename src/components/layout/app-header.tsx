
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "font-medium transition-all duration-150 ease-in-out rounded-md",
      "text-sm sm:text-base px-3 py-2 sm:px-4", // Responsive text size and padding
      isActive
        ? "text-primary font-semibold bg-primary/10 border-b-2 border-primary"
        : "text-muted-foreground hover:text-primary hover:bg-primary/5" // Adjusted hover for less contrast
    );
  };

  return (
    <header className="py-3 px-2 sm:px-4 border-b shadow-sm bg-card sticky top-0 z-50">
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <nav className="flex items-center gap-3 sm:gap-4 md:gap-6"> {/* Responsive gap */}
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
