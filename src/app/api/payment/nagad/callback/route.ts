import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentRefId = searchParams.get('payment_ref_id')
    const status = searchParams.get('status')
    const orderId = searchParams.get('order_id')

    if (!paymentRefId || !orderId) {
      return NextResponse.redirect(
        new URL('/payment?status=error&message=Invalid callback', request.url)
      )
    }

    // Verify payment status with Nagad
    const verificationUrl = process.env.NAGAD_MODE === 'production'
      ? `https://api.mynagad.com/remote-payment-gateway-1.0/api/dfs/verify/payment/${paymentRefId}`
      : `http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/verify/payment/${paymentRefId}`

    const verificationResponse = await fetch(verificationUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
      },
    })

    if (!verificationResponse.ok) {
      throw new Error('Failed to verify payment')
    }

    const verificationData = await verificationResponse.json()

    // Check if payment was successful
    if (verificationData.status === 'Success') {
      // Update order payment status in database
      try {
        await db.order.update({
          where: { orderNumber: orderId },
          data: {
            paymentStatus: 'PAID',
            paymentMethod: 'NAGAD',
            paymentDetails: {
              paymentRefId,
              transactionId: verificationData.issuerPaymentRefNo,
              amount: verificationData.amount,
              timestamp: new Date().toISOString(),
            },
          },
        })

        // Redirect to success page
        return NextResponse.redirect(
          new URL(`/order-success?orderId=${orderId}`, request.url)
        )
      } catch (dbError) {
        console.error('Database update error:', dbError)
        return NextResponse.redirect(
          new URL(`/order-success?orderId=${orderId}&warning=payment_verified`, request.url)
        )
      }
    } else {
      // Payment failed
      return NextResponse.redirect(
        new URL(`/payment?status=failed&orderId=${orderId}&message=Payment was not successful`, request.url)
      )
    }

  } catch (error) {
    console.error('Nagad callback error:', error)
    return NextResponse.redirect(
      new URL('/payment?status=error&message=Payment verification failed', request.url)
    )
  }
}

export async function POST(request: NextRequest) {
  // Handle POST callback (same logic as GET)
  return GET(request)
}
