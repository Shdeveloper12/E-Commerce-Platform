/**
 * Nagad Payment Testing Utilities
 * Use these functions to test your Nagad integration
 */

// Test Nagad credentials configuration
export function testNagadConfig() {
  const config = {
    mode: process.env.NAGAD_MODE,
    merchantId: process.env.NAGAD_MERCHANT_ID,
    merchantNumber: process.env.NAGAD_MERCHANT_NUMBER,
    hasPublicKey: !!process.env.NAGAD_PUBLIC_KEY,
    hasPrivateKey: !!process.env.NAGAD_PRIVATE_KEY,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  }

  console.log('Nagad Configuration Check:')
  console.log('='.repeat(50))
  console.log('Mode:', config.mode || '❌ NOT SET')
  console.log('Merchant ID:', config.merchantId || '❌ NOT SET')
  console.log('Merchant Number:', config.merchantNumber || '❌ NOT SET')
  console.log('Public Key:', config.hasPublicKey ? '✅ SET' : '❌ NOT SET')
  console.log('Private Key:', config.hasPrivateKey ? '✅ SET' : '❌ NOT SET')
  console.log('Base URL:', config.baseUrl || '❌ NOT SET')
  console.log('='.repeat(50))

  const allSet = 
    config.mode &&
    config.merchantId &&
    config.merchantNumber &&
    config.hasPublicKey &&
    config.hasPrivateKey &&
    config.baseUrl

  if (allSet) {
    console.log('✅ All Nagad configurations are set!')
  } else {
    console.log('❌ Some Nagad configurations are missing!')
  }

  return allSet
}

// Sandbox test credentials
export const NAGAD_TEST_DATA = {
  sandbox: {
    successPhone: '01711428801',
    failedPhone: '01711428802',
    merchantId: '683002007104225',
    merchantNumber: '01711428801',
  },
  testAmounts: {
    small: 100,
    medium: 1000,
    large: 10000,
  },
  testOrders: [
    {
      orderId: 'TEST001',
      amount: 500,
      customerName: 'Test Customer',
      customerPhone: '01711428801',
    },
    {
      orderId: 'TEST002',
      amount: 1500,
      customerName: 'Jane Doe',
      customerPhone: '01711428801',
    },
  ],
}

// Generate test order data
export function generateTestOrder() {
  return {
    orderId: 'TEST' + Date.now(),
    amount: Math.floor(Math.random() * 5000) + 100,
    customerName: 'Test Customer ' + Math.floor(Math.random() * 100),
    customerPhone: NAGAD_TEST_DATA.sandbox.successPhone,
  }
}

// Test payment initialization
export async function testPaymentInitialization() {
  const testOrder = generateTestOrder()
  
  console.log('Testing Payment Initialization...')
  console.log('Test Order:', testOrder)

  try {
    const response = await fetch('/api/payment/nagad/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testOrder),
    })

    const data = await response.json()

    if (data.success) {
      console.log('✅ Payment initialization successful!')
      console.log('Payment URL:', data.paymentUrl)
      console.log('Reference ID:', data.paymentReferenceId)
      return data
    } else {
      console.log('❌ Payment initialization failed!')
      console.log('Error:', data.error)
      return null
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error)
    return null
  }
}

// Validate payment callback
export function validateCallbackParams(searchParams: URLSearchParams) {
  const paymentRefId = searchParams.get('payment_ref_id')
  const status = searchParams.get('status')
  const orderId = searchParams.get('order_id')

  console.log('Validating Callback Parameters...')
  console.log('Payment Ref ID:', paymentRefId || '❌ MISSING')
  console.log('Status:', status || '❌ MISSING')
  console.log('Order ID:', orderId || '❌ MISSING')

  const isValid = !!paymentRefId && !!status && !!orderId

  if (isValid) {
    console.log('✅ Callback parameters are valid')
  } else {
    console.log('❌ Some callback parameters are missing')
  }

  return {
    isValid,
    paymentRefId,
    status,
    orderId,
  }
}

// Format currency for display
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Check if running in development
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Check if using sandbox
export function isSandbox(): boolean {
  return process.env.NAGAD_MODE !== 'production'
}

export default {
  testNagadConfig,
  NAGAD_TEST_DATA,
  generateTestOrder,
  testPaymentInitialization,
  validateCallbackParams,
  formatCurrency,
  isDevelopment,
  isSandbox,
}
