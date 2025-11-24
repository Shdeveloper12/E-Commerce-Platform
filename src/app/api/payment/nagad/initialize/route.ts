import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Nagad Payment Gateway Configuration
const NAGAD_CONFIG = {
  // Sandbox/Production URLs
  BASE_URL: process.env.NAGAD_MODE === 'production' 
    ? 'https://api.mynagad.com' 
    : 'http://sandbox.mynagad.com:10080',
  
  MERCHANT_ID: process.env.NAGAD_MERCHANT_ID || 'YOUR_MERCHANT_ID',
  MERCHANT_NUMBER: process.env.NAGAD_MERCHANT_NUMBER || 'YOUR_MERCHANT_NUMBER',
  PUBLIC_KEY: process.env.NAGAD_PUBLIC_KEY || '',
  PRIVATE_KEY: process.env.NAGAD_PRIVATE_KEY || '',
  
  // Callback URLs
  CALLBACK_URL: process.env.NEXT_PUBLIC_BASE_URL + '/api/payment/nagad/callback',
}

// Generate Nagad signature
function generateSignature(data: string): string {
  try {
    const sign = crypto.createSign('SHA256')
    sign.update(data)
    sign.end()
    return sign.sign(NAGAD_CONFIG.PRIVATE_KEY, 'base64')
  } catch (error) {
    console.error('Signature generation error:', error)
    throw new Error('Failed to generate signature')
  }
}

// Encrypt sensitive data with Nagad public key
function encryptWithPublicKey(data: string): string {
  try {
    const buffer = Buffer.from(data, 'utf8')
    const encrypted = crypto.publicEncrypt(
      {
        key: NAGAD_CONFIG.PUBLIC_KEY,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer
    )
    return encrypted.toString('base64')
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

// Generate random string for order ID
function generateOrderId(): string {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, customerName, customerPhone } = body

    // Validate inputs
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Step 1: Initialize payment
    const timestamp = Date.now().toString()
    const merchantOrderId = orderId || generateOrderId()
    
    const sensitiveData = {
      merchantId: NAGAD_CONFIG.MERCHANT_ID,
      datetime: timestamp,
      orderId: merchantOrderId,
      challenge: crypto.randomBytes(32).toString('hex'),
    }

    const sensitiveDataString = JSON.stringify(sensitiveData)
    const signature = generateSignature(sensitiveDataString)

    // Step 2: Call Nagad Initialize API
    const initializePayload = {
      accountNumber: NAGAD_CONFIG.MERCHANT_NUMBER,
      dateTime: timestamp,
      sensitiveData: encryptWithPublicKey(sensitiveDataString),
      signature: signature,
    }

    const initializeResponse = await fetch(
      `${NAGAD_CONFIG.BASE_URL}/remote-payment-gateway-1.0/api/dfs/check-out/initialize/${NAGAD_CONFIG.MERCHANT_ID}/${merchantOrderId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KM-Api-Version': 'v-0.2.0',
          'X-KM-IP-V4': request.headers.get('x-forwarded-for') || '127.0.0.1',
          'X-KM-Client-Type': 'PC_WEB',
        },
        body: JSON.stringify(initializePayload),
      }
    )

    if (!initializeResponse.ok) {
      throw new Error('Failed to initialize Nagad payment')
    }

    const initializeData = await initializeResponse.json()

    // Step 3: Complete payment request
    const paymentData = {
      merchantId: NAGAD_CONFIG.MERCHANT_ID,
      orderId: merchantOrderId,
      currencyCode: '050', // BDT currency code
      amount: amount.toString(),
      challenge: initializeData.challenge,
    }

    const paymentDataString = JSON.stringify(paymentData)
    const paymentSignature = generateSignature(paymentDataString)

    const completePayload = {
      merchantId: NAGAD_CONFIG.MERCHANT_ID,
      orderId: merchantOrderId,
      currencyCode: '050',
      amount: amount.toString(),
      challenge: initializeData.challenge,
      callBackUrl: NAGAD_CONFIG.CALLBACK_URL,
      additionalMerchantInfo: {
        customerName: customerName || 'Customer',
        customerPhone: customerPhone || '',
      },
      sensitiveData: encryptWithPublicKey(paymentDataString),
      signature: paymentSignature,
    }

    const completeResponse = await fetch(
      `${NAGAD_CONFIG.BASE_URL}/remote-payment-gateway-1.0/api/dfs/check-out/complete/${initializeData.paymentReferenceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-KM-Api-Version': 'v-0.2.0',
          'X-KM-IP-V4': request.headers.get('x-forwarded-for') || '127.0.0.1',
          'X-KM-Client-Type': 'PC_WEB',
        },
        body: JSON.stringify(completePayload),
      }
    )

    if (!completeResponse.ok) {
      throw new Error('Failed to complete Nagad payment request')
    }

    const completeData = await completeResponse.json()

    // Return the payment URL for redirect
    return NextResponse.json({
      success: true,
      paymentUrl: completeData.callBackUrl,
      paymentReferenceId: initializeData.paymentReferenceId,
      orderId: merchantOrderId,
    })

  } catch (error) {
    console.error('Nagad payment error:', error)
    return NextResponse.json(
      { 
        error: 'Payment initialization failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
