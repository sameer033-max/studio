"use client";

import { Droplets } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-4 px-4 sm:px-6 shadow-md bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center gap-2">
        <Droplets className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
          HydrateWise
        </h1>
      </div>
    </header>
  );
}