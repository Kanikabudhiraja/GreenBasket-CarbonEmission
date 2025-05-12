"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Package, Truck, Calendar, AlertTriangle, ChevronRight, RefreshCw } from "lucide-react"
import Link from "next/link"
import { format, addDays } from "date-fns"
import { toast } from "sonner"

// Inner component that uses searchParams
function CheckoutSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [error, setError] = useState(null)
  const fetchStartedRef = useRef(false)
  
  // Get session ID from URL
  const sessionId = searchParams.get("session_id")
  
  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID")
      toast.error("Invalid session. Redirecting to home page...")
      setTimeout(() => router.push("/"), 2000)
      return
    }
    
    // Prevent multiple API calls for the same session
    if (fetchStartedRef.current) {
      return;
    }
    
    const fetchOrderDetails = async () => {
      try {
        // Mark that we've started fetching to prevent duplicate calls
        fetchStartedRef.current = true;
        setIsLoading(true)
        
        // Fetch real order details from our API
        const response = await fetch(`/api/orders?session_id=${encodeURIComponent(sessionId)}`, {
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch order details')
        }
        
        const data = await response.json()
        
        if (!data.order) {
          throw new Error('No order data received')
        }
        
        // Clear the cart after successful order
        clearCart()
        
        // Set order details
        setOrder(data.order)
        setError(null)
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError(error.message || "Could not retrieve order details")
        
        // Allow retrying if there was an error
        fetchStartedRef.current = false;
        
        // Only show toast on final retry
        if (retryCount >= 2) {
          toast.error("Could not retrieve order details")
        }
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchOrderDetails()
    
    // Auto-retry up to 3 times if there's an error (might be a timing issue with Stripe webhook)
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [sessionId, router, clearCart, retryCount, error])
  
  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price / 100) // Divide by 100 as Stripe amounts are in paise
  }
  
  const handleRetry = () => {
    fetchStartedRef.current = false;
    setRetryCount(0)
    setError(null)
  }
  
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <h2 className="text-xl font-medium">Processing your order...</h2>
          <p className="text-muted-foreground">Please wait while we confirm your payment</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center pt-6">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <CardTitle className="pt-4">Something went wrong</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center px-6">
            <p className="mb-4">There may be a delay in processing your order information.</p>
            {retryCount < 3 ? (
              <p>Retrying automatically... ({retryCount + 1}/3)</p>
            ) : (
              <Button onClick={handleRetry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry Manually
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center pt-6">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
            <CardTitle className="pt-4">Order Not Found</CardTitle>
            <CardDescription>We couldn't find details for this order.</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-6">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-bold pt-4 py-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mt-2 pt-1">Thank you for your purchase. Your order has been received.</p>
        {order.paymentStatus === 'paid' && (
          <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Payment Completed
          </Badge>
        )}
      </div>
      
      <Card className="mb-8 shadow-md border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center pt-4 py-4">
            <Package className="h-5 w-5 mr-2 text-primary" />
            Order Details
          </CardTitle>
          <CardDescription className="pt-1">Order #{order.id} placed on {format(new Date(order.date), "PPP")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2 pt-4 py-4">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span>{format(new Date(order.date), "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-medium">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 pt-4 py-4">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name</span>
                  <span>{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Email</span>
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span>Address</span>
                  <div className="text-right">
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2 pt-4 py-4">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2">
                  <div className="flex items-center">
                    <span>{item.name}</span>
                    {item.quantity > 1 && (
                      <Badge variant="outline" className="ml-2">x{item.quantity}</Badge>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Eco-friendly
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-8 shadow-md border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center pt-4 py-4">
            <Truck className="h-5 w-5 mr-2 text-primary" />
            Shipping Status
          </CardTitle>
          <CardDescription className="pt-1">Your order is being processed</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 px-6 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-full max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">1</div>
                <div className="h-1 flex-1 bg-primary" />
                <div className="h-6 w-6 rounded-full bg-primary/20 dark:bg-primary/40 flex items-center justify-center text-xs">2</div>
                <div className="h-1 flex-1 bg-primary/20 dark:bg-primary/40" />
                <div className="h-6 w-6 rounded-full bg-primary/20 dark:bg-primary/40 flex items-center justify-center text-xs">3</div>
                <div className="h-1 flex-1 bg-primary/20 dark:bg-primary/40" />
                <div className="h-6 w-6 rounded-full bg-primary/20 dark:bg-primary/40 flex items-center justify-center text-xs">4</div>
              </div>
              <div className="flex justify-between mt-2 text-xs">
                <span>Confirmed</span>
                <span>Processing</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border p-4 bg-muted/50 dark:bg-muted/10">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium pt-1 py-4">Estimated Delivery Date</h3>
                <p className="text-sm">{format(new Date(order.estimatedDelivery), "PPPP")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href={`/orders/${order.id}`}>
            View Order Details
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" className="gap-2">
          <Link href="/products">
            <Package className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Loading fallback component
function CheckoutSuccessLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <h2 className="text-xl font-medium">Loading order details...</h2>
        <p className="text-muted-foreground">Please wait a moment</p>
      </div>
    </div>
  )
}

// Main component that wraps with Suspense
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccess />
    </Suspense>
  )
} 