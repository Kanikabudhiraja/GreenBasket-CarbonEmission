"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProductImageSlider({
  images, 
  productName = "Product", 
  autoRotate = true, 
  interval = 5000,
  showMagnifier = false,
  smallButtons = false,
  showThumbnails = false
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef(null)
  const zoomFactor = 2.5 // How much to zoom the image by
  
  // Auto rotate images
  useEffect(() => {
    if (!autoRotate || isHovered) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, autoRotate, interval, isHovered])
  
  const goToPrevious = (e) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = (e) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    
    setMousePosition({ x, y })
  }
  
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    )
  }
  
  return (
    <div className="relative space-y-2">
      <div 
        className="relative aspect-square w-[80%] mx-auto overflow-hidden rounded-lg bg-gray-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        ref={imageContainerRef}
      >
        <div 
          className={cn(
            "transition-all duration-500 ease-out flex h-full w-full", 
            showMagnifier && isHovered ? "cursor-zoom-in" : "cursor-pointer"
          )}
          style={{ 
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => (
            <div key={index} className="h-full w-full flex-shrink-0">
              <div className="relative h-full w-full">
                <Image
                  src={src}
                  alt={`${productName} image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 768px) 60vw, 40vw"
                  className="object-contain transition-transform duration-300"
                  priority={index === 0}
                  quality={85}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Only show navigation buttons if there are multiple images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size={smallButtons ? "sm" : "icon"}
              className={cn(
                "absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-background/80 opacity-80 hover:opacity-100 transition-opacity z-20",
                smallButtons ? "w-7 h-7 p-0" : "p-2"
              )}
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className={smallButtons ? "h-4 w-4" : "h-6 w-6"} />
            </Button>
            
            <Button
              variant="ghost"
              size={smallButtons ? "sm" : "icon"}
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-background/80 opacity-80 hover:opacity-100 transition-opacity z-20",
                smallButtons ? "w-7 h-7 p-0" : "p-2"
              )}
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className={smallButtons ? "h-4 w-4" : "h-6 w-6"} />
            </Button>
            
            {/* Dots indicator - only show if thumbnails are hidden */}
            {!showThumbnails && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-primary w-5" : "bg-primary/50 w-1.5"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Thumbnails row - Amazon style */}
      {showThumbnails && images.length > 1 && (
        <div className="flex justify-center gap-2 px-2 overflow-x-auto w-[80%] mx-auto">
          {images.map((src, index) => (
            <button
              key={index}
              className={cn(
                "flex-shrink-0 relative h-16 w-16 rounded-md overflow-hidden transition-all duration-200",
                index === currentIndex 
                  ? "ring-2 ring-primary ring-offset-2" 
                  : "opacity-70 hover:opacity-100 hover:ring-1 hover:ring-primary/50"
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Amazon-style Magnification Popup - Only on product detail pages */}
      {showMagnifier && isHovered && (
        <div 
          className="fixed top-1/4 right-8 h-[60vh] w-[40vw] max-w-xl rounded-lg shadow-2xl border border-border overflow-hidden hidden lg:block z-[9999]"
          style={{ pointerEvents: "none" }}
        >
          <div className="relative h-full w-full bg-gray-50">
            <Image
              src={images[currentIndex]}
              alt={`${productName} enlarged view`}
              fill
              sizes="40vw"
              className="object-contain"
              style={{
                transform: `scale(${zoomFactor})`,
                transformOrigin: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
              }}
              quality={90}
            />
          </div>
        </div>
      )}
    </div>
  )
} 