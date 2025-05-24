"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { User, LogOut, Menu, X, Home, Compass, Plus, Search, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ThemeToggle } from "./ui"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [mobileFocused, setMobileFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  
  const isAuthenticated = status === "authenticated" && session?.user

  // Handle search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsFocused(false)
      setMobileFocused(false)
      setSearchQuery("")
    }
  }

  // Handle outside click for search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setMobileFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          ? 'glass shadow-soft dark:shadow-soft' 
          : 'bg-white/70 dark:bg-background-secondary/70 backdrop-blur-sm'
      }`}>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 lg:py-4">
          {/* Logo Section */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/slather-logo.png"
              alt="Slather Logo"
              width={80}
              height={80}
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="mr-8 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className={`bg-background-secondary dark:bg-background-secondary rounded-full px-4 py-2 flex items-center gap-2 shadow-sm hover:shadow transition-all ${isFocused ? 'ring-2 ring-accent-primary' : ''}`}>
                  <Search size={16} className="text-text-secondary dark:text-text-secondary" />
                  <input 
                    type="text" 
                    placeholder="Search for sandwiches..." 
                    className="bg-transparent border-none outline-none text-sm w-44 text-text-primary dark:text-text-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                  />
                  {searchQuery && (
                    <button 
                      type="submit"
                      className="ml-1 p-1 rounded-full hover:bg-background hover:dark:bg-background text-text-secondary hover:text-accent-primary"
                    >
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </form>
              
              {/* Search dropdown (only show when focused and has query) */}
              {isFocused && searchQuery && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-background-secondary rounded-xl shadow-soft-lg border border-border-color dark:border-border-color overflow-hidden z-20">
                  <div className="p-2">
                    <div 
                      className="flex items-center gap-2 p-2 hover:bg-background-secondary dark:hover:bg-background rounded-lg cursor-pointer"
                      onClick={handleSearchSubmit}
                    >
                      <Search size={14} className="text-accent-primary" />
                      <span className="text-sm text-text-primary dark:text-text-primary">
                        Search for <strong>"{searchQuery}"</strong>
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2 p-2 hover:bg-background-secondary dark:hover:bg-background rounded-lg cursor-pointer"
                      onClick={() => {
                        router.push(`/discover?type=RESTAURANT&q=${encodeURIComponent(searchQuery)}`)
                        setIsFocused(false)
                        setSearchQuery("")
                      }}
                    >
                      <span className="text-base">🏢</span>
                      <span className="text-sm text-text-primary dark:text-text-primary">
                        Search restaurants for <strong>"{searchQuery}"</strong>
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2 p-2 hover:bg-background-secondary dark:hover:bg-background rounded-lg cursor-pointer"
                      onClick={() => {
                        router.push(`/discover?type=HOMEMADE&q=${encodeURIComponent(searchQuery)}`)
                        setIsFocused(false)
                        setSearchQuery("")
                      }}
                    >
                      <span className="text-base">🏠</span>
                      <span className="text-sm text-text-primary dark:text-text-primary">
                        Search homemade for <strong>"{searchQuery}"</strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                className={`flex items-center gap-2 text-sm font-medium leading-normal transition-all duration-200 ${
                  pathname === '/' 
                    ? 'text-accent-primary' 
                    : 'text-text-primary dark:text-text-primary hover:text-accent-primary'
                }`}
                href="/"
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link 
                className={`flex items-center gap-2 text-sm font-medium leading-normal transition-all duration-200 ${
                  pathname === '/discover' 
                    ? 'text-accent-primary' 
                    : 'text-text-primary dark:text-text-primary hover:text-accent-primary'
                }`}
                href="/discover"
              >
                <Compass size={18} />
                <span>Explore</span>
              </Link>
                <Link 
                  className="flex items-center gap-2 bg-white dark:bg-background-secondary text-text-primary dark:text-text-primary shadow-soft hover:shadow-soft-lg text-sm font-medium px-4 py-2 rounded-full transition-all duration-200" 
                  href="/sandwich/new"
                >
                  <Plus size={18} />
                  <span>Create</span>
                </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            
            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative"
                >
                  {session.user && session.user.image ? (
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 cursor-pointer border-2 border-white dark:border-background-secondary shadow-soft hover:shadow-soft-lg transition-all duration-200"
                      style={{ backgroundImage: `url("${session.user.image}")` }}
                    />
                  ) : (
                    <div className="bg-white dark:bg-background-secondary rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-soft hover:shadow-soft-lg transition-all duration-200">
                      <User size={18} className="text-accent-secondary" />
                    </div>
                  )}
                  {/* Online indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 bg-success rounded-full border-2 border-white dark:border-background-secondary"></span>
                </button>
                
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white dark:bg-background-secondary shadow-soft-lg py-2 z-20 border border-border-color dark:border-border-color">
                    <div className="px-4 py-3 border-b border-border-color dark:border-border-color mb-1">
                      <p className="font-medium text-text-primary dark:text-text-primary">{session.user?.name}</p>
                      <p className="text-sm text-text-secondary dark:text-text-secondary truncate">{session.user?.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary dark:text-text-primary hover:bg-background-secondary dark:hover:bg-background transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <User size={16} className="text-text-secondary dark:text-text-secondary" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      href="/my-sandwiches" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary dark:text-text-primary hover:bg-background-secondary dark:hover:bg-background transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="text-base">🥪</span>
                      <span>My Sandwiches</span>
                    </Link>
                    <hr className="my-2 border-border-color dark:border-border-color" />
                    <button 
                      onClick={() => {
                        signOut({ callbackUrl: '/' });
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-background-secondary dark:hover:bg-background w-full text-left transition-colors"
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
                className="text-black text-sm font-medium px-4 lg:px-5 py-2 rounded-full shadow-soft hover:shadow-soft-lg transition-all duration-200"
              >
                <span className="truncate">Sign in</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-background-secondary shadow-soft hover:shadow-soft-lg transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <X size={18} className="text-text-primary dark:text-text-primary" />
              ) : (
                <Menu size={18} className="text-text-primary dark:text-text-primary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-text-primary/30 dark:bg-text-primary/50 z-40 lg:hidden" />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu-container fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-background z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-soft-lg ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-color dark:border-border-color">
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
              <span className="text-text-primary dark:text-text-primary text-lg font-medium">Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-background-secondary dark:bg-background"
              >
                <X size={16} className="text-text-primary dark:text-text-primary" />
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="px-6 pt-4" ref={mobileSearchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className={`bg-background-secondary dark:bg-background rounded-full px-4 py-3 flex items-center gap-2 w-full ${mobileFocused ? 'ring-2 ring-accent-primary' : ''}`}>
                <Search size={18} className="text-text-secondary dark:text-text-secondary" />
                <input 
                  type="text" 
                  placeholder="Search for sandwiches..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-text-primary dark:text-text-primary placeholder:text-text-secondary dark:placeholder:text-text-secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setMobileFocused(true)}
                />
                {searchQuery && (
                  <button 
                    type="submit"
                    className="p-1 rounded-full hover:bg-background-secondary/50 text-text-secondary hover:text-accent-primary"
                  >
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </form>
            
            {/* Mobile search dropdown */}
            {mobileFocused && searchQuery && (
              <div className="mt-2 bg-white dark:bg-background-secondary rounded-xl shadow-soft border border-border-color dark:border-border-color overflow-hidden">
                <div className="p-2">
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-background-secondary dark:hover:bg-background rounded-lg cursor-pointer"
                    onClick={handleSearchSubmit}
                  >
                    <Search size={16} className="text-accent-primary" />
                    <span className="text-sm text-text-primary dark:text-text-primary">
                      Search for <strong>"{searchQuery}"</strong>
                    </span>
                  </div>
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-background-secondary dark:hover:bg-background rounded-lg cursor-pointer"
                    onClick={() => {
                      router.push(`/discover?type=RESTAURANT&q=${encodeURIComponent(searchQuery)}`)
                      setMobileFocused(false)
                      setMobileMenuOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <span className="text-base">🏢</span>
                    <span className="text-sm text-text-primary dark:text-text-primary">
                      Search restaurants for <strong>"{searchQuery}"</strong>
                    </span>
                  </div>
                  <div 
                    className="flex items-center gap-2 p-2 hover:bg-background-secondary dark:hover:bg-background rounded-lg cursor-pointer"
                    onClick={() => {
                      router.push(`/discover?type=HOMEMADE&q=${encodeURIComponent(searchQuery)}`)
                      setMobileFocused(false)
                      setMobileMenuOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <span className="text-base">🏠</span>
                    <span className="text-sm text-text-primary dark:text-text-primary">
                      Search homemade for <strong>"{searchQuery}"</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Link 
                href="/"
                className={`flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary dark:hover:bg-background transition-colors ${
                  pathname === '/' ? 'bg-background-secondary dark:bg-background' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${
                  pathname === '/' 
                    ? 'bg-accent-primary/20 dark:bg-accent-primary/20' 
                    : 'bg-white dark:bg-background-secondary'
                }`}>
                  <Home size={18} className={`${pathname === '/' ? 'text-accent-primary' : 'text-accent-primary'}`} />
                </div>
                <span className={`font-medium ${
                  pathname === '/' 
                    ? 'text-accent-primary' 
                    : 'text-text-primary dark:text-text-primary'
                }`}>Home</span>
              </Link>
              
              <Link 
                href="/discover"
                className={`flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary dark:hover:bg-background transition-colors ${
                  pathname === '/discover' ? 'bg-background-secondary dark:bg-background' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full shadow-sm ${
                  pathname === '/discover' 
                    ? 'bg-accent-primary/20 dark:bg-accent-primary/20' 
                    : 'bg-white dark:bg-background-secondary'
                }`}>
                  <Compass size={18} className="text-accent-primary" />
                </div>
                <span className={`font-medium ${
                  pathname === '/discover' 
                    ? 'text-accent-primary' 
                    : 'text-text-primary dark:text-text-primary'
                }`}>Explore</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link 
                    href="/sandwich/new"
                    className="flex items-center gap-4 p-3 rounded-xl  text-white transition-all duration-200 shadow-soft mt-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full">
                      <Plus size={18} className="text-white" />
                    </div>
                    <span className="font-medium">Create Sandwich</span>
                  </Link>

                  <div className="h-px bg-border-color dark:bg-border-color my-4"></div>

                  <Link 
                    href="/profile"
                    className={`flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary dark:hover:bg-background transition-colors ${
                      pathname === '/profile' ? 'bg-background-secondary dark:bg-background' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-background-secondary rounded-full shadow-sm">
                      <User size={18} className="text-accent-primary" />
                    </div>
                    <span className={`font-medium ${
                      pathname === '/profile' 
                        ? 'text-accent-primary' 
                        : 'text-text-primary dark:text-text-primary'
                    }`}>Profile</span>
                  </Link>

                  <Link 
                    href="/my-sandwiches"
                    className={`flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary dark:hover:bg-background transition-colors ${
                      pathname === '/my-sandwiches' ? 'bg-background-secondary dark:bg-background' : ''
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-background-secondary rounded-full shadow-sm text-base">
                      🥪
                    </div>
                    <span className={`font-medium ${
                      pathname === '/my-sandwiches' 
                        ? 'text-accent-primary' 
                        : 'text-text-primary dark:text-text-primary'
                    }`}>My Sandwiches</span>
                  </Link>

                  <button 
                    onClick={() => {
                      signOut({ callbackUrl: '/' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-background-secondary dark:hover:bg-background transition-colors group w-full text-left"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-white dark:bg-background-secondary rounded-full shadow-sm group-hover:bg-error/10">
                      <LogOut size={18} className="text-error" />
                    </div>
                    <span className="text-error font-medium">Sign out</span>
                  </button>
                </>
              )}

              {!isAuthenticated && (
                <Link 
                  href="/auth/signin"
                  className="flex items-center gap-4 p-3 rounded-xl text-white transition-all duration-200 shadow-soft mt-3"
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