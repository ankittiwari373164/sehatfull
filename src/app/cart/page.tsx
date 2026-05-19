'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react'
import { useCartStore } from '@/lib/cartStore'

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center py-20 px-4">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-primary-500" />
          </div>
          <h2 className="font-display text-3xl font-bold text-secondary-800 mb-3">Your Cart is Empty</h2>
          <p className="text-secondary-500 mb-8">Add some delicious healthy snacks to get started!</p>
          <Link href="/shop"><button className="btn-primary px-10 py-4">Continue Shopping</button></Link>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const shipping = subtotal >= 499 ? 0 : 50
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-[#2c1f0e] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <p className="text-secondary-300 mt-1 text-sm">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {shipping === 0 && (
              <div className="bg-forest-500 text-white rounded-lg px-5 py-3 text-sm flex items-center gap-2 font-semibold">
                <Truck size={16} /> 🎉 You qualify for free shipping!
              </div>
            )}
            {shipping > 0 && (
              <div className="bg-primary-50 border border-primary-200 rounded-lg px-5 py-3 text-sm flex items-center gap-2 text-primary-700">
                <Truck size={16} /> Add ₹{499 - subtotal} more for free shipping!
              </div>
            )}

            {items.map((item) => (
              <motion.div
                key={item.product.id}
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-xl border border-primary-100 p-5 flex gap-5"
              >
                <Link href={`/product/${item.product.slug}`} className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100">
                  <Image
                    src={
                      item.product.images && item.product.images.length > 0
                        ? [...item.product.images].sort((a, b) => a.display_order - b.display_order)[0].image_url
                        : '/placeholder.jpg'
                    }
                    alt={item.product.name} fill className="object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-0.5">{item.product.category}</div>
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="font-display font-bold text-secondary-800 hover:text-primary-600 transition-colors line-clamp-1">{item.product.name}</h3>
                      </Link>
                      <p className="text-xs text-secondary-400 mt-0.5">{item.product.weight}</p>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-secondary-300 hover:text-red-500 transition-colors flex-shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-cream-100 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white transition-colors text-secondary-600">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-secondary-800">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white transition-colors text-secondary-600">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-display font-bold text-secondary-800 text-lg">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-primary-100 p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-secondary-800 mb-6">Order Summary</h2>

              <div className="space-y-3 pb-5 border-b border-primary-100">
                <div className="flex justify-between text-sm text-secondary-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Shipping</span>
                  <span className={shipping === 0 ? 'text-forest-600 font-bold' : 'text-secondary-600'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between font-display font-bold text-secondary-800 text-xl py-4">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>

              <Link href="/checkout">
                <button className="w-full btn-primary justify-center py-4 text-sm">
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
              </Link>

              <Link href="/shop">
                <button className="w-full mt-3 btn-outline justify-center py-3 text-xs">
                  Continue Shopping
                </button>
              </Link>

              {/* Trust */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-secondary-500">
                  <ShieldCheck size={14} className="text-primary-500" /> Secure checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-secondary-500">
                  <Truck size={14} className="text-primary-500" /> Free shipping above ₹499
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}