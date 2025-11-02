import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    console.log("📝 Registration attempt:", { email, name })

    // Validation
    if (!email || !password || !name) {
      console.error("❌ Validation failed: Missing required fields")
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      console.error("❌ Validation failed: Password too short")
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Check if user already exists
    console.log("🔍 Checking if user exists...")
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.error("❌ User already exists:", email)
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash password
    console.log("🔐 Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    console.log("👤 Creating user...")
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })
    console.log("✅ User created:", user.id)

    // Create free subscription for user
    console.log("💳 Creating subscription...")
    await db.subscription.create({
      data: {
        userId: user.id,
        planType: "FREE",
        status: "ACTIVE",
      }
    })
    console.log("✅ Subscription created")

    console.log("🎉 Registration successful:", user.email)
    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })
  } catch (error: any) {
    console.error("❌ Registration error:", error)
    console.error("Error name:", error?.name)
    console.error("Error message:", error?.message)
    console.error("Error code:", error?.code)
    console.error("Error stack:", error?.stack)
    
    // Prisma specific errors
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }
    
    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: "Database foreign key constraint failed" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    )
  }
}