import Link from "next/link"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

type PostWithRelations = Prisma.PostGetPayload<{
  include: { author: true; tags: { include: { tag: true } } }
}>

export default async function HomePage() {
  let posts: PostWithRelations[] = []

  try {
    posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: { author: true, tags: { include: { tag: true } } },
    })
  } catch (error) {
    console.error("Failed to load posts", error)
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Latest stories</h1>
        <p className="text-sm text-gray-600">Published posts with tags.</p>
      </header>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.id} className="rounded border border-gray-200 p-4">
            <Link href={`/posts/${post.slug}`} className="text-xl font-semibold">
              {post.title}
            </Link>
            <p className="mt-2 text-sm text-gray-600">{post.excerpt ?? post.content.slice(0, 140)}…</p>
            <div className="mt-3 text-xs text-gray-500">
              By {post.author.name} · {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-gray-500">
              {post.tags.map(({ tag }) => (
                <span key={tag.id} className="rounded bg-gray-100 px-2 py-0.5">
                  {tag.name}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}