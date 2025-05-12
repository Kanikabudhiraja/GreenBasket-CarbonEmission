"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Leaf, Medal, Users, BarChart, ArrowUpRight, ShoppingBag, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

// Mock data for user rankings by carbon footprint
const userRankingsByFootprint = [
  { id: 1, name: "Sarah Johnson", avatar: "/avatars/01.png", footprint: 32.4, rank: 1, badge: "Eco Master", totalSaved: 280.5, level: 8 },
  { id: 2, name: "Alex Chen", avatar: "/avatars/02.png", footprint: 38.7, rank: 2, badge: "Climate Champion", totalSaved: 245.2, level: 7 },
  { id: 3, name: "John Doe", avatar: "/avatars/03.png", footprint: 45.2, rank: 3, badge: "Green Warrior", totalSaved: 220.8, level: 6 },
  { id: 4, name: "Emily Wilson", avatar: "/avatars/04.png", footprint: 48.9, rank: 4, badge: "Sustainability Pro", totalSaved: 210.3, level: 6 },
  { id: 5, name: "Michael Smith", avatar: "/avatars/05.png", footprint: 52.1, rank: 5, badge: "Eco Enthusiast", totalSaved: 195.7, level: 5 },
  { id: 6, name: "Jessica Brown", avatar: "/avatars/06.png", footprint: 55.6, rank: 6, badge: "Green Shopper", totalSaved: 180.2, level: 5 },
  { id: 7, name: "David Lee", avatar: "/avatars/07.png", footprint: 58.3, rank: 7, badge: "Earth Friend", totalSaved: 165.8, level: 4 },
  { id: 8, name: "Sophia Garcia", avatar: "/avatars/08.png", footprint: 62.7, rank: 8, badge: "Eco Conscious", totalSaved: 150.1, level: 4 },
  { id: 9, name: "James Taylor", avatar: "/avatars/09.png", footprint: 68.2, rank: 9, badge: "Green Beginner", totalSaved: 125.5, level: 3 },
  { id: 10, name: "Olivia Martin", avatar: "/avatars/10.png", footprint: 75.4, rank: 10, badge: "Eco Rookie", totalSaved: 110.9, level: 3 }
]

// Mock data for user rankings by eco-friendly purchases
const userRankingsByPurchases = [
  { id: 5, name: "Michael Smith", avatar: "/avatars/05.png", purchases: 32, rank: 1, badge: "Shopping Star", totalSaved: 195.7, level: 5 },
  { id: 1, name: "Sarah Johnson", avatar: "/avatars/01.png", purchases: 28, rank: 2, badge: "Eco Master", totalSaved: 280.5, level: 8 },
  { id: 4, name: "Emily Wilson", avatar: "/avatars/04.png", purchases: 25, rank: 3, badge: "Sustainability Pro", totalSaved: 210.3, level: 6 },
  { id: 2, name: "Alex Chen", avatar: "/avatars/02.png", purchases: 23, rank: 4, badge: "Climate Champion", totalSaved: 245.2, level: 7 },
  { id: 3, name: "John Doe", avatar: "/avatars/03.png", purchases: 21, rank: 5, badge: "Green Warrior", totalSaved: 220.8, level: 6 },
  { id: 8, name: "Sophia Garcia", avatar: "/avatars/08.png", purchases: 18, rank: 6, badge: "Eco Conscious", totalSaved: 150.1, level: 4 },
  { id: 6, name: "Jessica Brown", avatar: "/avatars/06.png", purchases: 16, rank: 7, badge: "Green Shopper", totalSaved: 180.2, level: 5 },
  { id: 7, name: "David Lee", avatar: "/avatars/07.png", purchases: 14, rank: 8, badge: "Earth Friend", totalSaved: 165.8, level: 4 },
  { id: 10, name: "Olivia Martin", avatar: "/avatars/10.png", purchases: 12, rank: 9, badge: "Eco Rookie", totalSaved: 110.9, level: 3 },
  { id: 9, name: "James Taylor", avatar: "/avatars/09.png", purchases: 10, rank: 10, badge: "Green Beginner", totalSaved: 125.5, level: 3 }
]

// Mock data for trending rankings over time
const trendingData = [
  { month: "Jan", rank1: 5, rank2: 2, rank3: 4 },
  { month: "Feb", rank1: 4, rank2: 3, rank3: 5 },
  { month: "Mar", rank1: 3, rank2: 4, rank3: 2 },
  { month: "Apr", rank1: 2, rank2: 5, rank3: 3 },
  { month: "May", rank1: 2, rank2: 3, rank3: 1 },
  { month: "Jun", rank1: 1, rank2: 2, rank3: 3 }
]

// Mock data for carbon savings by user category
const userCategorySavings = [
  { category: "Champions", savings: 280 },
  { category: "Warriors", savings: 210 },
  { category: "Enthusiasts", savings: 160 },
  { category: "Beginners", savings: 90 }
]

// Get the medal component based on rank
const getMedalIcon = (rank) => {
  switch (rank) {
    case 1:
      return <Medal className="h-5 w-5 text-yellow-500" />
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />
    case 3:
      return <Medal className="h-5 w-5 text-amber-700" />
    default:
      return null
  }
}

// Get badge style based on level
const getBadgeStyle = (level) => {
  if (level >= 7) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  if (level >= 5) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  if (level >= 3) return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
  return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = React.useState("footprint")
  
  // Get current user's rank in the appropriate leaderboard
  const getCurrentUserRank = () => {
    const rankings = activeTab === "footprint" ? userRankingsByFootprint : userRankingsByPurchases
    // If user is logged in, try to find them in the rankings
    if (user) {
      const userRank = rankings.findIndex(rankUser => rankUser.name === user.name)
      if (userRank !== -1) {
        return userRank + 1
      }
    }
    // Default fallback
    return 3
  }
  
  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Green Community Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other eco-conscious shoppers</p>
      </div>
      
      {/* Main Tabs */}
      <Tabs defaultValue="footprint" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="footprint" className="gap-2">
              <Leaf className="h-4 w-4" /> 
              <span>Carbon Footprint</span>
            </TabsTrigger>
            <TabsTrigger value="purchases" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Eco Purchases</span>
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Your current rank: #{getCurrentUserRank()}</span>
          </div>
        </div>
        
        {/* Carbon Footprint Tab */}
        <TabsContent value="footprint" className="space-y-8">
          {/* Top Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {userRankingsByFootprint.slice(0, 3).map((user, index) => (
              <Card key={user.id} className={`overflow-hidden border-t-4 ${index === 0 ? 'border-t-yellow-500' : index === 1 ? 'border-t-gray-400' : 'border-t-amber-700'} group hover:shadow-md transition-all`}>
                <CardHeader className="pb-2 pt-6">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="px-2 py-0.5">Rank #{user.rank}</Badge>
                    {getMedalIcon(user.rank)}
                  </div>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-muted">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-muted-foreground text-sm">Level {user.level}</p>
                    </div>
                    <Badge className={`${getBadgeStyle(user.level)} py-1.5 px-3`}>
                      {user.badge}
                    </Badge>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Carbon Footprint</span>
                        <span className="font-medium">{user.footprint} kg CO₂</span>
                      </div>
                      <Progress value={100 - (user.footprint / 100 * 100)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-3 text-xs text-muted-foreground">
                  <div className="flex justify-between w-full">
                    <span>Total Saved: {user.totalSaved} kg CO₂</span>
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      Improving
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Leaderboard Table */}
          <Card className="group hover:shadow-sm transition-all">
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Carbon Footprint Rankings
              </CardTitle>
              <CardDescription>
                Users ranked by smallest carbon footprint impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">User</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Level</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Badge</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Carbon Footprint</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Total Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRankingsByFootprint.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/50">
                        <td className="p-3 font-medium flex items-center">
                          {user.rank}
                          {user.rank <= 3 && (
                            <span className="ml-1">{getMedalIcon(user.rank)}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-muted">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="p-3">Level {user.level}</td>
                        <td className="p-3">
                          <Badge className={`${getBadgeStyle(user.level)}`}>
                            {user.badge}
                          </Badge>
                        </td>
                        <td className="p-3">{user.footprint} kg CO₂</td>
                        <td className="p-3">{user.totalSaved} kg CO₂</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Trend Chart */}
          <Card className="group hover:shadow-sm transition-all">
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Ranking Trends Over Time
              </CardTitle>
              <CardDescription>
                How the top 3 users have ranked over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendingData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                    <YAxis reversed domain={[1, 10]} label={{ value: 'Rank Position', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)' } }} stroke="var(--muted-foreground)" />
                    <Tooltip 
                      formatter={(value) => [`Rank #${value}`, 'Position']} 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} 
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="rank1" name="Sarah Johnson" stroke="#f59e0b" strokeWidth={2} dot={{ r: 5, fill: '#f59e0b' }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="rank2" name="Alex Chen" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="rank3" name="John Doe" stroke="#10b981" strokeWidth={2} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Eco Purchases Tab */}
        <TabsContent value="purchases" className="space-y-8">
          {/* Top Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {userRankingsByPurchases.slice(0, 3).map((user, index) => (
              <Card key={user.id} className={`overflow-hidden border-t-4 ${index === 0 ? 'border-t-yellow-500' : index === 1 ? 'border-t-gray-400' : 'border-t-amber-700'} group hover:shadow-md transition-all`}>
                <CardHeader className="pb-2 pt-6">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="px-2 py-0.5">Rank #{user.rank}</Badge>
                    {getMedalIcon(user.rank)}
                  </div>
                </CardHeader>
                <CardContent className="text-center pb-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-20 w-20 border-2 border-muted">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{user.name}</h3>
                      <p className="text-muted-foreground text-sm">Level {user.level}</p>
                    </div>
                    <Badge className={`${getBadgeStyle(user.level)} py-1.5 px-3`}>
                      {user.badge}
                    </Badge>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Eco Purchases</span>
                        <span className="font-medium">{user.purchases}</span>
                      </div>
                      <Progress value={(user.purchases / 35) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 py-3 text-xs text-muted-foreground">
                  <div className="flex justify-between w-full">
                    <span>Total Saved: {user.totalSaved} kg CO₂</span>
                    <span className="flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      Active Shopper
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Leaderboard Table */}
          <Card className="group hover:shadow-sm transition-all">
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                Eco Purchases Rankings
              </CardTitle>
              <CardDescription>
                Users ranked by number of eco-friendly purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3 text-sm font-medium text-muted-foreground">Rank</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">User</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Level</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Badge</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Purchases</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Total Saved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRankingsByPurchases.map((user) => (
                      <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/50">
                        <td className="p-3 font-medium flex items-center">
                          {user.rank}
                          {user.rank <= 3 && (
                            <span className="ml-1">{getMedalIcon(user.rank)}</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border border-muted">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="p-3">Level {user.level}</td>
                        <td className="p-3">
                          <Badge className={`${getBadgeStyle(user.level)}`}>
                            {user.badge}
                          </Badge>
                        </td>
                        <td className="p-3">{user.purchases}</td>
                        <td className="p-3">{user.totalSaved} kg CO₂</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Bar Chart */}
          <Card className="group hover:shadow-sm transition-all">
            <CardHeader className="pb-3 pt-6">
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-primary" />
                Carbon Savings by User Category
              </CardTitle>
              <CardDescription>
                Total carbon saved by user category
              </CardDescription>
            </CardHeader>
            <CardContent className="px-1 sm:px-4">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={userCategorySavings} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="category" stroke="var(--muted-foreground)" />
                    <YAxis label={{ value: 'kg CO₂ Saved', angle: -90, position: 'insideLeft', style: { fill: 'var(--muted-foreground)' } }} stroke="var(--muted-foreground)" />
                    <Tooltip 
                      formatter={(value) => [`${value} kg CO₂`, 'Carbon Saved']} 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} 
                      labelStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="savings" name="Carbon Savings" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 