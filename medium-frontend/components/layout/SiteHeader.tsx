import Link from "next/link"
export default function SiteHeader(){
  return(
    <header className="boarder-b bg white">
      <div className="mx-outo max-w-4xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          Medium Clone
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/posts/new" className="text-sm font-medium hover:underline">
          Write
          </Link>
          <Link href="/login" className="text-sm font-medium hover:underline">
          Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline">
          Register
          </Link>
        </nav>
      </div>
    </header>
  )
}
