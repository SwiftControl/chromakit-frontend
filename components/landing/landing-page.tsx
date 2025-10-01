import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Zap, Shield, ImageIcon, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              ✨ Professional Image Processing Made Simple
            </div>
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Transform, enhance, and perfect your images with{" "}
            <span className="bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">
              advanced AI-powered tools
            </span>
          </h1>
          
          <p className="mt-6 text-pretty text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Professional-grade image editing in your browser. Adjust brightness, apply filters, 
            manipulate channels, and create stunning visuals with real-time processing.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/sign-up">
              <Button size="lg" className="w-full sm:w-auto group">
                Start Editing Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-16 text-sm text-muted-foreground">
            No credit card required • Free to start • Professional results
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">
              Everything you need for professional image editing
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Powerful tools designed for both beginners and professionals
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 bg-gradient-to-br from-background/50 to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Brightness & Contrast Control</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fine-tune brightness with logarithmic and exponential contrast adjustments
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background/50 to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                  <div className="h-6 w-6 rounded bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">RGB/CMY Channel Manipulation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Control individual color channels for precise color correction and effects
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background/50 to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Image Transformations</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Rotate, scale, crop, and translate images with precision controls
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background/50 to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Advanced Filters</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Grayscale, negative, binarization, and custom threshold filters
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background/50 to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                  <ImageIcon className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Image Fusion & Blending</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Combine multiple images with transparency and blending controls
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-background/50 to-muted/30 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                  <div className="h-6 w-6 text-pink-500">📊</div>
                </div>
                <h3 className="mt-4 text-xl font-semibold">Histogram Analysis</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Real-time histogram visualization for RGB channels and luminosity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-balance text-3xl font-bold md:text-4xl mb-4">
              See Chromakit in Action
            </h2>
            <p className="text-pretty text-muted-foreground">
              Professional image processing with intuitive controls
            </p>
          </div>

          {/* Placeholder for demo video or interactive preview */}
          <div className="relative aspect-video rounded-xl border bg-gradient-to-br from-muted/30 to-background overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive Demo Coming Soon</h3>
                <p className="text-muted-foreground">Try our editor with sample images</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">
              Ready to transform your images?
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Join thousands of users who trust Chromakit for their image editing needs
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="w-full sm:w-auto group">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-sm text-muted-foreground">
              Free plan includes up to 50 images per month
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}