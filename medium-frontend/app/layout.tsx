// medium-frontend/app/layout.tsx
import "./globals.css"
import type { Metadata } from "next"
import SiteHeader from "@/components/layout/SiteHeader"

export const metadata: Metadata = {
  title: "Medium Clone",
  description: "A publishing platform built with Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}