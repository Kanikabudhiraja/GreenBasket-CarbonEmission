"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

// Create an AuthContext for backward compatibility
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)
  const loading = status === "loading"
  
  // Update user when session changes
  useEffect(() => {
    if (session?.user) {
      // Map NextAuth session to the format expected by existing components
      setUser({
        id: session.user.id || session.user.email,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role || "user"
      });
    } else {
      setUser(null);
    }
  }, [session]);
  
  // Compatibility login function that uses Next.js auth
  const login = async (email, password) => {
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    
    if (result?.error) {
      throw new Error("Login failed");
    }
    
    return user;
  }
  
  // Logout function that uses Next.js auth
  const logout = () => {
    signOut({ redirect: true });
  }
  
  // Create value object for context
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    session // Also expose the original session for direct access
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 