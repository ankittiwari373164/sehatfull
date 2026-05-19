'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Truck, Lock, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [paymentSettings, setPaymentSettings] = useState<any>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  })

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setCheckingAuth(false)

      if (!user) {
        // Redirect to login after a short delay
        setTimeout(() => {
          toast.error('Please login to proceed with checkout')
          router.push('/login?redirect=/checkout')
        }, 1000)
        return
      }

      // Pre-fill email
      if (user.email) {
        setFormData(prev => ({ ...prev, email: user.email || '' }))
      }

      // Load payment settings and Razorpay script
      loadPaymentSettings()
      loadRazorpayScript()
    }

    checkAuth()
  }, [router])

  const loadPaymentSettings = async () => {
    try {
      const { data } = await supabase.from('payment_settings').select('*')
      if (data) {
        const settings: any = {}
        data.forEach((s: any) => {
          settings[s.setting_key] = s.setting_value
        })
        setPaymentSettings(settings)
      }
    } catch (error) {
      console.error('Error loading payment settings:', error)
    }
  }

  const loadRazorpayScript = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !data) {
        toast.error('Invalid coupon code')
        return
      }

      // Check expiration
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error('Coupon has expired')
        return
      }

      // Check usage limit
      if (data.usage_limit && data.usage_count >= data.usage_limit) {
        toast.error('Coupon usage limit reached')
        return
      }

      // Check minimum order value
      const subtotal = getTotalPrice()
      if (data.min_order_value && subtotal < data.min_order_value) {
        toast.error(`Minimum order value of ₹${data.min_order_value} required`)
        return
      }

      // Calculate discount
      let discount = 0
      if (data.discount_type === 'percentage') {
        discount = (subtotal * data.discount_value) / 100
        if (data.max_discount) {
          discount = Math.min(discount, data.max_discount)
        }
      } else {
        discount = data.discount_value
      }

      setAppliedCoupon(data)
      setDiscountAmount(discount)
      toast.success('Coupon applied successfully!')
    } catch (error: any) {
      console.error('Error applying coupon:', error)
      toast.error('Failed to apply coupon')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    setCouponCode('')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const createOrder = async (paymentMethod: string, razorpayPaymentId?: string, razorpayOrderId?: string) => {
    try {
      const shippingAddress = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      }

      const finalTotal = getTotalPrice() - discountAmount
      const couponId = appliedCoupon?.id || null

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: finalTotal,
          discount_amount: discountAmount,
          coupon_id: couponId,
          status: paymentMethod === 'cod' ? 'pending' : 'processing',
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'razorpay' ? 'completed' : 'pending',
          razorpay_payment_id: razorpayPaymentId || null,
          razorpay_order_id: razorpayOrderId || null,
          shipping_address: shippingAddress,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        flavor_id: item.flavor?.id || null,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Update coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from('coupons')
          .update({ usage_count: appliedCoupon.usage_count + 1 })
          .eq('id', appliedCoupon.id)
      }

      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/dashboard?order=${order.id}`)
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order. Please try again.')
      throw error
    }
  }

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded || !paymentSettings?.razorpay_key_id) {
      toast.error('Razorpay is not configured')
      return
    }

    try {
      setLoading(true)

      const finalTotal = getTotalPrice() - discountAmount
      const options = {
        key: paymentSettings.razorpay_key_id,
        amount: Math.round(finalTotal * 100), // Amount in paise
        currency: 'INR',
        name: 'Sehatfull Foods',
        description: 'Takmeeli Talbeena Purchase',
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed')
            }

            // Create order in database
            await createOrder('razorpay', response.razorpay_payment_id, response.razorpay_order_id)
          } catch (error: any) {
            console.error('Payment verification error:', error)
            toast.error('Payment verification failed')
          } finally {
            setLoading(false)
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#8B4513',
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error('Razorpay error:', error)
      toast.error('Failed to initialize payment')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form
      if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
        toast.error('Please fill all required fields')
        setLoading(false)
        return
      }

      if (formData.paymentMethod === 'razorpay') {
        // Handle Razorpay payment
        await handleRazorpayPayment()
      } else {
        // Handle COD
        await createOrder('cod')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed. Please try again.')
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-8 max-w-md w-full text-center"
        >
          <AlertCircle size={48} className="mx-auto mb-4 text-red-600" />
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">
            You must be logged in to proceed with checkout. Please log in to your account or create a new one.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/login?redirect=/checkout')}
              className="w-full btn-primary py-3"
            >
              Go to Login
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="w-full btn-outline py-3"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  const finalTotal = getTotalPrice() - discountAmount

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl font-bold text-secondary-800 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Information */}
                <div className="bg-white rounded-xl border border-primary-100 p-6">
                  <div className="flex items-center mb-6">
                    <Truck className="text-primary-600 mr-2" size={24} />
                    <h2 className="font-display text-xl font-bold text-secondary-800">Shipping Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2">Address *</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">PIN Code *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{6}"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl border border-primary-100 p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="text-primary-600 mr-2" size={24} />
                    <h2 className="font-display text-xl font-bold text-secondary-800">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive the product</p>
                      </div>
                    </label>

                    <label className={`flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors ${!paymentSettings?.razorpay_key_id ? 'opacity-50' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleChange}
                        disabled={!paymentSettings?.razorpay_key_id}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Online Payment (Razorpay)</p>
                        <p className="text-sm text-gray-600">Pay securely with cards, UPI, wallets & more</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center disabled:opacity-50"
                >
                  <Lock size={20} className="mr-2" />
                  {loading ? 'Processing...' : formData.paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        {item.flavor && <p className="text-sm text-gray-600">{item.flavor.flavor_name}</p>}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{item.product.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="mb-6 pb-6 border-b">
                  <label className="block text-sm font-semibold mb-2">Apply Coupon Code</label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="input-field flex-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={loading}
                        className="btn-outline px-3 text-sm whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 p-3 rounded flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-700">-₹{discountAmount.toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}