"use client"

import Link from "next/link"
import { useAuth } from "@/components/providers/AuthProvider"
 
 export default function SiteHeader() {
   const { user, signOut } = useAuth()
   return (
     <header className="border-b bg-white">
       <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
         <Link href="/" className="text-lg font-semibold">
           Medium Clone
         </Link>
         <nav className="flex items-center gap-4 text-sm font-medium">
           <Link href="/posts/new" className="hover:underline">
             Write
           </Link>
           {user ? (
             <>
               <Link href="/account" className="hover:underline">
                 {user.name || "Account"}
               </Link>
               <button onClick={signOut} className="text-gray-600 hover:underline">
                 Logout
               </button>
             </>
           ) : (
             <>
               <Link href="/login" className="hover:underline">
                 Login
               </Link>
               <Link href="/register" className="hover:underline">
                 Register
               </Link>
             </>
           )}
         </nav>
       </div>
     </header>
   )
 }
