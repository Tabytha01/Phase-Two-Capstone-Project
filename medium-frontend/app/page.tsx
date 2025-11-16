import Container from "@/components/layout/Container"
import Button from "@/components/ui/Button"

export default function HomePage() {
  return (
    <Container>
      <h1 className="text-2xl font-semibold">Home Feed</h1>
      <p className="mt-2 text-sm text-gray-600">Recent posts will appear here.</p>
      <div className="mt-4">
        <Button>Explore</Button>
      </div>
    </Container>
  )
}