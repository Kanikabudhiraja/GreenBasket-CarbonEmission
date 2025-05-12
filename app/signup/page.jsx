"use client"

import { ShoppingBag } from "lucide-react"
import { SignupForm } from "@/components/signup-form"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-0 m-0 max-w-none grid lg:grid-cols-2">
      <div className="flex flex-col p-0">
        <div className="flex-1 flex items-center justify-center p-0">
          <div className="w-full max-w-sm px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Create an Account</h1>
            <SignupForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary hover:underline">
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block p-0">
        <Image
          src="/login.jpg"
          alt="Eco-friendly sustainability concept"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-end p-0">
          <div className="max-w-md text-center p-4 mb-4">
            <h1 className="text-3xl font-bold mb-2 text-white">Shop Sustainably, Live Responsibly</h1>
            <p className="text-white/90 text-balance">
              Join our community of eco-conscious consumers and discover products that are good for you and the planet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 