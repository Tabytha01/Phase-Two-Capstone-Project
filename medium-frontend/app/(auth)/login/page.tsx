// medium-frontend/app/(auth)/login/page.tsx
"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError("Invalid credentials")
    else window.location.href = "/"
  }

  return (
    <section className="max-w-sm">
      <h1 className="text-xl font-semibold">Log in</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input className="w-full border rounded-md h-10 px-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="demo@demo.com" />
        <input className="w-full border rounded-md h-10 px-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="demo123" />
        <button className="h-10 px-4 rounded-md bg-black text-white" disabled={loading} type="submit">{loading ? "Signing in..." : "Sign in"}</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </section>
  )
}