import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSandwichSchema } from "@/lib/validations"
import { PrismaClient, SandwichType } from "@prisma/client"

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
    const sandwich = await prisma.$transaction(async (tx: PrismaClient) => {
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

      // Create the sandwich data object with optional user ID
      const sandwichData: SandwichCreateInput = {
        title,
        description,
        type,
        images: images || [],
        ingredients: type === "HOMEMADE" && ingredients ? ingredients.split(',').map(i => i.trim()) : [],
        restaurantId,
        userId: '', // This will be set below either from session or from a newly created anonymous user
      }
      
      // Only add userId if the user is authenticated
      if (userId) {
        sandwichData.userId = userId
      } else {
        // Create an anonymous user if needed
        const anonUser = await tx.user.create({
          data: {
            name: "Anonymous User",
            email: `anon_${Date.now()}@slather.app`, // Create a unique email
            password: "", // Empty password - this user won't be able to login
          }
        })
        sandwichData.userId = anonUser.id
      }

      // Create the sandwich
      const newSandwich = await tx.sandwich.create({
        data: sandwichData,
      })

      // Create the rating with the same user ID
      await tx.rating.create({
        data: {
          taste: parseInt(tasteRating),
          presentation: parseInt(presentationRating),
          value: parseInt(textureRating), // Using texture as "value" since our schema has value
          overall: parseFloat(overallRating),
          sandwichId: newSandwich.id,
          userId: sandwichData.userId,
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