
"use client";

import Link from 'next/link';
// Droplets import removed as it's no longer used
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "text-sm font-medium transition-colors hover:text-primary",
      isActive ? "text-primary font-semibold" : "text-muted-foreground"
    );
  };

  return (
    <header className="py-4 px-2 sm:px-4 shadow-md bg-card sticky top-0 z-50">
      {/* The main div now uses justify-end to push the nav to the right */}
      <div className="flex items-center justify-end">
        {/* Brand/Logo Area has been removed */}

        {/* Navigation Area */}
        <nav className="flex items-center gap-4 sm:gap-6"> {/* Adjusted gap */}
          <Link href="/" className={getLinkClasses('/')}>
            Dashboard
          </Link>
          <Link href="/insights" className={getLinkClasses('/insights')}>
            Insights
          </Link>
          <Link href="/achievements" className={getLinkClasses('/achievements')}>
            Achievements
          </Link>
          {/* Future expansion: Could add a settings icon or user profile link here */}
        </nav>
      </div>
    </header>
  );
}
