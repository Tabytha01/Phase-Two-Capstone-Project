// medium-frontend/app/(protected)/account/page.tsx
"use client"

import { FormEvent, useState } from "react"
import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/providers/AuthProvider"

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountForm />
    </RequireAuth>
  )
}

function AccountForm() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [bio, setBio] = useState(user?.bio ?? "")
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSaving(true)
    await updateProfile({ name, bio })
    setMessage("Profile updated")
    setSaving(false)
  }

  return (
    <section className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold">Your profile</h1>
      <p className="mt-2 text-sm text-gray-600">Update your name and bio for posts.</p>
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
          Bio
          <textarea
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            rows={4}
            placeholder="Share something about you..."
          />
        </label>
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  )
}

