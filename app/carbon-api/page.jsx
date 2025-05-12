"use client"

import { useState, useEffect } from "react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, BarChart3, TrendingUp, Globe, ArrowDownToLine, Recycle, Info, AlertTriangle } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
  Label
} from "recharts"
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Endpoint for the carbon API
const CARBON_API_ENDPOINT = "/api/carbon/live"

// Define the chart config for our charts
const chartConfig = {
  intensity: {
    label: "Carbon Intensity",
  },
  percentage: {
    label: "Percentage",
  },
  Wind: {
    label: "Wind",
    color: "hsl(var(--chart-1))", // Using theme colors
  },
  Solar: {
    label: "Solar",
    color: "hsl(var(--chart-2))",
  },
  Hydro: {
    label: "Hydro",
    color: "hsl(var(--chart-3))",
  },
  Nuclear: {
    label: "Nuclear",
    color: "hsl(var(--chart-4))",
  },
  Gas: {
    label: "Gas",
    color: "hsl(var(--chart-5))",
  },
  Coal: {
    label: "Coal",
    color: "#F94144",
  },
  Biomass: {
    label: "Biomass",
    color: "#577590",
  },
  Other: {
    label: "Other",
    color: "#9D8189",
  }
};

export default function CarbonApiPage() {
  const [carbonData, setCarbonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshTime, setRefreshTime] = useState(null)
  
  // Function to fetch carbon data
  const fetchCarbonData = async () => {
    setLoading(true)
    try {
      const response = await fetch(CARBON_API_ENDPOINT, {
        cache: 'no-store',
        headers: {
          'x-request-source': 'carbon-api-page'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch carbon data')
      }
      
      const data = await response.json()
      setCarbonData(data)
      setRefreshTime(new Date().toLocaleTimeString())
      setError(null)
    } catch (err) {
      console.error("Error fetching carbon data:", err)
      setError("Failed to load live carbon data. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch data on initial load
  useEffect(() => {
    fetchCarbonData()
    
    // Set up periodic refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      fetchCarbonData()
    }, 5 * 60 * 1000)
    
    return () => clearInterval(refreshInterval)
  }, [])
  
  // Format carbon emissions value
  const formatCarbonValue = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} tonnes CO₂`
    }
    return `${value.toFixed(2)} kg CO₂`
  }
  
  // Calculate trees equivalent (25kg CO2 per tree per year)
  const calculateTreeEquivalent = (carbonValue) => {
    return Math.ceil(carbonValue / 25)
  }
  
  // Generate color based on carbon intensity
  const getCarbonIntensityColor = (intensity) => {
    if (intensity < 100) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (intensity < 200) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    if (intensity < 300) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Live Carbon Data API</h1>
        <p className="text-muted-foreground">Real-time carbon emission metrics and sustainability analytics</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          {refreshTime && (
            <span className="text-sm text-muted-foreground">
              Last updated: <span className="font-medium">{refreshTime}</span>
            </span>
          )}
        </div>
        <Button 
          onClick={fetchCarbonData} 
          disabled={loading} 
          className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          <ArrowDownToLine className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>
      
      {error && (
        <Card className="bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/30">
          <CardContent className="py-6 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Main data grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border border-muted/60 dark:border-muted/20 transition-all duration-200 h-full">
                <CardHeader className="pb-2 space-y-2 pt-4">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-7 w-[180px]" />
                </CardHeader>
                <CardContent className="flex-1 pt-4 pb-6 px-5">
                  <Skeleton className="h-[280px] w-full" />
                </CardContent>
                <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4">
                  <Skeleton className="h-4 w-[140px]" />
                </CardFooter>
              </Card>
            ))}
          </>
        ) : carbonData ? (
          // Actual data cards
          <>
            {/* Current Carbon Intensity - Updated with colorful donut chart */}
            <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border-l-4 border-l-green-500 dark:border-l-green-600 border-t border-r border-b border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="items-center pb-0 pt-4">
                <CardTitle>Current Carbon Intensity</CardTitle>
                <CardDescription>
                  <Badge className={`mt-1 ${getCarbonIntensityColor(carbonData.currentIntensity.value)}`}>
                    {carbonData.currentIntensity.level}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="w-full h-[280px]">
                  <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                  >
                    <PieChart width={300} height={280}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={[
                          { name: "Wind", value: 25, fill: "#22c55e" }, // Bright green
                          { name: "Solar", value: 15, fill: "#eab308" }, // Yellow
                          { name: "Hydro", value: 10, fill: "#0ea5e9" }, // Blue
                          { name: "Nuclear", value: 20, fill: "#8b5cf6" }, // Purple
                          { name: "Fossil", value: 30, fill: "#ef4444" }, // Red
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        strokeWidth={3}
                        paddingAngle={2}
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
                                    y={viewBox.cy - 8}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    {carbonData.currentIntensity.value}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 20}
                                    className="fill-muted-foreground text-base"
                                  >
                                    gCO₂/kWh
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4 flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {carbonData.currentIntensity.forecast} <TrendingUp className="h-4 w-4 ml-1" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Based on real-time grid carbon intensity data
                </div>
              </CardFooter>
            </Card>
            
            {/* Carbon by Energy Source - Updated with new component */}
            <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border-l-4 border-l-blue-500 dark:border-l-blue-600 border-t border-r border-b border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="items-center pb-0 px-5 pt-5">
                <CardTitle>Energy Mix</CardTitle>
                <CardDescription>Carbon by Energy Source</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pt-4 pb-0 px-5">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[200px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
                >
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie 
                      data={carbonData.energyMix.map(item => ({
                        name: item.source,
                        value: item.percentage,
                        fill: item.color
                      }))} 
                      dataKey="value" 
                      nameKey="name"
                      label={{
                        fill: 'var(--foreground)',
                        fontSize: 11
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4 flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  {carbonData.renewablePercentage}% from renewable sources <Leaf className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Wind, Solar, and Hydro combined
                </div>
              </CardFooter>
            </Card>
            
            {/* Regional Carbon Intensity - Updated with full height and proper spacing */}
            <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border-l-4 border-l-purple-500 dark:border-l-purple-600 border-t border-r border-b border-muted/60 dark:border-muted/20 transition-all duration-200 h-full">
              <CardHeader className="items-center pb-0 pt-4">
                <CardTitle>Regional Analysis</CardTitle>
                <CardDescription>Regional Carbon Intensity</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carbonData.regionalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                      <XAxis 
                        dataKey="region" 
                        tickFormatter={(region) => region.substring(0, 3)}
                        stroke="var(--chart-text)"
                        fontSize={11}
                        tickMargin={8}
                      />
                      <YAxis 
                        stroke="var(--chart-text)" 
                        fontSize={11}
                        tickMargin={8}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value} gCO₂/kWh`, "Carbon Intensity"]}
                        contentStyle={{
                          backgroundColor: 'var(--tooltip-bg)',
                          borderColor: 'var(--tooltip-border)',
                          color: 'var(--tooltip-text)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      <Bar 
                        dataKey="intensity" 
                        fill="var(--chart-purple)" 
                        radius={[4, 4, 0, 0]} 
                        animationDuration={1500}
                      >
                        {carbonData.regionalData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index % 2 === 0 ? "#8b5cf6" : "#a78bfa"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4 flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  <span className="flex-1">Highest: {carbonData.regionalData.reduce((max, item) => Math.max(max, item.intensity), 0)} gCO₂/kWh</span>
                  <Globe className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Regional variations based on local energy sources
                </div>
              </CardFooter>
            </Card>
            
            {/* Emissions Saved */}
            <Card className="overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border-l-4 border-l-green-500 dark:border-l-green-600 border-t border-r border-b border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="pb-2 space-y-1 px-5 pt-5">
                <CardDescription>Emissions Saved</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  {formatCarbonValue(carbonData.emissionsSaved)}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-5">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={carbonData.savingsHistory} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                      stroke="var(--chart-text)"
                      fontSize={11}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="var(--chart-text)" 
                      fontSize={11}
                      tickMargin={8}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCarbonValue(value), "Emissions Saved"]}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="var(--chart-green)" 
                      strokeWidth={2}
                      dot={{ stroke: 'var(--chart-green)', strokeWidth: 2, r: 4, fill: 'var(--background)' }}
                      activeDot={{ stroke: 'var(--chart-green)', strokeWidth: 2, r: 6, fill: 'var(--background)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Recycle className="h-3.5 w-3.5 mr-1" />
                  Equivalent to planting {calculateTreeEquivalent(carbonData.emissionsSaved)} trees
                </span>
              </CardFooter>
            </Card>
            
            {/* Carbon Footprint Reduction */}
            <Card className="overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border-l-4 border-l-indigo-500 dark:border-l-indigo-600 border-t border-r border-b border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="pb-2 space-y-1 px-5 pt-5">
                <CardDescription>Carbon Footprint Reduction</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  {carbonData.footprintReduction}% Reduction
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-5">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={carbonData.reductionTrend} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                      <linearGradient id="colorReduction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-indigo)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--chart-indigo)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => new Date(date).toLocaleDateString([], {month: 'short'})}
                      stroke="var(--chart-text)"
                      fontSize={11}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="var(--chart-text)" 
                      fontSize={11}
                      tickMargin={8}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, "Reduction"]}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="var(--chart-indigo)" 
                      fillOpacity={1} 
                      fill="url(#colorReduction)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4">
                <span className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                  Trending up by {carbonData.reductionTrendChange}% from last month
                </span>
              </CardFooter>
            </Card>
            
            {/* Carbon Intensity Forecast */}
            <Card className="overflow-hidden shadow-md hover:shadow-lg dark:shadow-primary/5 border-l-4 border-l-blue-500 dark:border-l-blue-600 border-t border-r border-b border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="pb-2 space-y-1 px-5 pt-5">
                <CardDescription>Carbon Intensity Forecast</CardDescription>
                <CardTitle className="text-2xl flex items-center">
                  24-Hour Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-5">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={carbonData.intensityForecast} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(time) => new Date(time).toLocaleTimeString([], {hour: '2-digit'})}
                      stroke="var(--chart-text)"
                      fontSize={11}
                      tickMargin={8}
                    />
                    <YAxis 
                      stroke="var(--chart-text)" 
                      fontSize={11}
                      tickMargin={8}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} gCO₂/kWh`, "Forecasted Intensity"]}
                      labelFormatter={(time) => new Date(time).toLocaleString()}
                      contentStyle={{
                        backgroundColor: 'var(--tooltip-bg)',
                        borderColor: 'var(--tooltip-border)',
                        color: 'var(--tooltip-text)',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="intensity" 
                      stroke="var(--chart-blue)" 
                      strokeWidth={2}
                      dot={{ stroke: 'var(--chart-blue)', strokeWidth: 2, r: 4, fill: 'var(--background)' }}
                      activeDot={{ stroke: 'var(--chart-blue)', strokeWidth: 2, r: 6, fill: 'var(--background)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="border-t bg-muted/30 dark:bg-muted/10 p-4">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Leaf className="h-3.5 w-3.5 mr-1" />
                  Best time for low-carbon activities: {carbonData.lowestIntensityTime}
                </span>
              </CardFooter>
            </Card>
          </>
        ) : null}
      </div>
      
      {/* Additional data and insights */}
      <Tabs defaultValue="insights" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights">Carbon Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="about">About the API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights" className="mt-6 space-y-4">
          <Card className="shadow-md dark:shadow-primary/5 border border-muted/60 dark:border-muted/20 transition-all duration-200">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Understanding Carbon Intensity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 px-6 pb-6">
              <p>Carbon intensity is a measure of how much CO₂ emissions are produced per kilowatt hour of electricity consumed. It varies throughout the day based on:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The types of energy sources being used (renewable vs. fossil fuels)</li>
                <li>Overall electricity demand</li>
                <li>Weather conditions affecting renewable generation</li>
                <li>Time of day and seasonal factors</li>
              </ul>
              <p className="text-sm text-muted-foreground">Lower intensity values mean cleaner electricity with fewer emissions.</p>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="shadow-md dark:shadow-primary/5 border border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="px-6 pt-6">
                <CardTitle>Regional Variations</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-6 pb-6">
                <p>Carbon intensity varies by region based on the local energy mix. Areas with more renewable infrastructure typically have lower carbon intensity values, while regions relying on coal or gas show higher values.</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md dark:shadow-primary/5 border border-muted/60 dark:border-muted/20 transition-all duration-200">
              <CardHeader className="px-6 pt-6">
                <CardTitle>Emission Calculations</CardTitle>
              </CardHeader>
              <CardContent className="pt-2 px-6 pb-6">
                <p>The carbon emissions data is calculated using standardized conversion factors for different energy sources, taking into account the full lifecycle emissions from generation to consumption.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-6 space-y-4">
          <Card className="shadow-md dark:shadow-primary/5 border border-muted/60 dark:border-muted/20 transition-all duration-200">
            <CardHeader className="px-6 pt-6">
              <CardTitle>Optimizing for Low Carbon Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 px-6 pb-6">
              <p>Based on the current carbon intensity data, here are some recommendations:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Use energy-intensive appliances during low-intensity periods</li>
                <li>Charge electric vehicles and devices when renewable generation is high</li>
                <li>Consider solar or other renewable installations for your home</li>
                <li>Support products and services that use renewable energy in their operations</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="about" className="mt-6 space-y-4">
          <Card className="shadow-md dark:shadow-primary/5 border border-muted/60 dark:border-muted/20 transition-all duration-200">
            <CardHeader className="px-6 pt-6">
              <CardTitle>About the Carbon Data API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 px-6 pb-6">
              <p>This page displays real-time carbon emission data sourced from external APIs that track electricity generation and associated carbon emissions. The data is refreshed every 5 minutes to provide the most up-to-date information.</p>
              <p>The API integration allows us to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Monitor current carbon intensity in the power grid</li>
                <li>Track the energy mix including renewable percentages</li>
                <li>View historical trends and forecasts</li>
                <li>Calculate emission savings</li>
              </ul>
              <div className="flex items-start gap-2 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-900/30">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Data Sources</p>
                  <p className="text-sm text-blue-600 dark:text-blue-500">Carbon Intensity API (UK) and National Grid ESO data are used to provide real-time carbon intensity metrics with fallback to calculated estimates when API data is unavailable.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 