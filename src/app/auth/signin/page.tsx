"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { signInSchema } from "@/lib/validations"
import { Header } from "@/components/header"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registeredParam = searchParams.get('registered')
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check if user was redirected after successful registration
    if (registeredParam === 'true') {
      setSuccessMessage("Account created successfully! You can now sign in.")
    }
  }, [registeredParam])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      // Validate form inputs
      const validatedFields = signInSchema.safeParse({
        email,
        password,
      })

      if (!validatedFields.success) {
        throw new Error(validatedFields.error.issues[0]?.message || "Invalid input")
      }

      // Attempt to sign in
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Handle database connection errors specifically
        if (result.error.includes("Database connection error") || 
            result.error.includes("service is currently unavailable")) {
          throw new Error("Database connection error. Please try again later.")
        } else if (result.error.includes("Invalid credentials")) {
          throw new Error("Invalid email or password")
        } else {
          throw new Error(result.error || "Failed to sign in")
        }
      }

      // Redirect to homepage on success
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign in error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="layout-container flex h-full grow flex-col">
      <Header />
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#191310] tracking-light text-[32px] font-bold leading-tight min-w-72">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="flex max-w-[480px] mx-4 mb-4 p-4 bg-red-50 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="flex max-w-[480px] mx-4 mb-4 p-4 bg-green-50 text-green-700 rounded-xl">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Email</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                />
              </label>
            </div>

            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#191310] text-base font-medium leading-normal pb-2">Password</p>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#191310] focus:outline-0 focus:ring-0 border-none bg-[#f1ece9] focus:border-none h-14 placeholder:text-[#8c6a5a] p-4 text-base font-normal leading-normal"
                  required
                />
              </label>
            </div>

            <div className="flex px-4 py-3 justify-between items-center">
              <Link 
                href="/auth/signup" 
                className="text-sm text-[#191310] hover:underline"
              >
                Don&apos;t have an account? Sign up
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#eccebf] text-[#191310] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
              >
                <span className="truncate">
                  {isLoading ? "Signing in..." : "Sign in"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}