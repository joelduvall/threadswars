import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads Wars",
  description: "A sample application by Joel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* Toast */}
          {/* Header */}
          <header className="sticky top-0 header">
            <Header />       
          </header>

          <main className="main-content-2">
            {children}
          </main>
          {/* Footer */}       
        </body>
      </html>
    </ClerkProvider>
  );
}
