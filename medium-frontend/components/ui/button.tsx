type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
const variants = {
  primary: "bg-black text-white hover:bg-gray-800",
  outline: "border border-gray-300 hover:bg-gray-100",
  ghost: "hover:bg-gray-100",
} as const
const sizes = { sm: "h-8 px-3", md: "h-10 px-4", lg: "h-12 px-6" } as const

function cls(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

export default function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return <button className={cls(base, variants[variant], sizes[size], className)} {...props} />
}