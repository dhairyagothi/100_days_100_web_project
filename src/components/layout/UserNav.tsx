"use client"

import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { LogOut, User } from "lucide-react"

export function UserNav() {
  const { user, logout } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden text-sm font-medium md:inline-block">
          Welcome, {user}
        </span>
        <button
          onClick={logout}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 border border-input bg-background gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    )
  }

  return (
    <Link
      href="/login"
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 px-4 border border-input bg-background gap-2"
    >
      <User className="h-4 w-4" />
      Login
    </Link>
  )
}
