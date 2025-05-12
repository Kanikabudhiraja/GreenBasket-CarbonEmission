"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TestImagesPage() {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch products from API when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/products?limit=50')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        // Extract all images from products
        let allImages = []
        if (data.products && Array.isArray(data.products)) {
          data.products.forEach(product => {
            if (product.images && Array.isArray(product.images)) {
              product.images.forEach(image => {
                allImages.push({
                  src: image,
                  productName: product.name
                })
              })
            }
          })
        }
        
        setImages(allImages)
        if (allImages.length > 0) {
          setSelectedImage(allImages[0])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load images. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  // Filter images based on search query
  const filteredImages = images.filter(image => 
    image.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    image.src.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading images...</div>
  }
  
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Product Images Test Page</h1>
      
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Selected Image Display */}
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Selected Image</h2>
          {selectedImage ? (
            <div>
              <div className="relative aspect-square w-full mb-4 bg-white rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.productName}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">Product: {selectedImage.productName}</h3>
                <p className="text-sm text-muted-foreground break-all mt-2">Path: {selectedImage.src}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No image selected
            </div>
          )}
        </div>
        
        {/* Image Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">All Images ({filteredImages.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <Button
                key={index}
                variant="outline"
                className={`p-0 h-auto aspect-square relative overflow-hidden ${
                  selectedImage?.src === image.src ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image.src}
                  alt={image.productName}
                  fill
                  className="object-cover"
                />
              </Button>
            ))}
            
            {filteredImages.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No images match your search
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 