// medium-frontend/app/(posts)/posts/[slug]/page.tsx
type Props = { params: { slug: string } }
export default function PostPage({ params }: Props) {
  return (
    <article>
      <h1 className="text-2xl font-semibold">{params.slug}</h1>
      <p className="mt-2 text-sm text-gray-600">Post content will be rendered here.</p>
    </article>
  )
}