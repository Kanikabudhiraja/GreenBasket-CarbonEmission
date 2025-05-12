"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { getStripe } from "@/lib/stripe-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  ShoppingCart, 
  CreditCard, 
  Tag, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Truck, 
  Shield, 
  Leaf 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [originalTotal, setOriginalTotal] = useState(0)
  const [discountedTotal, setDiscountedTotal] = useState(0)
  
  // Calculate order summary
  useEffect(() => {
    if (cart.length > 0) {
      const subtotal = cart.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
      }, 0);
      
      setOriginalTotal(subtotal);
      setDiscountedTotal(couponApplied && couponCode === "discount1" ? 1 : subtotal);
    }
  }, [cart, couponApplied, couponCode]);
  
  // Check if cart is empty and redirect
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/cart");
    }
  }, [cart, router]);
  
  // Handle applying coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    
    if (couponCode === "discount1") {
      setCouponApplied(true);
      setDiscountedTotal(1); // Set price to ₹1
      toast.success("Coupon applied successfully! Your total is now ₹1");
    } else {
      toast.error("Invalid coupon code");
      setCouponApplied(false);
    }
  };
  
  // Handle checkout with Stripe
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout");
      router.push("/login?callbackUrl=/checkout");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          couponCode: couponApplied ? couponCode : null,
        }),
      });
      
      const { sessionId, error } = await response.json();
      
      if (error) {
        toast.error(error);
        setIsLoading(false);
        return;
      }
      
      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
        toast.error(stripeError.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An error occurred during checkout");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Estimated delivery date (7 days from now)
  const estimatedDelivery = format(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    "MMM d, yyyy"
  );
  
  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        {/* Left Column - Order Details */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl font-bold py-4">Checkout</h1>
            <p className="text-muted-foreground">Review your order and complete purchase</p>
          </div>
          
          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center py-4">
                <ShoppingCart className="mr-2 h-5 w-5 text-primary" />
                <span>Your Cart ({cart.length} items)</span>
              </CardTitle>
              <CardDescription>Review your items before checkout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                    {item.images && item.images[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Qty: {item.quantity || 1}</span>
                      {item.eco && (
                        <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <Leaf className="mr-1 h-3 w-3" />
                          Eco-friendly
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} each
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between bg-muted/50 py-3">
              <Link href="/cart">
                <Button variant="outline" className="gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Back to Cart
                </Button>
              </Link>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Subtotal</div>
                <div className="text-lg font-medium">{formatPrice(originalTotal)}</div>
              </div>
            </CardFooter>
          </Card>
          
          {/* Shipping Information */}
          <Card className="p-4">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-primary" />
                <span>Shipping Information</span>
              </CardTitle>
              <CardDescription>Shipping details will be collected during payment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Standard Shipping</span>
                    </div>
                    <Badge variant="outline">Free</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Estimated delivery by {estimatedDelivery}
                  </div>
                </div>
                <Alert>
                  <AlertDescription className="flex items-center text-sm">
                    <Leaf className="mr-2 h-4 w-4 text-green-500" />
                    All our deliveries use eco-friendly packaging and carbon-neutral shipping methods
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:w-96 space-y-6 py-4">
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="py-4">Order Summary</CardTitle>
              <CardDescription>Complete your purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm py-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(originalTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span className="flex items-center">
                      <Tag className="mr-1 h-3 w-3" />
                      Coupon Discount
                    </span>
                    <span>-{formatPrice(originalTotal - discountedTotal)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(discountedTotal)}</span>
                </div>
              </div>
              
              {/* Coupon Form */}
              <div>
                <p className="text-sm font-medium mb-2 py-4">Have a coupon?</p>
                <form className="flex gap-2" onSubmit={handleApplyCoupon}>
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                    disabled={couponApplied}
                  />
                  <Button 
                    type="submit" 
                    variant={couponApplied ? "outline" : "secondary"}
                    size="sm"
                    disabled={!couponCode || couponApplied}
                  >
                    {couponApplied ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        Applied
                      </>
                    ) : "Apply"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-1">
                  Try "discount1" for a special discount
                </p>
              </div>
              
              {/* Checkout Button */}
              <Button 
                className="w-full h-11 mt-4 gap-2"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay {formatPrice(discountedTotal)}
                  </>
                )}
              </Button>
              
              {/* Payment Security Note */}
              <div className="text-center text-xs text-muted-foreground py-4">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Secure Payment Processing</span>
                </div>
                <p>
                  We use Stripe for secure payment processing. Your payment information is never stored on our servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 