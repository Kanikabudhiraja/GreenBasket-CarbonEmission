"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Package, 
  Truck, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  ArrowLeft, 
  CalendarIcon, 
  MapPin, 
  CreditCard, 
  Mail, 
  User, 
  Home
} from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { format } from "date-fns"
import { toast } from "sonner"

// Sample data - in a real app, this would be fetched from the database
const sampleOrders = [
  {
    id: "ORD-2023-0001",
    date: "2023-11-15",
    items: [
      { id: 1, name: "Eco-Friendly Jeans", price: 4999, quantity: 1 },
      { id: 3, name: "Recycled Glass Vase", price: 2999, quantity: 2 }
    ],
    total: 10997,
    status: "delivered",
    deliveryDate: "2023-11-18",
    trackingNumber: "TRK123456789",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    shippingAddress: {
      street: "123 Green Street",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400001",
      country: "India"
    },
    paymentMethod: "Credit Card",
    paymentStatus: "paid"
  },
  {
    id: "ORD-2023-0002",
    date: "2023-12-01",
    items: [
      { id: 5, name: "Eco-Friendly Study Table", price: 12999, quantity: 1 }
    ],
    total: 12999,
    status: "shipped",
    deliveryDate: "2023-12-07",
    trackingNumber: "TRK987654321",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    shippingAddress: {
      street: "456 Eco Avenue",
      city: "Delhi",
      state: "Delhi",
      zip: "110001",
      country: "India"
    },
    paymentMethod: "UPI",
    paymentStatus: "paid"
  },
  {
    id: "ORD-2023-0003",
    date: "2023-12-10",
    items: [
      { id: 4, name: "Sustainable T-Shirt", price: 1999, quantity: 3 }
    ],
    total: 5997,
    status: "processing",
    deliveryDate: null,
    trackingNumber: null,
    customerName: "Amit Patel",
    customerEmail: "amit@example.com",
    shippingAddress: {
      street: "789 Sustainable Lane",
      city: "Bangalore",
      state: "Karnataka",
      zip: "560001",
      country: "India"
    },
    paymentMethod: "Debit Card",
    paymentStatus: "paid"
  }
]

// Process API orders to have a consistent format
function processApiOrder(apiOrder) {
  if (!apiOrder) return null;
  
  // Get a default status based on the order date
  const orderDate = new Date(apiOrder.date);
  const daysSinceOrder = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24));
  
  let status = "processing";
  if (daysSinceOrder >= 7) {
    status = "delivered";
  } else if (daysSinceOrder >= 2) {
    status = "shipped";
  }
  
  return {
    ...apiOrder,
    status: apiOrder.status || status,
    deliveryDate: apiOrder.estimatedDelivery || null,
    trackingNumber: apiOrder.trackingNumber || null,
    customerName: apiOrder.customerName || apiOrder.shippingAddress?.name || "Customer",
    customerEmail: apiOrder.customerEmail || "No email provided",
    paymentMethod: apiOrder.paymentMethod || "Card",
    paymentStatus: apiOrder.paymentStatus || "paid"
  };
}

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params
  
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true)
      try {
        // First try to fetch from the API
        const response = await fetch(`/api/orders/${id}`)
        
        if (response.ok) {
          const data = await response.json();
          setOrder(processApiOrder(data.order));
        } else {
          // Fallback to sample data for demo
          const sampleOrder = sampleOrders.find(o => o.id === id) || null;
          
          if (sampleOrder) {
            setOrder(sampleOrder);
          } else {
            // If no sample order matches, check if this might be a real order ID
            const apiResponse = await fetch('/api/user/orders');
            if (apiResponse.ok) {
              const apiData = await apiResponse.json();
              const matchingOrder = apiData.orders.find(o => o.id === id);
              if (matchingOrder) {
                setOrder(processApiOrder(matchingOrder));
              } else {
                throw new Error("Order not found");
              }
            } else {
              throw new Error("Order not found");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order details");
        toast.error("Order not found or could not be loaded");
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchOrderDetails()
    }
  }, [id])
  
  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <RefreshCw className="h-8 w-8 text-blue-500" />
      case "shipped":
        return <Truck className="h-8 w-8 text-orange-500" />
      case "delivered":
        return <Check className="h-8 w-8 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-8 w-8 text-red-500" />
      default:
        return <Package className="h-8 w-8 text-gray-500" />
    }
  }
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 font-medium">Processing</Badge>
      case "shipped":
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200 font-medium">Shipped</Badge>
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 font-medium">Delivered</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-medium">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  const getStatusDescription = (status, deliveryDate) => {
    switch (status) {
      case "processing":
        return "Your order is being processed and will be shipped soon.";
      case "shipped":
        return `Your order has been shipped and is expected to arrive by ${
          deliveryDate ? format(new Date(deliveryDate), "PPP") : "soon"
        }.`;
      case "delivered":
        return `Your order was delivered on ${
          deliveryDate ? format(new Date(deliveryDate), "PPP") : "recently"
        }.`;
      case "cancelled":
        return "This order has been cancelled.";
      default:
        return "Order status is pending.";
    }
  }
  
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <Skeleton className="h-40 w-full rounded-lg mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    )
  }
  
  if (error || !order) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-white/80">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        
        <Card className="text-center py-12 shadow-md">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {error || "We couldn't find the order you're looking for."}
            </p>
            <Button asChild size="lg">
              <Link href="/orders">View All Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  const getProgressPercentage = (status) => {
    switch (status) {
      case "processing": return 25;
      case "shipped": return 50;
      case "delivered": return 100;
      case "cancelled": return 0;
      default: return 0;
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-8 hover:bg-white/80 -ml-2 group transition-all">
        <Link href="/orders">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Orders
        </Link>
      </Button>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold py-4">Order {order.id}</h1>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-muted-foreground">
            Placed on {format(new Date(order.date), "PPP")}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button asChild size="sm" variant="outline" className="gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Link href={`/support/order/${order.id}`}>
              <AlertCircle className="h-4 w-4" />
              Need Help?
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mb-8 pb-4 overflow-hidden shadow-md">
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 h-3 relative">
          <div 
            className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500" 
            style={{ width: `${getProgressPercentage(order.status)}%` }}
          ></div>
        </div>
        <CardHeader className="pb-0">
          <div className="flex items-center gap-4">
            {getStatusIcon(order.status)}
            <div className="flex-1">
              <CardTitle className="py-2 flex flex-col sm:flex-row sm:items-center gap-2">
                <span>Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
              </CardTitle>
              <CardDescription className="text-base">
                {getStatusDescription(order.status, order.deliveryDate)}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {order.trackingNumber && (
              <div className="flex items-center gap-2 text-sm bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                <Truck className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="font-medium mr-2">Tracking Number:</span>
                  <span className="font-mono">{order.trackingNumber}</span>
                </div>
              </div>
            )}
            {order.deliveryDate && (
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {order.status === "delivered" ? "Delivered on" : "Expected delivery"}:
                </span> 
                <span className="text-green-700 dark:text-green-400 font-medium">
                  {format(new Date(order.deliveryDate), "PPPP")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-md overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-900/20 py-2 px-4">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-lg py-2 text-blue-700 dark:text-blue-300">Shipping Address</CardTitle>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-1">
              <p className="font-medium">{order.customerName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md overflow-hidden pb-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 py-2 px-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <CardTitle className="text-lg py-2 text-purple-700 dark:text-purple-300">Payment Information</CardTitle>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                <span className="text-gray-600 dark:text-gray-400">Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <Badge className={order.paymentStatus === "paid" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800"}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-2 rounded-md">
                <span className="text-gray-600 dark:text-gray-400">Amount</span>
                <span className="font-bold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md overflow-hidden">
          <div className="bg-amber-50 dark:bg-amber-900/20 py-2 px-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <CardTitle className="text-lg py-2 text-amber-700 dark:text-amber-300">Contact Information</CardTitle>
            </div>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm block">Name</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400 text-sm block">Email</span>
                  <span className="font-medium">{order.customerEmail}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md overflow-hidden">
        <div className="bg-green-50 dark:bg-green-900/20 py-2 px-4">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
            <CardTitle className="text-lg py-2 text-green-700 dark:text-green-300">Order Summary</CardTitle>
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between py-3 border-b last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs bg-gray-100 dark:bg-gray-800">Qty: {item.quantity}</Badge>
                    <Badge variant="outline" className="ml-2 text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                      Eco-friendly
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.price)}</p>
                  {item.quantity > 1 && (
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price * item.quantity)} total
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 space-y-2 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span>Free</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800/20 py-4">
          <Button variant="outline" asChild>
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <Button asChild>
            <Link href="/products">
              <Package className="mr-2 h-4 w-4" />
              Buy Again
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 