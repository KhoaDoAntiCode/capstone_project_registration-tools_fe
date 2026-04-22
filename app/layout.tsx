import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { ApiProvider } from "@/providers/ApiProviders"
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Capstone Project Registration Tool",
  description: "Capstone Project Registration Tool",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icon/icon.png",
    shortcut: "/favicon.svg",
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // "system" | "light" | "dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* ✅ Bọc ApiProvider ở ngoài cùng */}
          <ApiProvider>{children}</ApiProvider>
          {/* <Toaster /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
