"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Chart } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { 
  BadgeCheck, 
  Leaf, 
  BarChart3, 
  CalendarDays, 
  ShoppingBag, 
  CreditCard, 
  TrendingUp, 
  Droplets, 
  Recycle, 
  Zap, 
  Star, 
  Globe, 
  CircleUser,
  ArrowRightIcon
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import * as React from "react"
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  Label, 
  Pie, 
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  PolarRadiusAxis,
  Sector,
  LineChart,
  Line,
  AreaChart,
  Area,
  YAxis
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - Replace with actual API calls
const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/avatars/john.jpg",
  carbonFootprint: 45.2,
  rank: 3,
  totalOrders: 12,
  totalSaved: 120.5,
  level: 4,
  nextLevelProgress: 78,
  memberSince: "Jan 2023"
}

const sustainabilityData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Your Carbon Footprint",
      data: [12, 19, 15, 25, 22, 30],
      borderColor: "rgba(16, 185, 129, 1)",
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      tension: 0.4,
      fill: true
    },
    {
      label: "Average User",
      data: [15, 22, 18, 28, 25, 35],
      borderColor: "rgba(99, 102, 241, 1)",
      backgroundColor: "rgba(99, 102, 241, 0.1)",
      tension: 0.4,
      fill: true
    }
  ]
}

// Enhanced data for pie chart as direct Recharts format
const carbonSourcesChartData = [
  { source: "Shopping", value: 45, fill: "rgba(16, 185, 129, 0.8)" },
  { source: "Transport", value: 25, fill: "rgba(99, 102, 241, 0.8)" },
  { source: "Energy", value: 15, fill: "rgba(251, 191, 36, 0.8)" },
  { source: "Food", value: 10, fill: "rgba(239, 68, 68, 0.8)" },
  { source: "Other", value: 5, fill: "rgba(124, 58, 237, 0.8)" }
]

// Enhanced data for bar chart in Recharts format
const categorySpendingChartData = [
  { category: "Clothing", spending: 4500 },
  { category: "Furniture", spending: 7800 },
  { category: "Home", spending: 3200 },
  { category: "Accessories", spending: 2100 },
  { category: "Personal Care", spending: 1800 },
  { category: "Stationery", spending: 900 }
]

// Convert sustainability data to Recharts format for radar
const sustainabilityRadarData = [
  { month: "Jan", you: 12, average: 15 },
  { month: "Feb", you: 19, average: 22 },
  { month: "Mar", you: 15, average: 18 },
  { month: "Apr", you: 25, average: 28 },
  { month: "May", you: 22, average: 25 },
  { month: "Jun", you: 30, average: 35 }
]

const sustainabilityChartConfig = {
  you: {
    label: "Your Carbon Footprint",
    color: "rgba(16, 185, 129, 0.8)",
  },
  average: {
    label: "Average User",
    color: "rgba(99, 102, 241, 0.8)",
  },
}

// Performance metrics data in Recharts format (multiple bar chart)
const performanceData = [
  { metric: "Clothing", you: 78, average: 45 },
  { metric: "Furniture", you: 85, average: 52 },
  { metric: "Home Goods", you: 65, average: 40 },
  { metric: "Accessories", you: 92, average: 63 },
  { metric: "Personal Care", you: 88, average: 59 },
  { metric: "Stationery", you: 72, average: 48 }
]

const performanceChartConfig = {
  you: {
    label: "Your Eco Score",
    color: "rgba(16, 185, 129, 0.8)",
  },
  average: {
    label: "Average User",
    color: "rgba(99, 102, 241, 0.8)",
  },
}

// Convert monthlySavingsData to direct Recharts format with improved data trend
const monthlySavingsChartData = [
  { month: "Jan", savings: 5, average: 3 },
  { month: "Feb", savings: 12, average: 5 },
  { month: "Mar", savings: 8, average: 6 },
  { month: "Apr", savings: 17, average: 9 },
  { month: "May", savings: 22, average: 12 },
  { month: "Jun", savings: 28, average: 15 }
]

// Chart config for monthly savings
const savingsChartConfig = {
  savings: {
    label: "Your Carbon Savings",
    color: "rgba(16, 185, 129, 0.8)",
  },
  average: {
    label: "Average User",
    color: "rgba(99, 102, 241, 0.8)",
  },
}

// Enhanced data for radar chart
const userComparisonData = {
  labels: ["Recycling", "Energy Saved", "Water Saved", "CO₂ Reduced", "Waste Diverted", "Green Products"],
  datasets: [
    {
      label: "Your Score",
      data: [90, 75, 85, 80, 70, 95],
      fill: true,
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      borderColor: "rgba(16, 185, 129, 1)",
      pointBackgroundColor: "rgba(16, 185, 129, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(16, 185, 129, 1)"
    },
    {
      label: "Average User",
      data: [65, 59, 70, 60, 56, 55],
      fill: true,
      backgroundColor: "rgba(99, 102, 241, 0.2)",
      borderColor: "rgba(99, 102, 241, 1)",
      pointBackgroundColor: "rgba(99, 102, 241, 1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(99, 102, 241, 1)"
    }
  ]
}

const recentOrders = [
  {
    id: "ORD-2023-0001",
    date: "2024-03-15",
    total: 8999,
    items: 3,
    carbonFootprint: 2.5,
    status: "Delivered"
  },
  {
    id: "ORD-2023-0002",
    date: "2024-03-10",
    total: 4999,
    items: 1,
    carbonFootprint: 1.2,
    status: "Delivered"
  },
  {
    id: "ORD-2023-0003",
    date: "2024-02-22",
    total: 6499,
    items: 2,
    carbonFootprint: 1.8,
    status: "Delivered"
  }
]

const achievements = [
  {
    id: 1,
    title: "Eco Warrior",
    description: "Saved 100kg of CO₂",
    icon: Leaf,
    progress: 100,
    completed: true,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Recycling Hero",
    description: "10 recycled purchases",
    icon: Recycle,
    progress: 100,
    completed: true,
    date: "2024-02-10"
  },
  {
    id: 3,
    title: "Green Champion",
    description: "Top 5% of users",
    icon: Star,
    progress: 100,
    completed: true,
    date: "2024-03-05"
  },
  {
    id: 4,
    title: "Global Impact",
    description: "Save 200kg of CO₂",
    icon: Globe,
    progress: 60,
    completed: false
  }
]

// Format price in Indian Rupees
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price)
}

// Chart configs for different charts
const carbonChartConfig = {
  value: {
    label: "Carbon",
  },
  Shopping: {
    label: "Shopping",
    color: "rgba(16, 185, 129, 0.8)",
  },
  Transport: {
    label: "Transport",
    color: "rgba(99, 102, 241, 0.8)",
  },
  Energy: {
    label: "Energy",
    color: "rgba(251, 191, 36, 0.8)",
  },
  Food: {
    label: "Food",
    color: "rgba(239, 68, 68, 0.8)",
  },
  Other: {
    label: "Other",
    color: "rgba(124, 58, 237, 0.8)",
  },
}

const spendingChartConfig = {
  spending: {
    label: "Amount Spent (₹)",
    color: "rgba(16, 185, 129, 0.8)",
  },
}

// Data for radial sustainability progress chart
const sustainabilityRadialData = [
  { 
    name: "Your Carbon Footprint", 
    value: 45.2, 
    target: 60, 
    fill: "rgba(16, 185, 129, 0.8)" 
  },
  { 
    name: "Average User", 
    value: 53.4, 
    target: 60, 
    fill: "rgba(99, 102, 241, 0.8)" 
  }
]

const sustainabilityRadialConfig = {
  "Your Carbon Footprint": {
    label: "Your Carbon Footprint",
    color: "rgba(16, 185, 129, 0.8)",
  },
  "Average User": {
    label: "Average User",
    color: "rgba(99, 102, 241, 0.8)",
  },
}

// Data for interactive product categories carbon footprint pie chart
const carbonSourcesBreakdownData = [
  { category: "Clothing", value: 12.5, fill: "rgba(255, 99, 132, 0.8)" },
  { category: "Furniture", value: 18.7, fill: "rgba(54, 162, 235, 0.8)" },
  { category: "Home Goods", value: 7.3, fill: "rgba(255, 206, 86, 0.8)" },
  { category: "Accessories", value: 4.2, fill: "rgba(75, 192, 192, 0.8)" },
  { category: "Personal Care", value: 1.8, fill: "rgba(153, 102, 255, 0.8)" },
  { category: "Stationery", value: 0.7, fill: "rgba(255, 159, 64, 0.8)" }
]

const sustainabilityPieConfig = {
  clothing: {
    label: "Clothing",
    color: "rgba(255, 99, 132, 0.8)",
  },
  furniture: {
    label: "Furniture",
    color: "rgba(54, 162, 235, 0.8)",
  },
  homegoods: {
    label: "Home Goods",
    color: "rgba(255, 206, 86, 0.8)",
  },
  accessories: {
    label: "Accessories",
    color: "rgba(75, 192, 192, 0.8)",
  },
  personalcare: {
    label: "Personal Care",
    color: "rgba(153, 102, 255, 0.8)",
  },
  stationery: {
    label: "Stationery",
    color: "rgba(255, 159, 64, 0.8)",
  },
}

// Convert performance data to date-based format for area chart
const ecoFriendlyScoresData = [
  { date: "2024-01-01", clothing: 68, furniture: 75, homegoods: 65, accessories: 82, personalcare: 78, stationery: 62, average: 45 },
  { date: "2024-01-08", clothing: 72, furniture: 70, homegoods: 69, accessories: 85, personalcare: 73, stationery: 65, average: 46 },
  { date: "2024-01-15", clothing: 76, furniture: 77, homegoods: 67, accessories: 79, personalcare: 78, stationery: 68, average: 48 },
  { date: "2024-01-22", clothing: 71, furniture: 81, homegoods: 72, accessories: 82, personalcare: 76, stationery: 64, average: 49 },
  { date: "2024-01-29", clothing: 75, furniture: 78, homegoods: 70, accessories: 88, personalcare: 80, stationery: 70, average: 50 },
  { date: "2024-02-05", clothing: 80, furniture: 72, homegoods: 74, accessories: 86, personalcare: 84, stationery: 67, average: 51 },
  { date: "2024-02-12", clothing: 77, furniture: 75, homegoods: 72, accessories: 90, personalcare: 79, stationery: 71, average: 52 },
  { date: "2024-02-19", clothing: 82, furniture: 79, homegoods: 69, accessories: 88, personalcare: 83, stationery: 75, average: 53 },
  { date: "2024-02-26", clothing: 78, furniture: 83, homegoods: 74, accessories: 91, personalcare: 77, stationery: 73, average: 54 },
  { date: "2024-03-04", clothing: 83, furniture: 80, homegoods: 77, accessories: 87, personalcare: 82, stationery: 78, average: 55 },
  { date: "2024-03-11", clothing: 80, furniture: 85, homegoods: 73, accessories: 93, personalcare: 86, stationery: 75, average: 56 },
  { date: "2024-03-18", clothing: 85, furniture: 82, homegoods: 78, accessories: 91, personalcare: 83, stationery: 80, average: 58 },
  { date: "2024-03-25", clothing: 83, furniture: 87, homegoods: 75, accessories: 95, personalcare: 88, stationery: 77, average: 59 },
  { date: "2024-04-01", clothing: 87, furniture: 84, homegoods: 81, accessories: 92, personalcare: 85, stationery: 82, average: 60 },
  { date: "2024-04-08", clothing: 83, furniture: 89, homegoods: 76, accessories: 97, personalcare: 90, stationery: 78, average: 61 },
  { date: "2024-04-15", clothing: 88, furniture: 86, homegoods: 82, accessories: 94, personalcare: 87, stationery: 83, average: 62 },
  { date: "2024-04-22", clothing: 85, furniture: 90, homegoods: 78, accessories: 98, personalcare: 91, stationery: 80, average: 62 },
  { date: "2024-04-29", clothing: 90, furniture: 87, homegoods: 84, accessories: 95, personalcare: 89, stationery: 84, average: 63 },
  { date: "2024-05-06", clothing: 87, furniture: 92, homegoods: 80, accessories: 99, personalcare: 93, stationery: 81, average: 64 },
  { date: "2024-05-13", clothing: 91, furniture: 89, homegoods: 85, accessories: 96, personalcare: 91, stationery: 86, average: 65 },
  { date: "2024-05-20", clothing: 88, furniture: 93, homegoods: 82, accessories: 98, personalcare: 94, stationery: 83, average: 66 },
  { date: "2024-05-27", clothing: 92, furniture: 90, homegoods: 87, accessories: 95, personalcare: 92, stationery: 88, average: 67 },
  { date: "2024-06-03", clothing: 89, furniture: 94, homegoods: 84, accessories: 99, personalcare: 95, stationery: 86, average: 68 },
  { date: "2024-06-10", clothing: 94, furniture: 91, homegoods: 88, accessories: 97, personalcare: 93, stationery: 90, average: 69 },
  { date: "2024-06-17", clothing: 91, furniture: 95, homegoods: 85, accessories: 99, personalcare: 96, stationery: 88, average: 70 },
  { date: "2024-06-24", clothing: 96, furniture: 93, homegoods: 90, accessories: 98, personalcare: 94, stationery: 92, average: 72 }
]

const ecoScoreChartConfig = {
  clothing: {
    label: "Clothing",
    color: "rgba(255, 99, 132, 0.8)",
  },
  furniture: {
    label: "Furniture",
    color: "rgba(54, 162, 235, 0.8)",
  },
  homegoods: {
    label: "Home Goods",
    color: "rgba(255, 206, 86, 0.8)",
  },
  accessories: {
    label: "Accessories",
    color: "rgba(75, 192, 192, 0.8)",
  },
  personalcare: {
    label: "Personal Care",
    color: "rgba(153, 102, 255, 0.8)",
  },
  stationery: {
    label: "Stationery",
    color: "rgba(255, 159, 64, 0.8)",
  },
  average: {
    label: "Average User",
    color: "rgba(99, 102, 241, 0.5)",
  },
}

export default function ProfilePage() {
  const { user } = useAuth()
  
  // Add state for the interactive pie chart
  const [activeCategory, setActiveCategory] = React.useState(
    carbonSourcesBreakdownData[0].category.toLowerCase().replace(' ', '')
  );
  
  const activeCategoryIndex = React.useMemo(
    () => carbonSourcesBreakdownData.findIndex(
      (item) => item.category.toLowerCase().replace(' ', '') === activeCategory
    ),
    [activeCategory]
  );
  
  // Add state for eco scores time range
  const [ecoScoresTimeRange, setEcoScoresTimeRange] = React.useState("180d");
  
  // Filter eco scores data based on selected time range
  const filteredEcoScoresData = React.useMemo(() => {
    return ecoFriendlyScoresData.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date("2024-06-24"); // Last date in the dataset
      let daysToSubtract = 180;
      if (ecoScoresTimeRange === "90d") {
        daysToSubtract = 90;
      } else if (ecoScoresTimeRange === "30d") {
        daysToSubtract = 30;
      } else if (ecoScoresTimeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [ecoScoresTimeRange]);
  
  // Determine join date - if not available, use current month/year
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  }) : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  
  // Use real user data or fallback to mock data for missing fields
  const userDisplayData = {
    name: user?.name || userData.name,
    email: user?.email || userData.email,
    image: user?.image || userData.avatar,
    carbonFootprint: userData.carbonFootprint, // Keep mock data for these fields
    rank: userData.rank,
    totalOrders: userData.totalOrders,
    totalSaved: userData.totalSaved,
    level: userData.level,
    nextLevelProgress: userData.nextLevelProgress,
    memberSince: joinDate
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header with profile summary */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-background">
              <AvatarImage src={userDisplayData.image} alt={userDisplayData.name} />
              <AvatarFallback className="text-xl">{userDisplayData.name ? userDisplayData.name[0].toUpperCase() : 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{userDisplayData.name}</h1>
              <p className="text-muted-foreground">{userDisplayData.email}</p>
              <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  Member since {userDisplayData.memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4" />
                  {userDisplayData.totalOrders} orders
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary">
              <CircleUser className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Link href="/orders">
              <Button variant="outline">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Current Level</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              Level {userDisplayData.level}
              <BadgeCheck className="ml-2 h-5 w-5 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Next Level</span>
                <span className="font-medium">{userDisplayData.nextLevelProgress}%</span>
              </div>
              <Progress value={userDisplayData.nextLevelProgress} />
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Carbon Footprint</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {userDisplayData.carbonFootprint} kg CO₂
              <Leaf className="ml-2 h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span>15% better than average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Community Rank</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              #{userDisplayData.rank}
              <Star className="ml-2 h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 mr-1 text-blue-500" />
              <span>Top 5% of eco-shoppers</span>
            </div>
            <div className="mt-2">
              <Link href="/leaderboard" className="text-sm font-medium text-primary flex items-center hover:underline">
                View Leaderboard <ArrowRightIcon className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all">
          <CardHeader className="pb-2 pt-5">
            <CardDescription>Total Carbon Saved</CardDescription>
            <CardTitle className="text-2xl flex items-center">
              {userDisplayData.totalSaved} kg CO₂
              <Globe className="ml-2 h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="flex items-center text-sm text-muted-foreground">
              <Leaf className="h-4 w-4 mr-1 text-green-500" />
              <span>Equivalent to planting 8 trees</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col py-4">
          <CardHeader className="flex-row items-start space-y-0 pb-0">
            <div className="grid gap-1">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Product Carbon Footprint
            </CardTitle>
              <CardDescription>Carbon impact by product category</CardDescription>
            </div>
            <Select 
              defaultValue={carbonSourcesBreakdownData[0].category.toLowerCase().replace(' ', '')} 
              value={activeCategory}
              onValueChange={setActiveCategory}
            >
              <SelectTrigger
                className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
                aria-label="Select a category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {carbonSourcesBreakdownData.map((item) => {
                  const key = item.category.toLowerCase().replace(' ', '');
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
                            backgroundColor: sustainabilityPieConfig[key]?.color
                          }}
                        />
                        {item.category}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="flex flex-1 justify-center pb-0">
            <ChartContainer
              config={sustainabilityPieConfig}
              className="mx-auto aspect-square w-full max-w-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel formatter={(value) => `${value} kg CO₂`} />}
                />
                <Pie
                  data={carbonSourcesBreakdownData}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                  activeIndex={activeCategoryIndex}
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
                        // Show either the selected category value or the total
                        const selectedValue = carbonSourcesBreakdownData[activeCategoryIndex].value;
                        const totalValue = carbonSourcesBreakdownData.reduce(
                          (sum, item) => sum + item.value, 0
                        );
                        const percentage = ((selectedValue / totalValue) * 100).toFixed(0);
                        
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 10}
                              className="fill-foreground text-2xl font-bold"
                            >
                              {selectedValue.toFixed(1)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 12}
                              className="fill-muted-foreground text-xs"
                            >
                              kg CO₂
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 28}
                              className="fill-primary text-xs font-medium"
                            >
                              {percentage}% of total
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
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              <Leaf className="h-4 w-4 text-green-500" />
              Total: {carbonSourcesBreakdownData.reduce((sum, item) => sum + item.value, 0).toFixed(1)} kg CO₂
            </div>
            <div className="leading-none text-muted-foreground flex items-center">
              <Recycle className="h-4 w-4 mr-1 text-blue-500" />
              Your eco-friendly purchases saved 18.6 kg CO₂
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pt-5">
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
              Category Spending
            </CardTitle>
            <CardDescription>Your spending across different categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-2 pb-5">
            <ChartContainer config={spendingChartConfig}>
              <BarChart 
                accessibilityLayer 
                data={categorySpendingChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.length > 6 ? `${value.slice(0, 6)}...` : value}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent 
                      hideLabel 
                      formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                  }
                />
                <Bar 
                  dataKey="spending" 
                  fill="var(--color-spending)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 flex justify-center py-3">
            <span className="flex items-center text-sm text-muted-foreground">
              <ShoppingBag className="h-4 w-4 mr-1 text-primary" />
              Total spending: {formatPrice(categorySpendingChartData.reduce((acc, curr) => acc + curr.spending, 0))}
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="items-center pb-2 pt-5">
            <CardTitle className="flex items-center">
              <Recycle className="h-5 w-5 mr-2 text-primary" />
              Carbon Sources
            </CardTitle>
            <CardDescription>Distribution of your carbon footprint</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-5">
            <ChartContainer
              config={carbonChartConfig}
              className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent 
                      hideLabel
                      formatter={(value, name) => `${name}: ${value}%`}
                    />
                  }
                />
                <Pie
                  data={carbonSourcesChartData}
                  dataKey="value"
                  nameKey="source"
                  innerRadius={60}
                  strokeWidth={5}
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
                              className="fill-foreground text-2xl font-bold"
                            >
                              {userDisplayData.carbonFootprint}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 20}
                              className="fill-muted-foreground text-xs"
                            >
                              kg CO₂
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
          <CardFooter className="border-t bg-muted/50 flex justify-center py-3">
            <span className="flex items-center text-sm text-muted-foreground">
              <Leaf className="h-4 w-4 mr-1 text-green-500" />
              Shopping is your largest carbon source
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Eco-Friendly Scores
              </CardTitle>
              <CardDescription>Your eco-friendly shopping compared to others</CardDescription>
            </div>
            <Select 
              value={ecoScoresTimeRange} 
              onValueChange={setEcoScoresTimeRange} 
              defaultValue="180d"
            >
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 6 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="180d" className="rounded-lg">
                  Last 6 months
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last month
                </SelectItem>
                <SelectItem value="7d" className="rounded-lg">
                  Last week
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 h-[300px]">
            <ChartContainer config={ecoScoreChartConfig}>
              <AreaChart
                accessibilityLayer
                data={filteredEcoScoresData}
              >
                <defs>
                  {Object.entries(ecoScoreChartConfig).map(([key, config]) => (
                    <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={config.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={config.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>
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
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      formatter={(value) => `${value}%`}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="clothing"
                  type="monotone"
                  fill="url(#fill-clothing)"
                  stroke="var(--color-clothing)"
                  strokeWidth={2}
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="furniture"
                  type="monotone"
                  fill="url(#fill-furniture)"
                  stroke="var(--color-furniture)"
                  strokeWidth={2}
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="homegoods"
                  type="monotone"
                  fill="url(#fill-homegoods)"
                  stroke="var(--color-homegoods)"
                  strokeWidth={2}
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="accessories"
                  type="monotone"
                  fill="url(#fill-accessories)"
                  stroke="var(--color-accessories)"
                  strokeWidth={2}
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="personalcare"
                  type="monotone"
                  fill="url(#fill-personalcare)"
                  stroke="var(--color-personalcare)"
                  strokeWidth={2}
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="stationery"
                  type="monotone"
                  fill="url(#fill-stationery)"
                  stroke="var(--color-stationery)"
                  strokeWidth={2}
                  fillOpacity={0.4}
                />
                <Area
                  dataKey="average"
                  type="monotone"
                  fill="url(#fill-average)"
                  stroke="var(--color-average)"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="border-t bg-muted/50 flex justify-center flex-col py-3">
            <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
              {Object.entries(ecoScoreChartConfig).map(([key, config]) => (
                key !== "average" && (
                  <div key={key} className="flex items-center gap-1">
                    <span 
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-xs">{config.label}</span>
                  </div>
                )
              ))}
              <div className="flex items-center gap-1">
                <span 
                  className="h-3 w-3 border-2 border-dashed"
                  style={{ borderColor: ecoScoreChartConfig.average.color }}
                />
                <span className="text-xs">{ecoScoreChartConfig.average.label}</span>
              </div>
            </div>
            <div className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 font-medium leading-none">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Eco scores improved by 18% over 6 months
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground mt-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Accessories have the highest eco-friendly rating
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Recent Orders</span>
          </TabsTrigger>
          <TabsTrigger value="impact" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Environmental Impact</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader className="pb-2 pt-5">
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                Recent Orders
              </CardTitle>
              <CardDescription>Your purchase history from the last few months</CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col md:flex-row md:items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium flex items-center">
                        {order.id}
                        <Badge variant="outline" className="ml-2">{order.status}</Badge>
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1" />
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                        {order.items} {order.items > 1 ? 'items' : 'item'}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                      <p className="font-medium text-primary">{formatPrice(order.total)}</p>
                      <Badge className="mt-1 flex items-center bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200">
                        <Leaf className="h-3.5 w-3.5 mr-1" />
                        Saved {order.carbonFootprint} kg CO₂
                      </Badge>
                      <Button variant="ghost" size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 flex justify-center py-3">
              <Link href="/orders">
                <Button variant="link">View All Orders</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid gap-6 md:grid-cols-5">
            <Card className="md:col-span-3 group hover:shadow-md transition-all">
              <CardHeader className="pb-3 pt-6">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Monthly Carbon Savings
                </CardTitle>
                <CardDescription>Your environmental impact over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] px-1 sm:px-4">
                <ChartContainer config={savingsChartConfig}>
                  <AreaChart 
                    accessibilityLayer 
                    data={monthlySavingsChartData}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-average)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-average)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="month" 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: 'var(--muted-foreground)' }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: 'var(--muted-foreground)' }}
                      tickFormatter={(value) => `${value} kg`}
                    />
                    <ChartTooltip
                      cursor={{ stroke: 'var(--muted-foreground)', strokeWidth: 1, strokeDasharray: '5 5' }}
                      content={
                        <ChartTooltipContent 
                          formatter={(value) => `${value} kg CO₂`}
                        />
                      }
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="var(--color-savings)" 
                      fillOpacity={0.4}
                      fill="url(#colorSavings)" 
                      strokeWidth={2}
                      activeDot={{ r: 6, stroke: 'var(--color-savings)', strokeWidth: 2, fill: 'var(--background)' }}
                      dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="average" 
                      stroke="var(--color-average)" 
                      fillOpacity={0.2}
                      fill="url(#colorAverage)" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      activeDot={{ r: 6, stroke: 'var(--color-average)', strokeWidth: 2, fill: 'var(--background)' }}
                      dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 flex justify-between py-3 px-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-green-500"></span>
                    <span className="text-sm">Your Savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm border border-dashed border-blue-500"></span>
                    <span className="text-sm">Average User</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                  <span>460% increase since January</span>
                </div>
              </CardFooter>
            </Card>

            <Card className="md:col-span-2 group hover:shadow-md transition-all">
              <CardHeader className="pb-3 pt-6">
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-primary" />
                  Environmental Impact
                </CardTitle>
                <CardDescription>Your positive impact on the planet</CardDescription>
              </CardHeader>
              <CardContent className="py-5 space-y-6">
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Trees Equivalent</h3>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Water Saved</h3>
                      <p className="text-2xl font-bold">1,200L</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                      <Recycle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Waste Diverted</h3>
                      <p className="text-2xl font-bold">45kg</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Energy Saved</h3>
                      <p className="text-2xl font-bold">85kWh</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader className="pb-2 pt-5">
              <CardTitle className="flex items-center">
                <BadgeCheck className="h-5 w-5 mr-2 text-primary" />
                Your Achievements
              </CardTitle>
              <CardDescription>Badges and accomplishments earned through sustainable shopping</CardDescription>
            </CardHeader>
            <CardContent className="py-5">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {achievements.map((achievement) => {
                  const AchievementIcon = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className={`rounded-lg border p-5 text-center hover:shadow-md transition-all ${
                        achievement.completed ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30" : ""
                      }`}
                    >
                      <div className={`mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full ${
                        achievement.completed 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <AchievementIcon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {achievement.description}
                      </p>
                      {!achievement.completed && (
                        <div className="mt-3 space-y-2">
                          <Progress value={achievement.progress} />
                          <p className="text-xs text-muted-foreground">
                            {achievement.progress}% Complete
                          </p>
                        </div>
                      )}
                      {achievement.completed && achievement.date && (
                        <Badge className="mt-3" variant="outline">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 