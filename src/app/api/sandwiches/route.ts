import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSandwichSchema } from "@/lib/validations"
import { Prisma } from "@prisma/client"

// Define the SandwichType enum locally since it's not exported from Prisma
enum SandwichType {
  RESTAURANT = "RESTAURANT",
  HOMEMADE = "HOMEMADE"
}

// Extend the Session type to include user ID
interface ExtendedSession {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  }
}

// Define type for sandwich data instead of using 'any'
type SandwichCreateInput = {
  title: string;
  description?: string | null;
  type: SandwichType;
  images: string[];
  ingredients: string[];
  restaurantId?: string | null;
  userId: string;
};

export async function POST(request: NextRequest) {
  try {
    // Check authentication but make it optional
    const session = await getServerSession(authOptions) as ExtendedSession | null
    // User ID is optional - if logged in, we'll associate the sandwich with the user
    const userId = session?.user?.id

    // Parse and validate request body
    const body = await request.json()
    const result = createSandwichSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.issues },
        { status: 400 }
      )
    }

    const { 
      title, 
      description, 
      type, 
      restaurantName, 
      ingredients, 
      overallRating,
      tasteRating,
      textureRating,
      presentationRating,
      images 
    } = result.data

    // Begin a transaction to create sandwich and associated data
    const sandwich = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Find or create restaurant if applicable
      let restaurantId: string | null = null
      
      if (type === "RESTAURANT" && restaurantName) {
        // Use findFirst and create instead of upsert to avoid unique constraint issues
        let restaurant = await tx.restaurant.findFirst({
          where: { name: restaurantName }
        })
        
        if (!restaurant) {
          restaurant = await tx.restaurant.create({
            data: { name: restaurantName }
          })
        }
        
        restaurantId = restaurant.id
      }

      // Determine the user ID to use
      let finalUserId: string
      
      if (userId) {
        // User is authenticated, verify the user exists
        const existingUser = await tx.user.findUnique({
          where: { id: userId }
        })
        
        if (!existingUser) {
          throw new Error("Authenticated user not found in database")
        }
        
        finalUserId = userId
      } else {
        // Create or find an anonymous user with a unique identifier
        const randomSuffix = Math.random().toString(36).substring(2, 15)
        const timestamp = Date.now()
        const uniqueEmail = `anon_${timestamp}_${randomSuffix}@slather.app`
        
        try {
          const anonUser = await tx.user.create({
            data: {
              name: "Anonymous User",
              email: uniqueEmail,
              password: null, // Null password - this user won't be able to login
            }
          })
          finalUserId = anonUser.id
        } catch (error) {
          // If there's still a conflict (very unlikely), try to find an existing anonymous user
          const fallbackUser = await tx.user.findFirst({
            where: {
              name: "Anonymous User",
              email: {
                startsWith: "anon_"
              }
            }
          })
          
          if (fallbackUser) {
            finalUserId = fallbackUser.id
          } else {
            throw new Error("Failed to create or find anonymous user")
          }
        }
      }

      // Create the sandwich data object
      const sandwichData: SandwichCreateInput = {
        title,
        description,
        type: type as SandwichType,
        images: images || [],
        ingredients: type === "HOMEMADE" && ingredients ? ingredients.split(',').map(i => i.trim()) : [],
        restaurantId,
        userId: finalUserId,
      }

      // Create the sandwich
      const newSandwich = await tx.sandwich.create({
        data: sandwichData,
      })

      // Create the rating with the same user ID
      await tx.rating.create({
        data: {
          taste: Math.round(parseFloat(tasteRating) * 10) / 10, // Store as decimal
          presentation: Math.round(parseFloat(presentationRating) * 10) / 10,
          value: Math.round(parseFloat(textureRating) * 10) / 10, // Using texture as "value" since our schema has value
          overall: Math.round(parseFloat(overallRating) * 10) / 10,
          sandwichId: newSandwich.id,
          userId: finalUserId,
        },
      })

      return newSandwich
    })

    return NextResponse.json(
      { 
        message: "Sandwich created successfully", 
        sandwich,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating sandwich:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}