"use client"

import useSWR from "swr"
import Link from "next/link"

type DashboardPost = {
  id: string
  title: string
  status: string
  updatedAt: string
  slug: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<DashboardPost[]>)

export default function PostDashboard() {
  const { data, mutate } = useSWR<DashboardPost[]>("/api/posts", fetcher)

  async function deletePost(slug: string) {
    await fetch(`/api/posts/${slug}`, { method: "DELETE" })
    mutate()
  }

  if (!data) return <p>Loading...</p>

  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">Manage posts</h1>
        <Link href="/posts/new" className="text-sm underline">
          New post
        </Link>
      </header>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>Title</th>
            <th>Status</th>
            <th>Updated</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((post) => (
            <tr key={post.id} className="border-t">
              <td>{post.title}</td>
              <td>{post.status}</td>
              <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
              <td className="text-right">
                <button onClick={() => deletePost(post.slug)} className="text-red-600 underline">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}