"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's an error in the URL params
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (error) {
          console.error('OAuth Error:', error, errorDescription)
          setErrorMessage(errorDescription || error)
          setStatus('error')
          return
        }

        // Get the authorization code from URL
        const code = searchParams.get('code')
        
        if (code) {
          // Exchange the code for a session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError)
            setErrorMessage(exchangeError.message)
            setStatus('error')
            return
          }

          if (data.session) {
            setStatus('success')
            toast.success('Successfully signed in!')
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push('/dashboard')
            }, 2000)
            return
          }
        }

        // Fallback: try to get existing session
        const { data, error: supabaseError } = await supabase.auth.getSession()
        
        if (supabaseError) {
          console.error('Supabase Auth Error:', supabaseError)
          setErrorMessage(supabaseError.message)
          setStatus('error')
          return
        }

        if (data.session) {
          setStatus('success')
          toast.success('Successfully signed in!')
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          // No session found, might be a confirmation email callback
          const type = searchParams.get('type')
          if (type === 'signup') {
            setStatus('success')
            toast.success('Account confirmed! You can now sign in.')
            setTimeout(() => {
              router.push('/auth/login')
            }, 3000)
          } else {
            setErrorMessage('No active session found. Please try signing in again.')
            setStatus('error')
          }
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        setErrorMessage('An unexpected error occurred')
        setStatus('error')
      }
    }

    handleAuthCallback()
  }, [router, searchParams, supabase.auth])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <CardTitle className="text-2xl">Processing...</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                Completing your sign-in process. Please wait...
              </p>
            </CardContent>
          </Card>
        )

      case 'success':
        return (
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">Success!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You have been successfully signed in. Redirecting to your dashboard...
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 'error':
        return (
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">Authentication Failed</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                {errorMessage || 'An error occurred during the authentication process.'}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link href="/auth/login">Try Again</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}