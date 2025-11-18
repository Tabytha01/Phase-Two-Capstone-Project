import { title } from "process"
import const {z} from "zod"

export constpostPayLoadSchema = z.object({
    title: z.string().min(4),
    slug: z
    .string()
    .min(3),
    .regex(/^[a-z0-9-]+$/),
    content: z.string().min(20),
    excerpt: z.string().optional(),
    coverImage: z.string().url().optional(),
    status: z.enum(["DRAFT","PUBLISHED"]).default("DRAFT"),
    publishedAt: z.string().datetime().optional(),
})
export type PostPayload = z.infer<typeof postPayloadSchema>
