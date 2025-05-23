"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Search, Bell, User, LogOut } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  
  const isAuthenticated = status === "authenticated" && session?.user

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f1ece9] px-10 py-3">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4 text-[#191310]">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" 
                fill="currentColor" 
              />
            </svg>
          </div>
          <h2 className="text-[#191310] text-lg font-bold leading-tight tracking-[-0.015em]">Slather</h2>
        </div>
        <div className="flex items-center gap-9">
          <Link className="text-[#191310] text-sm font-medium leading-normal" href="/">
            Home
          </Link>
          <Link className="text-[#191310] text-sm font-medium leading-normal" href="/discover">
            Explore
          </Link>
          {isAuthenticated && (
            <Link className="text-[#191310] text-sm font-medium leading-normal" href="/sandwich/new">
              Create
            </Link>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-end gap-4 items-center">
        <label className="flex flex-col min-w-40 !h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
            <div className="text-[#8c6a5a] flex border-none bg-[#f1ece9] items-center justify-center pl-4 rounded-l-xl border-r-0">
              <Search size={24} />
            </div>
            <input
              placeholder="Search"
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-full placeholder:text-[#8c6a5a] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </label>
        
        {isAuthenticated ? (
          <>
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#f1ece9] text-[#191310] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
              <Bell size={20} className="text-[#191310]" />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative z-10"
              >
                {session.user.image ? (
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer border-2 border-transparent hover:border-[#eccebf] transition-colors"
                    style={{ backgroundImage: `url("${session.user.image}")` }}
                  />
                ) : (
                  <div className="bg-[#f1ece9] rounded-full size-10 flex items-center justify-center cursor-pointer border-2 border-transparent hover:border-[#eccebf] transition-colors">
                    <User size={20} className="text-[#8c6a5a]" />
                  </div>
                )}
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg py-2 z-20 border border-[#f1ece9]">
                  <div className="px-4 py-2 border-b border-[#f1ece9] mb-1">
                    <p className="font-medium text-[#191310]">{session.user.name}</p>
                    <p className="text-sm text-[#8c6a5a] truncate">{session.user.email}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-[#191310] hover:bg-[#f1ece9] w-full text-left"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/my-sandwiches" 
                    className="block px-4 py-2 text-sm text-[#191310] hover:bg-[#f1ece9] w-full text-left"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Sandwiches
                  </Link>
                  <button 
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-[#f1ece9] w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            href="/auth/signin"
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  )
}