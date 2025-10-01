import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail, ArrowRight, Home } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Chromakit</span>
            </Link>
          </div>

          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">Check your email</CardTitle>
              <CardDescription className="text-base">We&apos;ve sent you a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  We've sent a confirmation email to your inbox. Please click the link in the email to verify your account and complete your registration.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">What's next?</strong>
                    <br />
                    1. Check your email inbox (and spam folder)
                    <br />
                    2. Click the confirmation link
                    <br />
                    3. Sign in to start editing images
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button asChild>
                  <Link href="/auth/login">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Go to Sign In
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Didn't receive an email? <Link href="/auth/resend" className="text-primary hover:underline">Resend confirmation</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
