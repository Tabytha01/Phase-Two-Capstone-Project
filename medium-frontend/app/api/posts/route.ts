import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { postPayloadSchema } from "@/lib/validators/post"

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, tags: { include: { tag: true } } },
  })
  return NextResponse.json(posts)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const payload = postPayloadSchema.parse(body)
    const { authorId, tagIds, ...postData } = payload

    const post = await prisma.post.create({
      data: {
        ...postData,
        publishedAt: payload.status === "PUBLISHED" ? new Date() : null,
        author: { connect: { id: authorId } },
        tags: {
          create: tagIds?.map((tagId) => ({ tagId })) ?? [],
        },
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 })
  }
}