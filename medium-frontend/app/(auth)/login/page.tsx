// medium-frontend/app/(auth)/login/page.tsx
"use client"

import { FormEvent, Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/"
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email || !password) {
      setError("Email and password are required.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await signIn({ email, password })
      router.push(next)
    } catch (err) {
      console.error(err)
      setError("Unable to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Log in</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your credentials to access your account.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            minLength={6}
            required
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <Link href="/register" className="font-medium text-black underline">
          Sign up
        </Link>
      </p>
    </section>
  )
}

function LoginLoading() {
  return (
    <section className="mx-auto max-w-sm">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
      </div>
    </section>
  )
}