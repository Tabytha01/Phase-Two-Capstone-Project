// medium-frontend/app/(auth)/register/page.tsx
"use client"

import { FormEvent, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !email || password.length < 6) {
      setError("All fields are required, password must be 6+ characters.")
      return
    }
    setError(null)
    setLoading(true)
    try {
      await signUp({ name, email, password })
      router.push("/account")
    } catch (err) {
      console.error(err)
      setError("Unable to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-sm">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <p className="mt-2 text-sm text-gray-600">Join the community of writers and readers.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </label>
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
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black underline">
          Sign in
        </Link>
      </p>
    </section>
  )
}