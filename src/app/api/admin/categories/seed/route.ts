import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Seed default categories
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only ADMIN can seed categories
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if categories already exist
    const existingCount = await db.category.count()
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: "Categories already exist",
        count: existingCount 
      })
    }

    // Create default categories
    const defaultCategories = [
      { name: 'Desktop', slug: 'desktop', description: 'Desktop computers and PCs', sortOrder: 1 },
      { name: 'Laptop', slug: 'laptop', description: 'Laptops and notebooks', sortOrder: 2 },
      { name: 'Component', slug: 'component', description: 'Computer components and parts', sortOrder: 3 },
      { name: 'Monitor', slug: 'monitor', description: 'Computer monitors and displays', sortOrder: 4 },
      { name: 'Phone', slug: 'phone', description: 'Mobile phones and smartphones', sortOrder: 5 },
      { name: 'Tablet', slug: 'tablet', description: 'Tablets and iPads', sortOrder: 6 },
      { name: 'Accessories', slug: 'accessories', description: 'Computer and phone accessories', sortOrder: 7 },
      { name: 'Gaming', slug: 'gaming', description: 'Gaming peripherals and gear', sortOrder: 8 },
      { name: 'Networking', slug: 'networking', description: 'Networking equipment', sortOrder: 9 },
      { name: 'Storage', slug: 'storage', description: 'Storage devices', sortOrder: 10 },
      { name: 'Camera', slug: 'camera', description: 'Cameras and photography', sortOrder: 11 },
      { name: 'Audio', slug: 'audio', description: 'Headphones and speakers', sortOrder: 12 },
      { name: 'TV', slug: 'tv', description: 'Televisions', sortOrder: 13 },
      { name: 'Appliance', slug: 'appliance', description: 'Home appliances', sortOrder: 14 },
      { name: 'Software', slug: 'software', description: 'Software and licenses', sortOrder: 15 },
    ]

    // Insert categories
    const createdCategories = await db.category.createMany({
      data: defaultCategories,
      skipDuplicates: true,
    })

    return NextResponse.json({ 
      message: "Categories seeded successfully",
      count: createdCategories.count
    }, { status: 201 })
  } catch (error) {
    console.error("Error seeding categories:", error)
    return NextResponse.json(
      { error: "Failed to seed categories", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        sortOrder: true,
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json({
      categories,
      count: categories.length
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}
