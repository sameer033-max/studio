
"use client";

import React, { useState, useEffect } from 'react';

export function AppFooter() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-4 text-center text-xs text-muted-foreground border-t">
      HydrateWise &copy; {currentYear !== null ? currentYear : '....'} - Stay Refreshed!
    </footer>
  );
}
