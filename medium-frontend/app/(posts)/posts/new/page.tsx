// medium-frontend/app/(posts)/posts/new/page.tsx
"use client"

import { ChangeEvent, FormEvent, useRef, useState } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useRouter } from "next/navigation"
import RequireAuth from "@/components/auth/RequireAuth"
import { useAuth } from "@/components/providers/AuthProvider"

type Draft = {
  id: string
  title: string
  content: string
  updatedAt: string
}

const DRAFT_STORAGE_KEY = "medium-drafts"

function loadDrafts(): Draft[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Draft[]) : []
  } catch {
    return []
  }
}

function persistDrafts(drafts: Draft[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts))
}

export default function NewPostPage() {
  return (
    <RequireAuth>
      <EditorShell />
    </RequireAuth>
  )
}

function EditorShell() {
  const { user } = useAuth()
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [drafts, setDrafts] = useState<Draft[]>(() => loadDrafts())
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const insertSyntax = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current
    if (!textarea) return
    const { selectionStart, selectionEnd, value } = textarea
    const selectedText = value.slice(selectionStart, selectionEnd)
    const placeholder = selectedText || "text"
    const newValue =
      value.slice(0, selectionStart) +
      prefix +
      placeholder +
      suffix +
      value.slice(selectionEnd)
    setContent(newValue)
    requestAnimationFrame(() => {
      const cursorPos = selectionStart + prefix.length + placeholder.length + suffix.length
      textarea.selectionStart = textarea.selectionEnd = cursorPos
      textarea.focus()
    })
  }

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setStatus("Uploading image...")
    await handleCoverUpload(file)
    setStatus("Image added to the editor.")
  }

  const saveDraft = () => {
    const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    const nextDrafts: Draft[] = [
      {
        id,
        title: title.trim() || "Untitled draft",
        content,
        updatedAt: new Date().toISOString(),
      },
      ...drafts,
    ].slice(0, 5)
    setDrafts(nextDrafts)
    persistDrafts(nextDrafts)
    setStatus("Draft saved locally.")
  }

  const loadDraft = (draft: Draft) => {
    setTitle(draft.title)
    setContent(draft.content)
    setStatus(`Loaded draft from ${new Date(draft.updatedAt).toLocaleString()}`)
  }

  const publishPost = async (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim() || !content.trim() || !user) {
      setStatus("Title, content, and a signed-in user are required to publish.")
      return
    }

    setIsPublishing(true)
    setStatus("Publishing...")

    const payload = {
      title: title.trim(),
      slug: title.trim().toLowerCase().replace(/\s+/g, "-"),
      content,
      excerpt: content.slice(0, 180),
      status: "PUBLISHED",
      authorId: user.id,
      coverImage: coverImageUrl ?? undefined,
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      setStatus("Error publishing post.")
      setIsPublishing(false)
      return
    }

    const post = await res.json()
    setStatus("Post published!")
    setTitle("")
    setContent("")
    router.push(`/posts/${post.slug}`)
  }

  const toolbar: Array<{ label: string; prefix: string; suffix?: string }> = [
    { label: "Bold", prefix: "**", suffix: "**" },
    { label: "Italic", prefix: "_", suffix: "_" },
    { label: "Heading", prefix: "# " },
    { label: "List", prefix: "- " },
    { label: "Quote", prefix: "> " },
    { label: "Code", prefix: "```\n", suffix: "\n```" },
    { label: "Link", prefix: "[text](", suffix: ")" },
  ]

  async function handleCoverUpload(file: File) {
    const body = new FormData()
    body.append("file", file)

    const res = await fetch("/api/uploads", { method: "POST", body })
    const data = await res.json()
    setCoverImageUrl(data.url)
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Write a post</h1>
        <p className="mt-2 text-sm text-gray-600">
          Signed in as {user?.name} ({user?.email}). Use the toolbar to format, upload images, and
          preview your story.
        </p>
      </header>
      <form className="space-y-4" onSubmit={publishPost}>
        <label className="block text-sm font-medium text-gray-700">
          Title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-lg"
            placeholder="A compelling headline..."
            required
          />
        </label>
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-wrap gap-2 border-b border-gray-100 p-3 text-sm">
            {toolbar.map(({ label, prefix, suffix }) => (
              <button
                key={label}
                type="button"
                onClick={() => insertSyntax(prefix, suffix ?? "")}
                className="rounded border border-gray-200 px-2 py-1 hover:bg-gray-50"
              >
                {label}
              </button>
            ))}
            <label className="ml-auto cursor-pointer rounded border border-gray-200 px-2 py-1 hover:bg-gray-50">
              Add image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <button
              type="button"
              onClick={() => setPreview((prev) => !prev)}
              className="rounded border border-gray-200 px-2 py-1 hover:bg-gray-50"
            >
              {preview ? "Hide preview" : "Show preview"}
            </button>
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="h-64 w-full resize-none rounded-b-lg p-4 font-mono text-sm outline-none"
            placeholder="Start writing... Use markdown to format your story."
          />
        </div>
        {preview && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-lg font-semibold">Preview</h2>
            <article className="prose prose-neutral mt-4 max-w-none">
              <Markdown remarkPlugins={[remarkGfm]}>
                {content || "_Nothing to preview yet._"}
              </Markdown>
            </article>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-md border border-gray-300 px-4 py-2"
          >
            Save draft
          </button>
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
            disabled={isPublishing}
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
        {status && <p className="text-sm text-gray-600">{status}</p>}
      </form>
      {drafts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Recent drafts</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {drafts.map((draft) => (
              <li key={draft.id} className="flex items-center justify-between rounded border p-2">
                <div>
                  <p className="font-medium">{draft.title}</p>
                  <p className="text-xs text-gray-500">
                    Updated {new Date(draft.updatedAt).toLocaleString()}
                  </p>
                </div>
                <button
                  className="text-sm font-medium text-black underline"
                  onClick={() => loadDraft(draft)}
                >
                  Load
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}