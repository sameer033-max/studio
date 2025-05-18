
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
      {/* This div ensures the content is constrained by max-width and centered, with some internal padding. */}
      <div className="flex items-center max-w-7xl mx-auto px-2">
        {/* Left spacer: Pushes the nav towards the center. Can be used for a logo in the future. */}
        <div className="flex-1">
          {/* Intentionally empty for now to balance the theme toggle button on the right. */}
          {/* For perfect balance, if a logo or other item is here, its width would be considered. */}
        </div>

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

        {/* Right spacer and container for actions like the theme toggle button. */}
        {/* flex-1 allows it to take up space, justify-end pushes its content (theme toggle) to the right. */}
        <div className="flex-1 flex justify-end items-center">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}
