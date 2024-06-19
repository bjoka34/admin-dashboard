"use client";
import { Inter as FontSans } from "next/font/google";
import "./prosemirror.css";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from '../redux/store';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SideMenu from "@/components/side-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex flex-col p-6 border w-full gap-6 rounded-md bg-card">
                <div className="flex justify-between items-center">
                  <Link href={'/dashboard'}>                  <h1 className="text-4xl font-semibold"> Admin Panel</h1>
                  </Link>
                  <div className="flex gap-5">
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/blogs">Blogs</Link>
                    <Link href="/blogs/categories">Categories</Link>
                    <Link href="/settings">Settings</Link>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
              {children}
              <Toaster />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
