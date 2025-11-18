import Image from "next/image"
import { notFound } from "next/navigation"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export const dynamic = "force-dynamic"

type Props = { params: { slug: string } }

type PostResult = Prisma.PostGetPayload<{
  include: { author: true; tags: { include: { tag: true } } }
}>

export default async function PostPage({ params }: Props) {
  let post: PostResult | null = null
  try {
    post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: { author: true, tags: { include: { tag: true } } },
    })
  } catch (error) {
    console.error("Failed to load post", error)
  }

  if (!post) return notFound()

  return (
    <article className="space-y-6">
      <header>
        <p className="text-sm text-gray-500">
          {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString()}
        </p>
        <h1 className="text-3xl font-semibold">{post.title}</h1>
        <p className="text-sm text-gray-600">By {post.author.name}</p>
        {post.coverImage && (
          <div className="mt-4 overflow-hidden rounded-lg">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={460}
              className="h-auto w-full object-cover"
              unoptimized
            />
          </div>
        )}
      </header>
      <div className="prose prose-neutral">
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
      </div>
    </article>
  )
}