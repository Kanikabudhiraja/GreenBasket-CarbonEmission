"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, Clock, Check, AlertCircle, Truck, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { toast } from "sonner"

// This will be removed once we fetch real orders from the API
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
    trackingNumber: "TRK123456789"
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
    trackingNumber: "TRK987654321"
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
    trackingNumber: null
  }
]

// Function to convert the orders from the API to a consistent format
function processApiOrders(apiOrders = []) {
  return apiOrders.map(order => {
    // Get a default status based on the order date
    // In a real application, this would be stored in the database
    const orderDate = new Date(order.date);
    const daysSinceOrder = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24));
    
    let status = "processing";
    if (daysSinceOrder >= 7) {
      status = "delivered";
    } else if (daysSinceOrder >= 2) {
      status = "shipped";
    }
    
    return {
      ...order,
      status: order.status || status,
      deliveryDate: order.estimatedDelivery || null,
      trackingNumber: order.trackingNumber || null
    };
  });
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // Fetch real orders from the API (if available)
        // For now, we'll use the memory cache which stores orders by session ID
        const response = await fetch('/api/user/orders');
        
        if (response.ok) {
          const data = await response.json();
          const processedOrders = processApiOrders(data.orders);
          
          // Mix with sample orders for demo purposes
          // In a real app, you would only use the real orders
          setOrders(processedOrders.length > 0 ? processedOrders : sampleOrders);
        } else {
          // Fallback to sample data if API fails
          console.warn('Failed to fetch orders, using sample data');
          setOrders(sampleOrders);
          
          // Only show error if it's not a 404 (no orders yet)
          if (response.status !== 404) {
            toast.error('Failed to load your orders. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders(sampleOrders);
        toast.error('Failed to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    // For demo purposes, fetch orders regardless of authentication state
    fetchOrders();
  }, []);

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab)

  const getStatusIcon = (status) => {
    switch (status) {
      case "processing":
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-orange-500" />
      case "delivered":
        return <Check className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">Processing</Badge>
      case "shipped":
        return <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800">Shipped</Badge>
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">Delivered</Badge>
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (!user) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-muted">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Please log in to view your order history.
        </p>
        <Link href="/login">
          <Button size="lg">Log In</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 py-4">Your Orders</h1>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden shadow-md">
              <CardHeader className="p-4 pb-0">
                <div className="h-6 bg-muted rounded animate-pulse w-1/4 mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse w-full" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="flex justify-between mt-4">
                    <div className="h-6 bg-muted rounded animate-pulse w-1/5" />
                    <div className="h-9 bg-muted rounded animate-pulse w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {activeTab === "all" 
              ? "You haven't placed any orders yet. Start shopping now!" 
              : `You don't have any ${activeTab} orders at the moment.`}
          </p>
          {activeTab === "all" && (
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <Card key={order.id} className="overflow-hidden shadow-md">
              <CardHeader className="pb-2 pt-5">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/orders/${order.id}`} className="hover:underline">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                    </Link>
                    <CardDescription>
                      Ordered on {format(new Date(order.date), "PPP")}
                    </CardDescription>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-4">
                  {/* Order items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={`${order.id}-${index}`} className="flex justify-between py-2 border-b border-border">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Order total and delivery info */}
                  <div className="flex flex-col md:flex-row justify-between pt-2">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-sm font-medium">
                          {order.status === "delivered" && "Delivered on "}
                          {order.status === "shipped" && "Estimated delivery "}
                          {order.status === "processing" && "Processing since "}
                          {order.deliveryDate
                            ? format(new Date(order.deliveryDate), "PPP")
                            : format(new Date(order.date), "PPP")}
                        </p>
                        {order.trackingNumber && (
                          <p className="text-xs text-muted-foreground">
                            Tracking: <span className="font-mono">{order.trackingNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                      </div>
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </Link>
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