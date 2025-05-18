
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "text-base font-medium transition-all duration-150 ease-in-out px-4 py-2 rounded-md",
      isActive 
        ? "text-primary font-semibold bg-primary/10 border-b-2 border-primary" // Active link style with bottom border
        : "text-muted-foreground hover:text-primary hover:bg-accent/30" // Inactive link hover style
    );
  };

  return (
    <header className="py-4 px-2 sm:px-4 border-b shadow-sm bg-card sticky top-0 z-50">
      <div className="flex items-center justify-center"> {/* This centers the nav block */}
        <nav className="flex items-center gap-6 sm:gap-8"> {/* Increased gap */}
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
