"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, CircleCheck, Leaf, ShoppingCart, Star, CheckCircle, ChevronDown, ChevronUp, Heart, Share2, Truck, RefreshCw, Recycle, Shield, Droplets, Factory, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductImageSlider } from "@/components/product-image-slider"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { toast } from "sonner"
import { fetchCarbonFootprint } from "@/lib/carbon-calculator"

export default function ProductDetailPage({ params }) {
  // Use params object directly without React.use()
  const { id } = params;

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [carbonData, setCarbonData] = useState(null)
  const [expandedSection, setExpandedSection] = useState("description")
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loadingRelated, setLoadingRelated] = useState(true)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Fetch product by ID from the API
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        // Add cache: 'no-store' to make fetch request show up in Network tab
        const response = await fetch(`/api/products/${id}`, {
          cache: 'no-store',
          headers: {
            'x-request-source': 'client-component'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        const data = await response.json()
        setProduct(data)

        // Fetch carbon footprint data
        try {
          const carbonInfo = await fetchCarbonFootprint(data.id)
          setCarbonData(carbonInfo)
        } catch (err) {
          console.error("Error fetching carbon data:", err)
          // Set fallback carbon data
          setCarbonData({
            footprint: data.carbonFootprint,
            conventionalFootprint: data.carbonFootprint * 3,
            savings: {
              savings: (data.carbonFootprint * 2).toFixed(2),
              percentage: "67"
            }
          })
        }

        // Fetch related products
        try {
          const relatedResponse = await fetch(`/api/products/related/${id}`, {
            cache: 'no-store',
            headers: {
              'x-request-source': 'client-component'
            }
          })
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedProducts(relatedData.relatedProducts || [])
          }
        } catch (err) {
          console.error("Error fetching related products:", err)
          setRelatedProducts([])
        } finally {
          setLoadingRelated(false)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        toast.error('Failed to load product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Function to handle adding product to cart
  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      ...product,
      quantity: quantity,
      image: product.images[0] // Use first image for cart thumbnail
    })

    toast.success(`${product.name} added to cart`)
  }

  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  // Handle expandable sections
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Function to format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  // Toggle wishlist status
  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success(`${product.name} removed from wishlist`)
    } else {
      addToWishlist(product)
      toast.success(`${product.name} added to wishlist`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex animate-pulse">
          <div className="w-1/2 h-[500px] bg-muted rounded-lg mr-8"></div>
          <div className="w-1/2 space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-24 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded w-36"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">Sorry, the product you are looking for does not exist.</p>
        <Button asChild>
          <Link href="/products">Browse All Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/products" className="hover:text-primary">Products</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link
          href={`/products?category=${product.category}`}
          className="capitalize hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <ProductImageSlider
            images={product.images}
            productName={product.name}
            showMagnifier={true}
            showThumbnails={true}
            autoRotate={false}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge className="mb-2 capitalize">{product.category}</Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 mr-1 text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-muted-foreground text-sm">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-bold text-primary">{formatPrice(product.price)}</h2>
              {product.inStock ? (
                <Badge variant="outline" className="text-green-600 bg-green-50 hover:bg-green-100 border-green-200">
                  <CircleCheck className="h-3.5 w-3.5 mr-1" />
                  In Stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-600 bg-red-50 hover:bg-red-100 border-red-200">
                  Out of Stock
                </Badge>
              )}
            </div>

            <Badge className="flex items-center w-fit gap-1 mb-6 bg-green-100 hover:bg-green-200 text-green-800 border-green-200">
              <Leaf className="h-3.5 w-3.5 text-green-700" />
              {carbonData?.footprint || product.carbonFootprint} kg CO₂ (
              {carbonData?.savings?.percentage || "67"}% less than conventional)
            </Badge>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-medium mb-2">About this item</h2>
            <p className="text-sm text-muted-foreground">{product.description}</p>

            {/* Key Features */}
            <ul className="mt-3 sm:mt-4 space-y-1">
              {product.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{feature}</span>
                </li>
              ))}
              {product.features.length > 4 && (
                <li className="text-xs sm:text-sm text-muted-foreground pl-6">
                  +{product.features.length - 4} more features
                </li>
              )}
            </ul>
          </div>

          {/* Quantity Selector and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center">
              <span className="mr-4 font-medium">Quantity:</span>
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-8 w-8 rounded-none"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  className="h-8 w-8 rounded-none"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleWishlist}
                  className={`h-10 w-10 sm:h-11 sm:w-11 ${isInWishlist(product.id) ? "text-red-500 hover:text-red-600" : ""}`}
                >
                  <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isInWishlist(product.id) ? "fill-red-500" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-11 sm:w-11"
                >
                  <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Delivery Time: {product.deliveryTime}
            </p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-medium">1 Year Warranty</h3>
                <p className="text-xs text-muted-foreground">Guaranteed quality</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-medium">Free Shipping</h3>
                <p className="text-xs text-muted-foreground">On orders over ₹1,000</p>
              </div>
            </div>
          </div>

          {/* Detailed Tabs */}
          <div className="mt-4 sm:mt-6">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="details" className="text-xs sm:text-sm py-1.5 sm:py-2">Product Details</TabsTrigger>
                <TabsTrigger value="sustainability" className="text-xs sm:text-sm py-1.5 sm:py-2">Sustainability</TabsTrigger>
                <TabsTrigger value="shipping" className="text-xs sm:text-sm py-1.5 sm:py-2">Shipping & Returns</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-3 sm:mt-4">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4 text-sm">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Product Details</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{product.details}</p>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Key Features</h3>
                        <ul className="space-y-2">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Care Instructions</h3>
                        <ul className="list-disc pl-4 text-xs sm:text-sm space-y-1">
                          <li>Handwash or machine wash on gentle cycle</li>
                          <li>Use eco-friendly detergent for best results</li>
                          <li>Hang dry to reduce carbon emissions</li>
                          <li>Avoid using bleach or harsh chemicals</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sustainability" className="mt-3 sm:mt-4">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                          <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mb-2" />
                          <h3 className="font-medium text-center text-sm sm:text-base">Water Savings</h3>
                          <p className="text-center text-xs text-muted-foreground mt-1">83% less water used in production</p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                          <Factory className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500 mb-2" />
                          <h3 className="font-medium text-center text-sm sm:text-base">Ethical Factory</h3>
                          <p className="text-center text-xs text-muted-foreground mt-1">Made in certified ethical facilities</p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-3 border rounded-lg">
                          <Wind className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mb-2" />
                          <h3 className="font-medium text-center text-sm sm:text-base">Carbon Offset</h3>
                          <p className="text-center text-xs text-muted-foreground mt-1">Production offset with renewable energy</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Carbon Footprint</h3>
                        <p className="mb-3">This product has a carbon footprint of <span className="font-medium">{carbonData?.footprint || product.carbonFootprint} kg CO₂</span>, which is {carbonData?.savings?.percentage || "67"}% lower than conventional alternatives.</p>

                        <div className="relative pt-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-xs font-medium inline-block text-green-600">
                                GreenBasket Product
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-medium inline-block text-gray-600">
                                Conventional Product
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div style={{ width: `${100 - parseInt(carbonData?.savings?.percentage || 67)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                          </div>
                          <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                            <div>{carbonData?.footprint || product.carbonFootprint} kg CO₂</div>
                            <div>{(carbonData?.conventionalFootprint).toFixed(2) || (product.carbonFootprint * 3).toFixed(2)} kg CO₂</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Sustainability Certifications</h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          <Badge variant="outline" className="py-1 px-2">Global Organic Textile Standard</Badge>
                          <Badge variant="outline" className="py-1 px-2">Fair Trade Certified</Badge>
                          <Badge variant="outline" className="py-1 px-2">Carbon Trust Standard</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shipping" className="mt-3 sm:mt-4">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Shipping Information</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Free Standard Shipping</span>
                              <p className="text-xs text-muted-foreground mt-0.5">On all orders over ₹1,000 (4-7 business days)</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Express Shipping</span>
                              <p className="text-xs text-muted-foreground mt-0.5">₹250 (2-3 business days)</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Low Carbon Delivery</span>
                              <p className="text-xs text-muted-foreground mt-0.5">We use electric vehicles and carbon-neutral shipping partners where possible</p>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-sm sm:text-base mb-1 sm:mb-2">Returns Policy</h3>
                        <p className="mb-2">We accept returns within 30 days of delivery. Items must be unused and in original packaging.</p>
                        <p className="text-xs text-muted-foreground">Please note that shipping costs for returns are the customer's responsibility unless the item is defective or incorrect.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium">JD</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 5 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Jane Doe</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">Verified Purchase</p>
                  <h3 className="font-medium mb-2">Amazing quality and eco-friendly</h3>
                  <p className="text-sm text-muted-foreground">
                    I'm really impressed with the quality and the fact that it's eco-friendly.
                    The material feels premium and it's exactly as described. Delivery was also faster than expected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="mr-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium">MS</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <div className="flex mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      ))}
                    </div>
                    <span className="text-sm font-medium">Mike Smith</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">Verified Purchase</p>
                  <h3 className="font-medium mb-2">Good product, sustainable packaging</h3>
                  <p className="text-sm text-muted-foreground">
                    The product is good quality and I love the sustainable packaging.
                    It's great to see companies taking environmental impact seriously.
                    Would buy again and recommend to others.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline">Read All {product.reviewCount} Reviews</Button>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden h-full flex flex-col">
                <Link href={`/products/${relatedProduct.id}`} className="relative h-48 overflow-hidden">
                  <Image
                    src={relatedProduct.images[0] || '/product-placeholder.png'}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                  />
                </Link>
                <CardContent className="p-4 flex flex-col flex-grow">
                  <Link href={`/products/${relatedProduct.id}`} className="mb-2 font-medium hover:underline line-clamp-1">
                    {relatedProduct.name}
                  </Link>
                  <div className="flex items-center mb-2">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < relatedProduct.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({relatedProduct.reviewCount})</span>
                  </div>
                  <Badge className="w-fit mb-auto">{formatPrice(relatedProduct.price)}</Badge>
                  <div className="flex mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart({
                          ...relatedProduct,
                          quantity: 1,
                          image: relatedProduct.images[0]
                        });
                        toast.success(`${relatedProduct.name} added to cart`);
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 