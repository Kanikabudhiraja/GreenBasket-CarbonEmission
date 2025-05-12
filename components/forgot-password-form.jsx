"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export function ForgotPasswordForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Mock password reset request
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubmitted(true)
      toast.success("Password reset link sent to your email!")
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form 
      className={cn("space-y-6", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we'll send you a link to reset your password
        </p>
      </div>
      
      {!isSubmitted ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="hello@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
          
          <div className="text-center text-sm">
            Remember your password?{" "}
            <Link 
              href="/login" 
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>
              If an account exists with the email <span className="font-medium text-foreground">{email}</span>, 
              we've sent a link to reset your password.
            </p>
          </div>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Return to login
          </Button>
        </div>
      )}
    </form>
  )
} 