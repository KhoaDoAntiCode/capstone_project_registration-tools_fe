"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ApiProvider } from "@/providers/ApiProviders";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ApiProvider>{children}</ApiProvider>
    </ThemeProvider>
  );
}