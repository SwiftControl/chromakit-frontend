import { ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/favicon-64x64.png"
                alt="Chromakit"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="font-semibold">Chromakit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional image processing made simple. Transform and enhance your images with powerful tools.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/data-deletion" className="text-muted-foreground hover:text-foreground transition-colors">
                  Data Deletion
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@chromakit.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:privacy@chromakit.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Questions
                </a>
              </li>
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Chromakit. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Created by</span>
              <a
                href="https://github.com/SwiftControl"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                @SwiftControl
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
