"use client"

import { usePathname } from "next/navigation"

export function DefaultLayout({ children }) {
  const pathname = usePathname()
  
  // Skip container styling for login, signup, and similar auth pages
  if (pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password") {
    return children
  }
  
  // Apply container with padding for all other pages
  return (
    <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
      {children}
    </div>
  )
} 