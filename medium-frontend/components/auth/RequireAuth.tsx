// medium-frontend/components/auth/RequireAuth.tsx
"use client"

import { ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"

type RequireAuthProps = {
  children: ReactNode
  redirectTo?: string
}

export default function RequireAuth({ children, redirectTo = "/login" }: RequireAuthProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading || user) return
    const search = new URLSearchParams({ next: pathname }).toString()
    router.replace(`${redirectTo}?${search}`)
  }, [isLoading, user, redirectTo, router, pathname])

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-gray-500">
        Checking your session...
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

