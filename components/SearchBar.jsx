"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Search, X, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Leaf } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"

export function SearchBar({ onClose, variant = "default" }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const debouncedQuery = useDebounce(query, 300)
  
  // Hide results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  
  // Auto-focus the input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])
  
  // Fetch results when query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([])
        return
      }
      
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`)
        const data = await response.json()
        
        if (response.ok) {
          setResults(data.products)
          setShowResults(true)
        }
      } catch (error) {
        console.error("Error searching products:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchResults()
  }, [debouncedQuery])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setShowResults(false)
      if (onClose) onClose()
    }
  }
  
  const handleResultClick = () => {
    setShowResults(false)
    if (onClose) onClose()
  }
  
  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }
  
  const isCompact = variant === "compact"
  
  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search for eco-friendly products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${isCompact ? 'h-9' : 'h-10'} pl-9 pr-3 rounded-l-full rounded-r-none border-r-0`}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button
          type="submit"
          className={`${isCompact ? 'h-9' : 'h-10'} rounded-l-none rounded-r-full px-4`}
        >
          Search
        </Button>
      </form>
      
      {/* Search Results */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[400px] overflow-y-auto rounded-lg border bg-background shadow-lg">
          <div className="p-2 space-y-1">
            {results.map(product => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex items-center p-2 hover:bg-accent rounded-md transition-colors"
                onClick={handleResultClick}
              >
                <div className="relative h-14 w-14 rounded overflow-hidden bg-muted mr-3 flex-shrink-0">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-bold text-primary">{formatPrice(product.price)}</p>
                    <Badge variant="secondary" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1 text-green-500" />
                      {product.carbonFootprint} kg CO₂
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-muted-foreground" />
              </Link>
            ))}
          </div>
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-muted-foreground"
              onClick={handleSubmit}
            >
              See all results ({results.length}+)
            </Button>
          </div>
        </div>
      )}
      
      {/* No results state */}
      {showResults && query.trim().length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 p-4 rounded-lg border bg-background shadow-lg text-center">
          <p className="text-muted-foreground">No products found for "{query}"</p>
          <Button variant="link" className="mt-1 text-primary" onClick={handleSubmit}>
            View all products
          </Button>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 p-4 rounded-lg border bg-background shadow-lg flex justify-center">
          <div className="h-5 w-5 border-2 border-b-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
} 