import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function HomeFeaturedProductSkeleton() {
  return (
    <Card className="overflow-hidden transition-all duration-200">
      <div className="relative aspect-square w-full overflow-hidden bg-accent/30">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        <Skeleton className="h-full w-full border-0" />
      </div>
      
      <CardContent className="p-4 flex flex-col">
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
        
        <div className="mt-2 flex flex-col gap-2">
          <div className="relative overflow-hidden w-16">
            <Skeleton className="h-5 w-16 border-0" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-500" />
          </div>
          
          <div className="mt-auto relative overflow-hidden">
            <Skeleton className="h-10 w-full border-0" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function HomeFeaturedProductsSkeletonGrid() {
  return (
    <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <HomeFeaturedProductSkeleton key={index} />
      ))}
    </div>
  )
}

export function HomeCategoryCardSkeleton() {
  return (
    <div className="group flex flex-col items-center p-3 rounded-lg">
      <div className="relative mb-3 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 overflow-hidden rounded-full">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        <Skeleton className="h-full w-full rounded-full border-0" />
      </div>
      
      <div className="relative overflow-hidden w-24 sm:w-28">
        <Skeleton className="h-5 w-full mx-auto border-0" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-100" />
      </div>
      
      <div className="mt-1 w-full relative overflow-hidden">
        <Skeleton className="h-3 w-full mx-auto border-0" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite] delay-200" />
      </div>
    </div>
  )
}

export function HomeCategoriesSkeletonGrid() {
  return (
    <div className="mt-8 grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <HomeCategoryCardSkeleton key={index} />
      ))}
    </div>
  )
} 