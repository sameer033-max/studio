
import Link from 'next/link';
import { Droplets, Bot, BarChart, Trophy, Cog } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-4 px-2 sm:px-4 shadow-md bg-card sticky top-0 z-50">
      {/* Removed 'container' and 'mx-auto' from the div below to make it full-width within header padding */}
      <div className="flex items-center justify-between">
        {/* Brand/Logo Area */}
        <Link href="/" className="flex items-center gap-2" aria-label="Go to HydrateWise Dashboard">
          <Droplets className="h-6 w-6 sm:h-7 sm:w-7 text-primary" /> {/* Adjusted size */}
          <h1 className="text-lg sm:text-xl font-semibold text-foreground"> {/* Adjusted size */}
            HydrateWise
          </h1>
        </Link>

        {/* Navigation Area */}
        <nav className="flex items-center gap-3 sm:gap-4"> {/* Adjusted gap */}
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link href="/insights" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Insights
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
