import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sandwichId } = await request.json()

    if (!sandwichId) {
      return NextResponse.json({ error: "Sandwich ID is required" }, { status: 400 })
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_sandwichId: {
          userId: session.user.id,
          sandwichId: sandwichId,
        },
      },
    })

    if (existingLike) {
      // Unlike: Delete the existing like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      })

      return NextResponse.json({ liked: false, message: "Like removed" })
    } else {
      // Like: Create a new like
      await prisma.like.create({
        data: {
          userId: session.user.id,
          sandwichId: sandwichId,
        },
      })

      return NextResponse.json({ liked: true, message: "Like added" })
    }
  } catch (error) {
    console.error("Error handling like:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sandwichId = searchParams.get("sandwichId")
    const session = await getServerSession(authOptions)

    if (!sandwichId) {
      return NextResponse.json({ error: "Sandwich ID is required" }, { status: 400 })
    }

    // Get like count for the sandwich
    const likeCount = await prisma.like.count({
      where: { sandwichId },
    })

    // Check if current user has liked this sandwich
    let userHasLiked = false
    if (session?.user?.id) {
      const userLike = await prisma.like.findUnique({
        where: {
          userId_sandwichId: {
            userId: session.user.id,
            sandwichId: sandwichId,
          },
        },
      })
      userHasLiked = !!userLike
    }

    return NextResponse.json({
      likeCount,
      userHasLiked,
    })
  } catch (error) {
    console.error("Error fetching likes:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}