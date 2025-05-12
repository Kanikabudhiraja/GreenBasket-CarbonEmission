"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [totalCarbonFootprint, setTotalCarbonFootprint] = useState(0)

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save cart to localStorage and calculate total carbon footprint when cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart))
      
      // Calculate total carbon footprint
      const total = cart.reduce((sum, item) => {
        return sum + (item.carbonFootprint * item.quantity)
      }, 0)
      
      setTotalCarbonFootprint(total)
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error)
    }
  }, [cart])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      
      if (existingItem) {
        // Item already exists, increase quantity
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        // New item, add to cart with quantity 1
        // If product has 'images' array instead of 'image', use first image
        const image = product.image || (product.images && product.images[0]) || ''
        return [...prevCart, { ...product, quantity: 1, image }]
      }
    })
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return

    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const value = {
    cart,
    totalCarbonFootprint,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  
  return context
} 