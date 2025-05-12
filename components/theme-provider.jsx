"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

const THEMES = {
  light: {
    name: "Light",
    colors: {
      primary: "#10b981", // emerald-500
      background: "#ffffff",
      card: "#f9fafb",
      text: "#111827",
      border: "#e5e7eb",
    },
  },
  dark: {
    name: "Dark",
    colors: {
      primary: "#10b981", // emerald-500
      background: "#1f2937",
      card: "#111827",
      text: "#f9fafb",
      border: "#374151",
    },
  },
  system: {
    name: "System",
    colors: {},
  }
}

const ThemeContext = createContext({ themes: THEMES })

export function useThemeInfo() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <ThemeContext.Provider value={{ themes: THEMES }}>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="light"
        enableSystem
        themes={["light", "dark"]}
        {...props}
      >
        {mounted && children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
} 