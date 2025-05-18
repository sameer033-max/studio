
"use client";

import Link from 'next/link';
import { Droplets } from 'lucide-react';
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
      {/* Removed 'container' and 'mx-auto' from the div below to make it full-width within header padding */}
      <div className="flex items-center justify-between">
        {/* Brand/Logo Area */}
        <Link href="/" className="flex items-center gap-2" aria-label="Go to HydrateWise Dashboard">
          <Droplets className="h-6 w-6 text-primary" /> {/* Adjusted size */}
          <h1 className="text-lg font-semibold text-foreground"> {/* Adjusted size */}
            HydrateWise
          </h1>
        </Link>

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
