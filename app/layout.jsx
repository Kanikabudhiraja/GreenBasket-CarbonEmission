"use client"

import { Inter } from "next/font/google"
import "@/app/globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "sonner"
import { CartProvider } from "@/lib/cart-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/lib/auth-context"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  // Get current pathname to conditionally apply padding
  const pathname = usePathname();
  
  // Check if current page is an auth page (login, signup, forgot-password)
  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <Navbar carbonApiEnabled={true} />
                  <main className={`flex-grow ${isAuthPage ? '' : 'px-4 py-6 md:px-6 lg:px-8'}`}>
                    {children}
                  </main>
                  <Footer />
                  <Toaster position="top-center" richColors closeButton />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
} 