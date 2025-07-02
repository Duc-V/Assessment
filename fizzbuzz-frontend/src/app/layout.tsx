import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <header className="bg-blue-700 text-white py-4 mb-6 shadow">
          <div className="max-w-2xl mx-auto px-4">
            <Link href="/" className="text-2xl font-bold">
              FizzBuzz Game
            </Link>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
