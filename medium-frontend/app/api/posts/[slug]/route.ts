import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { postPayloadSchema } from "@/lib/validators/post"

type Params = { slug: string }

export async function GET(_: Request, { params }: { params: Params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: true,
      tags: { include: { tag: true } },
      comments: {
        include: {
          author: true,
          replies: { include: { author: true } },
        },
      },
    },
  })
  if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const body = await req.json()
    const payload = postPayloadSchema.partial().parse(body)

    const post = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        ...payload,
        publishedAt:
          payload.status === "PUBLISHED"
            ? payload.publishedAt
              ? new Date(payload.publishedAt)
              : new Date()
            : null,
        tags: payload.tagIds
          ? {
              deleteMany: {},
              create: payload.tagIds.map((tagId) => ({ tagId })),
            }
          : undefined,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  await prisma.post.delete({ where: { slug: params.slug } })
  return NextResponse.json({ ok: true })
}