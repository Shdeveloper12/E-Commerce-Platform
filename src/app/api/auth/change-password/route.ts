import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required.' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      )
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect.' },
        { status: 400 }
      )
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.passwordHash
    )

    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password.' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password in database
    await db.user.update({
      where: {
        email: session.user.email
      },
      data: {
        passwordHash: hashedPassword,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(
      { message: 'Password updated successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating password. Please try again.' },
      { status: 500 }
    )
  }
}
