
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppReminderManager } from '@/components/logic/app-reminder-manager';
import { ThemeProvider } from '@/contexts/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HydrateWise - Your Personal Hydration Buddy',
  description: 'Track water intake, get reminders, and AI-driven hydration insights with HydrateWise.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning is helpful with theme persistence */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AppReminderManager />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
