"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Trash, ShoppingCart, Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"

export default function WishlistPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { 
    getWishlistWithDetails, 
    removeFromWishlist, 
    loading, 
    clearWishlist 
  } = useWishlist()
  
  const wishlistItems = getWishlistWithDetails()
  const [hoverStates, setHoverStates] = useState({})

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    })
    toast.success(`${item.name} added to cart`)
  }

  const addAllToCart = () => {
    wishlistItems.forEach(item => handleAddToCart(item))
    toast.success("All items added to cart")
  }

  const handleMouseEnter = (itemId) => {
    setHoverStates(prev => ({ ...prev, [itemId]: true }))
  }

  const handleMouseLeave = (itemId) => {
    setHoverStates(prev => ({ ...prev, [itemId]: false }))
  }

  if (!user) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-muted">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Please log in to view and manage your wishlist.
        </p>
        <Link href="/login">
          <Button size="lg">Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Your Wishlist</h1>
        {wishlistItems.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex-1 sm:flex-none"
              onClick={addAllToCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Add All to Cart</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={clearWishlist}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="whitespace-nowrap">Clear Wishlist</span>
            </Button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  <div className="flex justify-between mt-4">
                    <div className="h-9 bg-muted rounded animate-pulse w-24" />
                    <div className="h-9 bg-muted rounded animate-pulse w-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-10 md:py-16">
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-muted">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 md:mb-8 max-w-md mx-auto px-4">
            Items you save to your wishlist will appear here. Start browsing our eco-friendly products now!
          </p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {wishlistItems.map(item => (
            <Card key={item.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <Link href={`/products/${item.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      Carbon Footprint: {item.carbonFootprint} kg CO₂
                    </span>
                  </div>
                  
                  <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 mt-4">
                    <div className="font-bold text-lg text-primary">{formatPrice(item.price)}</div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="flex-1 xs:flex-none"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="text-destructive border-destructive hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => removeFromWishlist(item.id)}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={() => handleMouseLeave(item.id)}
                      >
                        {hoverStates[item.id] ? (
                          <Trash className="h-4 w-4 text-red-500 fill-red-500" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 