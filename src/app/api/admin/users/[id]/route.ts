import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// Update user role (ADMIN only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    // Only ADMIN can change user roles
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { role, isActive } = body

    // Validate role
    if (role && !['CUSTOMER', 'MODERATOR', 'ADMIN'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      )
    }

    // Update user
    const user = await db.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}
