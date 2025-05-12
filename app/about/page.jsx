import { Leaf, Recycle, BarChart3, Shield, Heart, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "About Us | GreenBasket",
  description: "Learn about our mission to provide sustainable, eco-friendly products while reducing carbon footprint.",
}

export default function AboutPage() {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 z-0 bg-primary/5">
          {/* Placeholder for hero image */}
        </div>
        <div className="relative z-10 px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground">
            At GreenBasket, we believe shopping can be both sustainable and stylish. 
            We're on a mission to reduce our environmental impact while offering high-quality, 
            eco-friendly products for conscious consumers.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-lg">
            <p>
              GreenBasket started with a simple idea: shopping shouldn't cost the Earth. Founded in 2025 by a team of environmental enthusiasts, we set out to create an online marketplace where sustainability comes first.
            </p>
            <p>
              We carefully select each product based on its environmental impact, ensuring everything we offer aligns with our core values of sustainability, quality, and transparency.
            </p>
            <p>
              Today, we're proud to offer a wide range of eco-friendly alternatives to everyday products, helping thousands of customers reduce their carbon footprint without compromising on quality or style.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] rounded-xl overflow-hidden bg-muted flex items-center justify-center">
          <Leaf className="h-24 w-24 text-primary/20" />
          {/* Placeholder for story image */}
        </div>
      </section>

      {/* Our Values */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-muted-foreground">
                We prioritize products made from sustainable materials that minimize environmental impact and reduce waste.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Recycle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Circular Economy</h3>
              <p className="text-muted-foreground">
                We support products designed with end-of-life in mind, promoting recycling, upcycling, and biodegradability.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                We provide clear information about each product's environmental impact and carbon footprint.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We believe sustainable products should be durable, well-designed, and built to last.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground">
                We support and collaborate with like-minded businesses and organizations working toward a more sustainable future.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 pb-4">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Future Focus</h3>
              <p className="text-muted-foreground">
                We're committed to continuous improvement and innovation in sustainable retail practices.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="bg-accent rounded-xl py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
        <p className="text-lg max-w-3xl mx-auto mb-8">
          By choosing GreenBasket, you're not just shopping – you're making a statement about the future you want to see. Every purchase contributes to building a more sustainable world.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/products">
            <Button size="lg" className="rounded-full">Shop Now</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="rounded-full">Contact Us</Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 