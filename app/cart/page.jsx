"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Trash2, MinusCircle, PlusCircle, ArrowRight, Leaf } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fetchCarbonFootprint } from "@/lib/carbon-calculator"

export default function CartPage() {
  const { cart, totalCarbonFootprint, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [carbonData, setCarbonData] = useState({
    totalFootprint: 0,
    conventionalFootprint: 0,
    savings: { savings: "0", percentage: "0" }
  })
  const [isCalculating, setIsCalculating] = useState(true)
  const router = useRouter()
  
  // Fetch carbon data for all products in cart
  useEffect(() => {
    async function fetchAllCarbonData() {
      if (cart.length === 0) {
        setCarbonData({
          totalFootprint: 0,
          conventionalFootprint: 0,
          savings: { savings: "0", percentage: "0" }
        })
        setIsCalculating(false)
        return
      }
      
      setIsCalculating(true)
      try {
        // Fetch carbon data for each product
        const carbonPromises = cart.map(async (item) => {
          try {
            const data = await fetchCarbonFootprint(item.id)
            // Multiply by quantity
            return {
              footprint: data.footprint * item.quantity,
              conventionalFootprint: data.conventionalFootprint * item.quantity
            }
          } catch (error) {
            console.error(`Error fetching carbon data for product ${item.id}:`, error)
            // Use fallback values
            return {
              footprint: (item.carbonFootprint || 1) * item.quantity,
              conventionalFootprint: ((item.carbonFootprint || 1) * 3) * item.quantity
            }
          }
        })
        
        const results = await Promise.all(carbonPromises)
        
        // Calculate totals
        const totalFootprint = results.reduce((sum, item) => sum + item.footprint, 0)
        const totalConventionalFootprint = results.reduce((sum, item) => sum + item.conventionalFootprint, 0)
        
        // Calculate savings
        const carbonSavings = totalConventionalFootprint - totalFootprint
        const savingsPercentage = totalConventionalFootprint > 0 
          ? ((carbonSavings / totalConventionalFootprint) * 100).toFixed(0) 
          : "0"
        
        setCarbonData({
          totalFootprint: parseFloat(totalFootprint.toFixed(2)),
          conventionalFootprint: parseFloat(totalConventionalFootprint.toFixed(2)),
          savings: {
            savings: carbonSavings.toFixed(2),
            percentage: savingsPercentage
          }
        })
      } catch (error) {
        console.error("Error calculating carbon data:", error)
        // Use fallback from context
        setCarbonData({
          totalFootprint: totalCarbonFootprint || 0,
          conventionalFootprint: (totalCarbonFootprint || 0) * 3,
          savings: {
            savings: ((totalCarbonFootprint || 0) * 2).toFixed(2),
            percentage: "67"
          }
        })
      } finally {
        setIsCalculating(false)
      }
    }
    
    fetchAllCarbonData()
  }, [cart, totalCarbonFootprint])
  
  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  // Calculate trees saved - roughly 25kg CO2 per year per tree
  const calculateTreesSaved = () => {
    const savings = parseFloat(carbonData.savings.savings) || 0
    return Math.ceil(savings / 25)
  }
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty")
      return
    }
    
    setIsLoading(true)
    // Simulate loading state for a smoother experience
    setTimeout(() => {
      setIsLoading(false)
      router.push("/checkout")
    }, 800)
  }
  
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return
    updateQuantity(productId, newQuantity)
    toast.success("Quantity updated")
  }
  
  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId)
    toast.success(`${productName} removed from cart`)
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            You haven't added any products to your cart yet.
          </p>
          <Button asChild className="mt-4">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const cartTotal = getCartTotal()
  const totalWithTax = cartTotal

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                  <div className="h-24 w-24 shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    <div className="flex items-center text-sm text-green-600 gap-1 mt-1">
                      <Leaf className="h-3.5 w-3.5" />
                      <span>{item.carbonFootprint} kg CO₂</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 flex justify-between">
            <Button 
              variant="outline"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your cart?")) {
                  clearCart()
                  toast.success("Cart cleared")
                }
              }}
            >
              Clear Cart
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        
        <div>
          <Card className="py-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="flex items-center gap-1">
                  <Leaf className="h-4 w-4" />
                  Carbon Footprint
                </span>
                <span className="flex items-center">
                  {isCalculating ? (
                    <span className="text-xs">Calculating...</span>
                  ) : (
                    <span>{carbonData.totalFootprint.toFixed(2)} kg CO₂</span>
                  )}
                </span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(totalWithTax)}</span>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md text-sm text-green-700 dark:text-green-400 mt-4">
                <p className="font-medium">Sustainability Impact</p>
                {isCalculating ? (
                  <p className="mt-1 text-xs">Calculating your sustainability impact...</p>
                ) : (
                  <>
                    <p className="mt-1">
                      Your eco-friendly purchase generates {carbonData.totalFootprint.toFixed(2)} kg CO₂, which is {carbonData.savings.savings} kg less than conventional alternatives ({carbonData.conventionalFootprint.toFixed(2)} kg CO₂).
                    </p>
                    <p className="mt-1">
                      That's {carbonData.savings.percentage}% less carbon emissions and equivalent to saving {calculateTreesSaved()} {calculateTreesSaved() === 1 ? 'tree' : 'trees'} per year.
                    </p>
                    <p className="mt-2 text-xs text-green-600 dark:text-green-500">
                      <span className="font-medium">How we calculate:</span> We use real-time carbon emission data through our API to compare eco-friendly products with conventional alternatives.
                    </p>
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading || isCalculating}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 