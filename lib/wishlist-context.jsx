"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export const WishlistContext = createContext({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
})

export function WishlistProvider({ children }) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  // Load wishlist data when session changes
  useEffect(() => {
    const loadWishlist = () => {
      if (session?.user) {
        // Get wishlist from localStorage
        const userId = session.user.id || session.user.email
        const savedWishlist = localStorage.getItem(`wishlist_${userId}`)
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist))
          } catch (error) {
            console.error("Failed to parse wishlist from localStorage:", error)
            setWishlist([])
          }
        } else {
          setWishlist([])
        }
      } else {
        // No user, empty wishlist
        setWishlist([])
      }
      setLoading(false)
    }
    
    loadWishlist()
  }, [session])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (session?.user && !loading) {
      const userId = session.user.id || session.user.email
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist))
    }
  }, [wishlist, session, loading])

  // Add product to wishlist
  const addToWishlist = (product) => {
    if (!session?.user) {
      toast.error("Please log in to add items to your wishlist")
      return false
    }
    
    if (!product) return false
    
    // Check if product already in wishlist
    if (wishlist.some((item) => item.id === product.id)) {
      toast.info("Item already in wishlist")
      return false
    }
    
    // Add to wishlist
    setWishlist((prevWishlist) => {
      return [...prevWishlist, product]
    })
    toast.success("Added to wishlist")
    return true
  }

  // Remove product from wishlist
  const removeFromWishlist = (productId) => {
    setWishlist((prevWishlist) => 
      prevWishlist.filter((item) => item.id !== productId)
    )
    toast.success("Removed from wishlist")
    return true
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId)
  }

  // Toggle wishlist status
  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      return removeFromWishlist(productId)
    } else {
      return addToWishlist(productId)
    }
  }

  // Get wishlist items with product details
  const getWishlistWithDetails = () => {
    return wishlist.map(product => {
      if (product) {
        return {
          ...product,
          image: product.images[0] // Use first image for display
        }
      }
      return null
    }).filter(Boolean) // Remove any nulls (products that couldn't be found)
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlist([])
    toast.success("Wishlist cleared")
    return true
  }

  const value = {
    wishlist,
    wishlistItems: wishlist, // For backward compatibility
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getWishlistWithDetails,
    clearWishlist,
    wishlistCount: wishlist.length
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
} 