import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { postPayloadSchema } from "@/lib/validators/post"

type Params = { slug: string }

async function getParams(context: { params: Promise<Params> }) {
  return context.params
}

export async function GET(_req: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await getParams(context)
  const post = await prisma.post.findUnique({
    where: { slug },
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

export async function PUT(req: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await getParams(context)
  try {
    const body = await req.json()
    const payload = postPayloadSchema.partial().parse(body)
    const { tagIds, authorId, ...postData } = payload

    const post = await prisma.post.update({
      where: { slug },
      data: {
        ...postData,
        ...(authorId ? { author: { connect: { id: authorId } } } : {}),
        publishedAt:
          payload.status === "PUBLISHED"
            ? payload.publishedAt
              ? new Date(payload.publishedAt)
              : new Date()
            : null,
        tags: tagIds
          ? {
              deleteMany: {},
              create: tagIds.map((tagId) => ({ tagId })),
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

export async function DELETE(_req: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await getParams(context)
  await prisma.post.delete({ where: { slug } })
  return NextResponse.json({ ok: true })
}