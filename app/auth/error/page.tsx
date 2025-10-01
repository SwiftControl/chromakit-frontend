import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'access_denied':
        return 'You cancelled the authentication process.'
      case 'unauthorized_client':
        return 'The authentication service is not properly configured.'
      case 'invalid_request':
        return 'The authentication request was invalid.'
      case 'server_error':
        return 'The authentication server encountered an error.'
      default:
        return 'An unexpected error occurred during authentication.'
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
                <AlertCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Chromakit</span>
            </Link>
          </div>

          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <CardTitle className="text-2xl text-red-600 dark:text-red-400">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">
                  {params?.error ? getErrorMessage(params.error) : 'An unexpected error occurred during authentication.'}
                </p>
                {params?.error && (
                  <p className="text-xs text-muted-foreground/70 font-mono bg-muted/50 p-2 rounded">
                    Error Code: {params.error}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="flex-1">
                  <Link href="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Try Again
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Need help? <Link href="/support" className="text-primary hover:underline">Contact Support</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
