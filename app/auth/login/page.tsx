"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, signInWithEmail, signInWithGoogle, signInWithFacebook } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signInWithEmail(email, password)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Signed in successfully!")
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error("Failed to sign in with Google")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await signInWithFacebook()
      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error("Failed to sign in with Facebook")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Icons.google className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Chromakit</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          <Card className="border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Sign in to your account</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {/* Social Auth Buttons */}
              <div className="grid gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  type="button"
                  className="w-full h-11 border-2 hover:bg-muted/50 transition-colors"
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.google className="mr-2 h-4 w-4" />
                  )}
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleFacebookSignIn}
                  disabled={isLoading}
                  type="button"
                  className="w-full h-11 border-2 hover:bg-muted/50 transition-colors"
                >
                  {isLoading ? (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Icons.facebook className="mr-2 h-4 w-4" />
                  )}
                  Continue with Facebook
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form onSubmit={handleLogin}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icons.spinner className="mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary underline underline-offset-4 hover:text-primary/80">
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}
