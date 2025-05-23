import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { signUpSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the input
    const result = signUpSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { name, email, password } = result.data

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists with this email" },
          { status: 409 }
        )
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        }
      })

      return NextResponse.json(
        { message: "User created successfully", user },
        { status: 201 }
      )
    } catch (dbError: any) {
      // Handle database-specific errors
      if (dbError.code === 'P1001' || 
          dbError.message?.includes("Can't reach database server") ||
          dbError.message?.includes("Connection refused")) {
        console.error("Database connection error:", dbError);
        return NextResponse.json(
          { error: "Database connection error. Please try again later or contact support." },
          { status: 503 }
        )
      }
      
      // Handle duplicate key errors (another way a user might exist)
      if (dbError.code === 'P2002') {
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        )
      }
      
      // Re-throw for the outer catch block
      throw dbError;
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}