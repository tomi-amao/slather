import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createSandwichSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)


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
    const sandwich = await prisma.$transaction(async (tx) => {
      // Find or create restaurant if applicable
      let restaurantId: string | null = null
      
      if (type === "RESTAURANT" && restaurantName) {
        const restaurant = await tx.restaurant.upsert({
          where: { name: restaurantName },
          update: {},
          create: {
            name: restaurantName,
          },
        })
        restaurantId = restaurant.id
      }

      // Create the sandwich
      const newSandwich = await tx.sandwich.create({
        data: {
          title,
          description,
          type,
          images,
          ingredients: type === "HOMEMADE" && ingredients ? ingredients.split(',').map(i => i.trim()) : [],
          userId: session.user.id,
          restaurantId,
        },
      })

      // Create the rating
      await tx.rating.create({
        data: {
          taste: parseInt(tasteRating),
          presentation: parseInt(presentationRating),
          value: parseInt(textureRating), // Using texture as "value" since our schema has value
          overall: parseFloat(overallRating),
          sandwichId: newSandwich.id,
          userId: session.user.id,
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
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}