"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Bell, User, LogOut, Menu, X, Home, Compass, Plus, Search } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const isAuthenticated = status === "authenticated" && session?.user

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('.mobile-menu-container')) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass shadow-soft' 
          : 'bg-white/70 backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 lg:py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="size-8 lg:size-10 transform transition-transform group-hover:translate-y-[-2px]">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path 
                    d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" 
                    fill="currentColor" 
                    className="text-accent-primary group-hover:text-accent-secondary"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 size-4 bg-white rounded-full shadow-sm flex items-center justify-center">
                <span className="text-[10px]">🥪</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-text-primary text-xl lg:text-2xl font-bold leading-tight tracking-[-0.02em] group-hover:text-accent-primary transition-colors">
                Slather
              </h1>
              <span className="text-text-secondary text-xs font-medium hidden sm:block">
                Sandwich Explorer
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="mr-8 bg-background-secondary rounded-full px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow transition-all">
              <Search size={16} className="text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search for sandwiches..." 
                className="bg-transparent border-none outline-none text-sm w-44 text-text-primary placeholder:text-text-secondary"
              />
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                className="flex items-center gap-2 text-text-primary text-sm font-medium leading-normal hover:text-accent-primary transition-all duration-200" 
                href="/"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link 
                className="flex items-center gap-2 text-text-primary text-sm font-medium leading-normal hover:text-accent-primary transition-all duration-200" 
                href="/discover"
              >
                <Compass size={18} />
                <span>Explore</span>
              </Link>
              {isAuthenticated && (
                <Link 
                  className="flex items-center gap-2 bg-white text-text-primary shadow-soft hover:shadow-soft-lg text-sm font-medium px-4 py-2 rounded-full transition-all duration-200" 
                  href="/sandwich/new"
                >
                  <Plus size={18} />
                  <span>Create</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications (Desktop only when authenticated) */}
            {isAuthenticated && (
              <button className="hidden lg:flex items-center justify-center w-10 h-10 bg-white hover:bg-background-secondary rounded-full shadow-soft transition-all duration-200 relative">
                <Bell size={18} className="text-text-primary" />
                {/* Notification indicator */}
                <span className="absolute -top-0.5 -right-0.5 size-3 bg-accent-primary rounded-full border-2 border-white"></span>
              </button>
            )}
            
            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative"
                >
                  {session.user.image ? (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 cursor-pointer border-2 border-white shadow-soft hover:shadow-soft-lg transition-all duration-200"
                      style={{ backgroundImage: `url("${session.user.image}")` }}
                    />
                  ) : (
                    <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-soft hover:shadow-soft-lg transition-all duration-200">
                      <User size={18} className="text-accent-secondary" />
                    </div>
                  )}
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-success rounded-full border-2 border-white"></span>
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-soft-lg py-2 z-20 border border-border-color">
                    <div className="px-4 py-3 border-b border-border-color mb-1">
                      <p className="font-medium text-text-primary">{session.user.name}</p>
                      <p className="text-sm text-text-secondary truncate">{session.user.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={16} className="text-text-secondary" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      href="/my-sandwiches" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-background-secondary transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-base">🥪</span>
                      <span>My Sandwiches</span>
                    </Link>
                    <hr className="my-2 border-border-color" />
                    <button 
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-background-secondary w-full text-left transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/auth/signin"
                className="gradient-blue text-white text-sm font-medium px-4 lg:px-5 py-2 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200"
              >
                <span className="truncate">Sign in</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-soft hover:shadow-soft-lg transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X size={18} className="text-text-primary" />
              ) : (
                <Menu size={18} className="text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-text-primary/30 z-40 lg:hidden" />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-soft-lg ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-color">
            <div className="flex items-center gap-3">
              <div className="size-8">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path 
                    d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z" 
                    fill="currentColor" 
                    className="text-accent-primary"
                  />
                </svg>
              </div>
              <span className="text-text-primary text-lg font-medium">Menu</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-background-secondary"
            >
              <X size={16} className="text-text-primary" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pt-4">
            <div className="bg-background-secondary rounded-full px-4 py-3 flex items-center gap-2 w-full">
              <Search size={18} className="text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search for sandwiches..." 
                className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder:text-text-secondary"
              />
            </div>
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Link 
                href="/"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                  <Home size={18} className="text-accent-primary" />
                </div>
                <span className="text-text-primary font-medium">Home</span>
              </Link>
              
              <Link 
                href="/discover"
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                  <Compass size={18} className="text-accent-primary" />
                </div>
                <span className="text-text-primary font-medium">Explore</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link 
                    href="/sandwich/new"
                    className="flex items-center gap-4 p-3 rounded-xl gradient-blue text-white transition-all duration-200 shadow-soft mt-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <Plus size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Create Sandwich</span>
                  </Link>

                  <div className="h-px bg-border-color my-4"></div>

                  <Link 
                    href="/profile"
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                      <User size={18} className="text-accent-primary" />
                    </div>
                    <span className="text-text-primary font-medium">Profile</span>
                  </Link>

                  <Link 
                    href="/my-sandwiches"
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm text-base">
                      🥪
                    </div>
                    <span className="text-text-primary font-medium">My Sandwiches</span>
                  </Link>

                  <button 
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary transition-colors group w-full text-left"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm group-hover:bg-error/10">
                      <LogOut size={18} className="text-error" />
                    </div>
                    <span className="text-error font-medium">Sign out</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <Link 
                  href="/auth/signin"
                  className="flex items-center gap-4 p-3 rounded-xl gradient-blue text-white transition-all duration-200 shadow-soft mt-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="font-medium">Sign in</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}