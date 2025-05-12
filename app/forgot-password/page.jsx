"use client"

import { ShoppingBag } from "lucide-react"
import { ForgotPasswordForm } from "@/components/forgot-password-form"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-0 m-0 max-w-none grid lg:grid-cols-2">
      <div className="flex flex-col p-0">
        <div className="flex-1 flex items-center justify-center p-0">
          <div className="w-full max-w-sm px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">Reset Your Password</h1>
            <ForgotPasswordForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-primary hover:underline">
                ← Back to login
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
            <h1 className="text-3xl font-bold mb-2 text-white">Reset Your Password</h1>
            <p className="text-white/90 text-balance">
              Don't worry, we'll help you get back to shopping sustainably in no time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 