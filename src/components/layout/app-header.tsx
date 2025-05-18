
import Link from 'next/link';
import { Droplets } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-4 px-4 sm:px-6 shadow-md bg-card sticky top-0 z-50">
      {/* Removed 'container' and 'mx-auto' from the div below to make it full-width within header padding */}
      <div className="flex items-center justify-between">
        {/* Brand/Logo Area */}
        <Link href="/" className="flex items-center gap-2" aria-label="Go to HydrateWise Dashboard">
          <Droplets className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            HydrateWise
          </h1>
        </Link>

        {/* Navigation Area */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/achievements" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Achievements
          </Link>
          {/* Future expansion: Could add a settings icon or user profile link here */}
        </nav>
      </div>
    </header>
  );
}
