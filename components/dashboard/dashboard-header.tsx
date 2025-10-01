"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ImageIcon, LogOut, User, Settings, History, Image } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useState } from "react"
import { UserAvatar } from "@/components/ui/user-avatar"

interface DashboardHeaderProps {
  user: SupabaseUser
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error('Failed to sign out')
        console.error('Sign out error:', error)
      } else {
        toast.success('Signed out successfully')
        router.push("/")
        router.refresh()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Get user info for avatar
  const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email || "User"
  const profilePicture = user.user_metadata?.avatar_url || user.user_metadata?.picture
  const initials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <ImageIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Chromakit</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/history">History</Link>
            </Button>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                <UserAvatar
                  src={profilePicture}
                  alt={userName}
                  fallback={initials}
                  size="sm"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center space-x-3 p-2">
                  <UserAvatar
                    src={profilePicture}
                    alt={userName}
                    fallback={initials}
                    size="lg"
                  />
                  <div className="flex flex-col space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    {user.user_metadata?.provider && (
                      <p className="text-xs text-primary/80 capitalize">
                        via {user.user_metadata.provider}
                      </p>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard">
                  <Image className="mr-2 h-4 w-4" />
                  <span>My Images</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/history">
                  <History className="mr-2 h-4 w-4" />
                  <span>History</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="cursor-pointer text-destructive focus:text-destructive"
                disabled={isSigningOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
