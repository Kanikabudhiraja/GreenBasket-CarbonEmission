"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart } from "@/components/ui/chart"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ShoppingBag, 
  Users, 
  Leaf, 
  TrendingUp, 
  BarChart4, 
  Package, 
  RefreshCw,
  Download,
  Search,
  FileText 
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import ProductModal from "@/components/product-modal"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  CartesianGrid, 
  Dot, 
  Line, 
  LineChart, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Label
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import React from "react"

// Add global CSS for chart colors
const chartStyles = `
  :root {
    --color-jan: hsl(var(--chart-1));
    --color-feb: hsl(var(--chart-2));
    --color-mar: hsl(var(--chart-3));
    --color-apr: hsl(var(--chart-4));
    --color-may: hsl(var(--chart-5));
    --color-jun: hsl(var(--chart-6));
    --color-retail: hsl(var(--chart-1));
    --color-online: hsl(var(--chart-2));
    --color-sustainabilityScore: hsl(var(--chart-2));
  }

  .dark {
    --chart-1: 142 76% 36%;
    --chart-2: 205 100% 50%;
    --chart-3: 52 100% 50%;
    --chart-4: 170 100% 40%;
    --chart-5: 291 64% 42%;
    --chart-6: 31 100% 60%;
  }

  .light {
    --chart-1: 142 72% 29%;
    --chart-2: 205 100% 36%;
    --chart-3: 35 100% 43%;
    --chart-4: 170 100% 30%;
    --chart-5: 291 70% 34%;
    --chart-6: 31 100% 48%;
  }
`

// Mock data - Replace with actual API calls
const products = [
  {
    id: 1,
    name: "Recycled Denim Jacket",
    price: 49.99,
    carbonFootprint: 2.5,
    stock: 100,
    category: "clothing",
    status: "active"
  },
  {
    id: 2,
    name: "Upcycled Wooden Chair",
    price: 89.99,
    carbonFootprint: 1.2,
    stock: 50,
    category: "furniture",
    status: "active"
  },
  {
    id: 3,
    name: "Eco-Friendly Water Bottle",
    price: 24.99,
    carbonFootprint: 0.8,
    stock: 200,
    category: "accessories",
    status: "active"
  },
  {
    id: 4,
    name: "Bamboo Toothbrush",
    price: 5.99,
    carbonFootprint: 0.3,
    stock: 500,
    category: "personal-care",
    status: "active"
  },
  {
    id: 5,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    carbonFootprint: 1.5,
    stock: 150,
    category: "clothing",
    status: "active"
  }
]

// Mock order data
const orders = [
  {
    id: "ORD-2023-0001",
    customer: "John Doe",
    date: "2023-11-15",
    total: 10997,
    status: "delivered",
    items: 2
  },
  {
    id: "ORD-2023-0002",
    customer: "Jane Smith",
    date: "2023-12-01",
    total: 12999,
    status: "shipped",
    items: 1
  },
  {
    id: "ORD-2023-0003",
    customer: "Amit Patel",
    date: "2023-12-10",
    total: 5997,
    status: "processing",
    items: 3
  },
  {
    id: "ORD-2023-0004",
    customer: "Sarah Johnson",
    date: "2023-12-15",
    total: 8999,
    status: "processing",
    items: 2
  },
  {
    id: "ORD-2023-0005",
    customer: "Michael Brown",
    date: "2023-12-18",
    total: 3999,
    status: "pending",
    items: 1
  }
]

// Mock user data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    carbonSaved: 12,
    joinDate: "2023-10-05",
    orders: 3
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    carbonSaved: 8,
    joinDate: "2023-11-12",
    orders: 2
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@gmail.com",
    role: "admin",
    carbonSaved: 25,
    joinDate: "2023-09-01",
    orders: 5
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "user",
    carbonSaved: 5,
    joinDate: "2023-12-08",
    orders: 1
  }
]

// Sustainability metrics data for pie chart
const sustainabilityData = [
  { month: "Jan", sustainabilityScore: 42, fill: "var(--color-jan)" },
  { month: "Feb", sustainabilityScore: 55, fill: "var(--color-feb)" },
  { month: "Mar", sustainabilityScore: 50, fill: "var(--color-mar)" },
  { month: "Apr", sustainabilityScore: 68, fill: "var(--color-apr)" },
  { month: "May", sustainabilityScore: 72, fill: "var(--color-may)" },
  { month: "Jun", sustainabilityScore: 85, fill: "var(--color-jun)" },
]

const sustainabilityChartConfig = {
  sustainabilityScore: {
    label: "Sustainability Score",
    color: "hsl(var(--chart-2))",
  },
  jan: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  feb: {
    label: "February", 
    color: "hsl(var(--chart-2))",
  },
  mar: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  apr: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  may: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
  jun: {
    label: "June",
    color: "hsl(var(--chart-6))",
  },
}

// Sales data for bar chart
const salesData = [
  { date: "2024-01-01", retail: 15000, online: 10000 },
  { date: "2024-01-15", retail: 18000, online: 14000 },
  { date: "2024-02-01", retail: 17000, online: 15000 },
  { date: "2024-02-15", retail: 19000, online: 13000 },
  { date: "2024-03-01", retail: 16000, online: 12000 },
  { date: "2024-03-15", retail: 18500, online: 9500 },
  { date: "2024-04-01", retail: 22000, online: 20000 },
  { date: "2024-04-15", retail: 25000, online: 17000 },
  { date: "2024-05-01", retail: 21000, online: 17000 },
  { date: "2024-05-15", retail: 24000, online: 14000 },
  { date: "2024-06-01", retail: 28000, online: 24000 },
  { date: "2024-06-15", retail: 30000, online: 22000 },
]

const salesChartConfig = {
  revenue: {
    label: "Revenue",
  },
  retail: {
    label: "Retail Sales",
    color: "hsl(var(--chart-1))",
  },
  online: {
    label: "Online Sales",
    color: "hsl(var(--chart-2))",
  },
}

function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [productStatusFilter, setProductStatusFilter] = useState("all")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [activeSalesChart, setActiveSalesChart] = useState("retail")
  const [activeSustainabilityMonth, setActiveSustainabilityMonth] = useState(sustainabilityData[0].month)

  // Calculate totals for sales data
  const salesTotal = React.useMemo(
    () => ({
      retail: salesData.reduce((acc, curr) => acc + curr.retail, 0),
      online: salesData.reduce((acc, curr) => acc + curr.online, 0),
    }),
    []
  )

  // Find active month index for the pie chart
  const activeSustainabilityIndex = React.useMemo(
    () => sustainabilityData.findIndex((item) => item.month === activeSustainabilityMonth),
    [activeSustainabilityMonth]
  )
  
  const sustainabilityMonths = React.useMemo(() => sustainabilityData.map((item) => item.month), [])

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (productId) => {
    try {
      // TODO: Implement delete product API call
      toast.success("Product deleted successfully")
    } catch (error) {
      toast.error("Failed to delete product")
      console.error(error)
    }
  }

  const handleSubmitProduct = async (data) => {
    try {
      // TODO: Implement create/update product API call
      console.log("Product data:", data)
      toast.success(
        selectedProduct
          ? "Product updated successfully"
          : "Product created successfully"
      )
      setIsModalOpen(false)
    } catch (error) {
      toast.error("Failed to save product")
      console.error(error)
    }
  }

  // Filter products based on search term and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (productStatusFilter === "all") {
      return matchesSearch;
    }
    
    return matchesSearch && product.status === productStatusFilter;
  });

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (orderStatusFilter === "all") {
      return true;
    }
    
    return order.status === orderStatusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Delivered</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 w-full py-4" />
          ))}
        </div>

        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full py-4" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <style jsx global>{chartStyles}</style>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold py-4">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your products, orders, and customers</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {products.filter(p => p.stock < 20).length} items low in stock
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120 kg CO₂</div>
            <p className="text-xs text-green-500 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              15% increase from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {orders.filter(o => o.status === 'processing').length} orders being processed
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-md py-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {users.filter(u => new Date(u.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length} new users this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="shadow-sm rounded-lg mb-6">
          <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Products</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Orders</TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card className="shadow-md py-4">
            <CardHeader>
              <CardTitle className="py-4">Product Management</CardTitle>
              <CardDescription>Manage your product inventory and details</CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={productStatusFilter}
                  onValueChange={setProductStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Carbon Footprint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="capitalize">{product.category}</TableCell>
                          <TableCell>{formatPrice(product.price)}</TableCell>
                          <TableCell>
                            <span className={product.stock < 20 ? "text-red-500 font-medium" : ""}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell>{product.carbonFootprint} kg CO₂</TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card className="shadow-md py-4">
            <CardHeader>
              <CardTitle className="py-4">Order Management</CardTitle>
              <CardDescription>View and manage customer orders</CardDescription>
              
              <div className="flex justify-between items-center mt-4 flex-col sm:flex-row gap-4">
                <Select
                  value={orderStatusFilter}
                  onValueChange={setOrderStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Download className="h-4 w-4" />
                  Export Orders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{formatPrice(order.total / 100)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card className="shadow-md py-4">
            <CardHeader>
              <CardTitle className="py-4">User Management</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Join Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Carbon Saved</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "destructive" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.orders}</TableCell>
                        <TableCell>{user.carbonSaved} kg CO₂</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="flex flex-col py-4">
              <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                  <CardTitle>Sustainability Metrics</CardTitle>
                  <CardDescription>Carbon footprint reduction over time</CardDescription>
                </div>
                <Select value={activeSustainabilityMonth} onValueChange={setActiveSustainabilityMonth}>
                  <SelectTrigger
                    className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                    aria-label="Select a month"
                  >
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent align="end" className="rounded-xl">
                    {sustainabilityMonths.map((key) => {
                      const config = sustainabilityChartConfig[key.toLowerCase() === "jun" ? "jun" : key.toLowerCase()]

                      if (!config) {
                        return null
                      }

                      return (
                        <SelectItem
                          key={key}
                          value={key}
                          className="rounded-lg [&_span]:flex"
                        >
                          <div className="flex items-center gap-2 text-xs">
                            <span
                              className="flex h-3 w-3 shrink-0 rounded-sm"
                              style={{
                                backgroundColor: `var(--color-${key.toLowerCase() === "jun" ? "jun" : key.toLowerCase()})`,
                              }}
                            />
                            {config?.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="flex flex-1 justify-center pb-0">
                <ChartContainer
                  config={sustainabilityChartConfig}
                  className="mx-auto aspect-square w-full max-w-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={sustainabilityData}
                      dataKey="sustainabilityScore"
                      nameKey="month"
                      innerRadius={60}
                      strokeWidth={5}
                      activeIndex={activeSustainabilityIndex}
                      activeShape={({
                        outerRadius = 0,
                        ...props
                      }) => (
                        <g>
                          <Sector {...props} outerRadius={outerRadius + 10} />
                          <Sector
                            {...props}
                            outerRadius={outerRadius + 25}
                            innerRadius={outerRadius + 12}
                          />
                        </g>
                      )}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {sustainabilityData[activeSustainabilityIndex].sustainabilityScore}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Score
                                </tspan>
                              </text>
                            )
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
                <div className="flex gap-2 font-medium leading-none">
                  Sustainability score up by 43% <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                  January - June 2024
                </div>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>
                    Monthly retail vs online sales data
                  </CardDescription>
                </div>
                <div className="flex">
                  {["retail", "online"].map((key) => {
                    return (
                      <button
                        key={key}
                        data-active={activeSalesChart === key}
                        className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                        onClick={() => setActiveSalesChart(key)}
                      >
                        <span className="text-xs text-muted-foreground">
                          {salesChartConfig[key].label}
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-2xl">
                          {formatPrice(salesTotal[key])}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardHeader>
              <CardContent className="px-2 sm:p-6">
                <ChartContainer
                  config={salesChartConfig}
                  className="aspect-auto h-[300px] w-full"
                >
                  <RechartsBarChart
                    accessibilityLayer
                    data={salesData}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      stroke="var(--muted-foreground)"
                    />
                    <YAxis 
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          notation: 'compact',
                          maximumFractionDigits: 1
                        }).format(value)
                      }
                      stroke="var(--muted-foreground)"
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          className="w-[150px]"
                          nameKey="revenue"
                          labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          }}
                          formatter={(value) => 
                            new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                              maximumFractionDigits: 0
                            }).format(value)
                          }
                        />
                      }
                    />
                    <Bar 
                      dataKey={activeSalesChart} 
                      fill={activeSalesChart === "retail" ? "var(--color-retail, hsl(var(--chart-1)))" : "var(--color-online, hsl(var(--chart-2)))"}
                      radius={[4, 4, 0, 0]}
                      barSize={30}
                    />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm pb-4">
                <div className="flex gap-2 font-medium leading-none">
                  Revenue increased by 12.5% this month <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Total: {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(salesData.reduce((sum, item) => sum + item.retail + item.online, 0))}
                </div>
              </CardFooter>
            </Card>
            
            <Card className="shadow-md md:col-span-2 py-4">
              <CardHeader>
                <CardTitle className="py-4">Product Category Distribution</CardTitle>
                <CardDescription>Breakdown of products by category</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center overflow-x-auto">
                <Chart
                  type="doughnut"
                  data={{
                    labels: ['Clothing', 'Furniture', 'Accessories', 'Personal Care', 'Home Goods'],
                    datasets: [
                      {
                        label: 'Products',
                        data: [
                          products.filter(p => p.category === 'clothing').length,
                          products.filter(p => p.category === 'furniture').length,
                          products.filter(p => p.category === 'accessories').length,
                          products.filter(p => p.category === 'personal-care').length,
                          products.filter(p => p.category === 'home').length,
                        ],
                        backgroundColor: [
                          'var(--color-jan)',
                          'var(--color-feb)',
                          'var(--color-mar)',
                          'var(--color-apr)',
                          'var(--color-may)',
                        ],
                        borderColor: [
                          'var(--color-jan)',
                          'var(--color-feb)',
                          'var(--color-mar)',
                          'var(--color-apr)',
                          'var(--color-may)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        display: true,
                        labels: {
                          boxWidth: 10,
                          padding: 10,
                          color: 'var(--foreground)',
                        }
                      },
                    },
                  }}
                  className="h-80 min-w-[300px] max-w-md"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedProduct}
          onSubmit={handleSubmitProduct}
        />
      )}
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  )
} 