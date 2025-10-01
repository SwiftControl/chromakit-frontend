"use client"

import { Button } from "@/components/ui/button"
import { ImageIcon, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { UserDropdown } from "./user-dropdown"
import { ThemeToggle } from "./theme-toggle"

type HeaderVariant = "public" | "authenticated" | "minimal"

interface HeaderProps {
  variant?: HeaderVariant
}

export function Header({ variant = "public" }: HeaderProps) {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/favicon-64x64.png"
            alt="Chromakit"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="text-xl font-semibold">Chromakit</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {/* Minimal variant: just back button */}
          {variant === "minimal" && !user && (
            <Link href="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          )}

          {/* Theme toggle - always visible */}
          <ThemeToggle />

          {/* Show user dropdown if user is logged in (any variant) */}
          {user && <UserDropdown />}

          {/* Show auth buttons only when not logged in and not minimal */}
          {!user && !isLoading && variant !== "minimal" && (
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
