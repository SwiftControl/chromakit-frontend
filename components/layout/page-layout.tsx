"use client"

import { Header } from "./header"
import { Footer } from "./footer"

type HeaderVariant = "public" | "authenticated" | "minimal"

interface PageLayoutProps {
  children: React.ReactNode
  headerVariant?: HeaderVariant
  showFooter?: boolean
}

export function PageLayout({
  children,
  headerVariant = "public",
  showFooter,
}: PageLayoutProps) {
  // Only show footer for public/guest pages by default
  const shouldShowFooter = showFooter !== undefined
    ? showFooter
    : headerVariant === "public" || headerVariant === "minimal"

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant={headerVariant} />
      <main className="flex-1">{children}</main>
      {shouldShowFooter && <Footer />}
    </div>
  )
}
