import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProductSkeleton({ displayMode = "grid" }) {
  return (
    <Card className={`overflow-hidden ${
      displayMode === 'list' ? 'flex flex-col sm:flex-row' : ''
    }`}>
      <div className={`relative ${
        displayMode === 'list' 
          ? 'h-56 sm:h-auto sm:w-1/3 sm:min-h-[180px]' 
          : 'aspect-square'
      } bg-accent/30 w-full overflow-hidden`}>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        <Skeleton className="h-full w-full border-0" />
      </div>
      
      <CardContent className={`p-4 flex flex-col ${
        displayMode === 'list' ? 'sm:flex-1' : ''
      }`}>
        <div className="relative overflow-hidden">
          <Skeleton className="h-6 w-3/4 mb-2 border-0" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-100" />
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="relative overflow-hidden">
            <Skeleton className="h-6 w-1/4 border-0" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-200" />
          </div>
          <div className="relative overflow-hidden">
            <Skeleton className="h-4 w-16 border-0" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-300" />
          </div>
        </div>
        
        <div className="relative overflow-hidden">
          <Skeleton className="h-4 w-full mb-2 border-0" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-400" />
        </div>
        
        <div className="relative overflow-hidden">
          <Skeleton className="h-4 w-4/5 mb-4 border-0" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-500" />
        </div>
        
        <div className="mt-auto relative overflow-hidden">
          <Skeleton className="h-10 w-full border-0" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-600" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} displayMode="grid" />
      ))}
    </>
  )
}

export function ProductSkeletonList({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ProductSkeleton key={index} displayMode="list" />
      ))}
    </>
  )
} 