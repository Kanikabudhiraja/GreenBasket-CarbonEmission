import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 md:py-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden">
                <Image 
                  src="/shopping-bag.png" 
                  alt="Green Basket" 
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <h3 className="text-lg font-medium">About GreenBasket</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              GreenBasket is committed to providing sustainable products 
              that help reduce your environmental footprint.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
              <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:underline">Sustainability Blog</a></li>
              <li><a href="#" className="hover:underline">Our Carbon Commitment</a></li>
              <li><a href="#" className="hover:underline">Partners</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t py-6 md:h-16 md:flex-row md:py-0">
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5 overflow-hidden">
              <Image 
                src="/shopping-bag.png" 
                alt="Green Basket" 
                fill
                className="object-contain"
                sizes="20px"
              />
            </div>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} GreenBasket. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 