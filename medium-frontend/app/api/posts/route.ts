import { NextResponse } from "next/server";
import { prisma} from "@/lib/prisma"
import { postPayloadSchema } from "@/lib/validators/post"

export async function GET(){
    const posts = await prisma.post.findMany({
        orderBy: { createAt: "desc"},
        include: { author: true, tags: {include: {tag: true}}},

    })
    return NextResponse.json(posts)
}
export async function POST(req: Request){
    try{
        const body = await req.json()
        const payload = PostPayloadShema.parse(body)

        const post =await prisma.post.create({
            data:{
                ...payload,
                publishedAt: payload.status === "PUBLISHED" ? new Date() : null,
                author: { connect: { id: payload.authorId} },
                tags: {
                    create: payload.tagId?.map((tagId) => ({tagId})) ||[]
                },

            },
        })
        return NextResponse.json(post, {status: 201})
    }
    catch(error){
        console.error(error)
        return NextResponse.json({ message: "Invalid payload"}, {status: 400})
    
    }
}