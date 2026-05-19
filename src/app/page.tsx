'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, ArrowRight, Star, Shield, CheckCircle, Quote, Leaf, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

const categories = [
  { name: 'Morning Nourishment', emoji: '🌅', slug: 'Morning+Nourishment', bg: '#fef3e2' },
  { name: 'Post-Workout Recovery', emoji: '💪', slug: 'Post+Workout+Recovery', bg: '#e8f5e9' },
  { name: 'Family Wellness', emoji: '👨‍👩‍👧', slug: 'Family+Wellness', bg: '#fce4ec' },
  { name: 'Sunnah Superfoods', emoji: '🌿', slug: 'Sunnah+Superfoods', bg: '#e8f5e9' },
  { name: 'Gift a Cure', emoji: '🎁', slug: 'Gift+a+Cure', bg: '#fff8e1' },
  { name: 'Daily Tonic', emoji: '🏺', slug: 'Daily+Tonic', bg: '#f3e5f5' },
]

const trustFeatures = [
  { icon: Leaf, label: 'Prophetic Medicine', desc: 'Rooted in Sunnah' },
  { icon: Heart, label: '100% Pure', desc: 'No Fillers or Additives' },
  { icon: Truck, label: 'Pan India Delivery', desc: 'Fast & Reliable' },
  { icon: Shield, label: 'Lab Tested', desc: 'Quality Guaranteed' },
]

const stats = [
  { value: '5,000+', label: 'Families Served' },
  { value: '20,000+', label: 'Orders Delivered' },
  { value: '100%', label: 'Natural Ingredients' },
  { value: '4.9/5', label: 'Customer Rating' },
]

const testimonials = [
  { name: 'Fatima Khan', role: 'Mother of Three', content: 'Sehatfull Talbeena has become our morning ritual. My children love it and I feel confident about what I\'m feeding them every day.', rating: 5 },
  { name: 'Dr. Imran Siddiqui', role: 'Physician', content: 'I recommend Takmeeli Talbeena to my patients recovering from illness. The barley-based formula is gentle, nourishing and truly effective.', rating: 5 },
  { name: 'Rukhsana Ansari', role: 'Yoga & Wellness Coach', content: 'A wholesome start to every morning. The traditional recipe, pure ingredients — you can feel the difference from day one.', rating: 5 },
]

const whyUs = [
  'Prepared from authentic Sunnah recipe of Talbeena',
  'Premium barley sourced from clean, trusted farms',
  'Takmeeli formula — complete nourishment in every serving',
  'No artificial preservatives, colors, or flavors — ever',
  'Convenient packaging for home, travel, and gifting',
  'Tested & trusted by families across India',
]

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, image_url, alt_text, display_order),
          flavors:product_flavors(id, flavor_name, price_modifier, stock)
        `)
        .limit(6)
        .order('created_at', { ascending: false })

      setProducts(error ? [] : (data || []))
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}>

      {/* HERO */}
      <section
        className="relative min-h-[90vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #1a3a2a 0%, #2d5a3d 50%, #3d7a50 100%)' }}
      >
        {/* Subtle grain texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5e6c8' fill-opacity='1'%3E%3Cpath d='M0 0h4v4H0V0zm8 8h4v4H8V8zm8-8h4v4h-4V0zm8 8h4v4h-4V8zm8-8h4v4h-4V0zm8 8h4v4h-4V8zm8-8h4v4h-4V0zm8 8h4v4h-4V8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        {/* Warm glow */}
        <div
          className="absolute left-1/2 top-1/2 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #c8a96e, transparent 70%)', transform: 'translate(-50%, -50%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 grid md:grid-cols-2 gap-14 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 border"
              style={{ background: 'rgba(200,169,110,0.15)', color: '#e8d5a3', borderColor: 'rgba(200,169,110,0.35)' }}
            >
              🌿 Prophetic Nourishment, Rediscovered
            </motion.span>

            <h1
              className="font-bold leading-tight mb-3"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#f5ece0', letterSpacing: '-0.01em' }}
            >
              Sehatfull<br />
              <span style={{ color: '#c8a96e' }}>Foods</span>
            </h1>
            <h2
              className="italic mb-6"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', color: '#a8c8a0', fontWeight: 400 }}
            >
              Takmeeli Talbeena — Heal from Within
            </h2>
            <p className="mb-8 leading-relaxed max-w-md" style={{ color: '#c8d8c0', fontSize: '1.05rem' }}>
              Rooted in the Sunnah. Crafted with care.{' '}
              <span style={{ color: '#e8d5a3', fontWeight: 600 }}>
                Pure barley, honey & natural herbs —
              </span>{' '}
              the time-honoured tonic for strength, recovery and daily wellbeing.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <button
                  className="flex items-center gap-2 font-semibold px-8 py-4 rounded-lg transition-all hover:opacity-90 group"
                  style={{ background: '#c8a96e', color: '#1a3a2a', fontSize: '0.9rem', letterSpacing: '0.05em' }}
                >
                  Shop Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/about">
                <button
                  className="font-semibold px-8 py-4 rounded-lg border-2 transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#f0e8d8', fontSize: '0.85rem', letterSpacing: '0.08em' }}
                >
                  Our Story
                </button>
              </Link>
            </div>

            <div className="flex gap-10 mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {[['5K+', 'Families'], ['20K+', 'Orders'], ['4.9★', 'Rating']].map(([val, lbl]) => (
                <div key={lbl}>
                  <div className="font-bold" style={{ fontSize: '1.6rem', color: '#c8a96e' }}>{val}</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: '#8aab88', marginTop: '2px' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="relative w-[360px] h-[360px]">
              <div
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'rgba(200,169,110,0.2)', animation: 'spin 24s linear infinite' }}
              />
              <div
                className="absolute inset-6 rounded-full border"
                style={{ borderColor: 'rgba(200,169,110,0.12)' }}
              />
              <div
                className="absolute inset-14 rounded-full flex items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.18), transparent)' }}
              >
                <span className="text-[110px] select-none" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>🌾</span>
              </div>
              {[
                { emoji: '🏺', pos: 'top-4 left-10', delay: 0 },
                { emoji: '🍯', pos: 'top-14 right-0', delay: 0.4 },
                { emoji: '🌿', pos: 'bottom-14 right-2', delay: 0.8 },
                { emoji: '💧', pos: 'bottom-4 left-12', delay: 1.2 },
              ].map(({ emoji, pos, delay }) => (
                <motion.div
                  key={emoji}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, delay, repeat: Infinity }}
                  className={`absolute ${pos} text-3xl`}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 55 960 0 720 30C480 60 240 5 0 40Z" fill="#fdf8f1"/>
          </svg>
        </div>
      </section>

      {/* TRUST BAR */}
      <section style={{ background: '#fdf8f1', borderBottom: '1px solid #ede0cc' }} className="py-7">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#e8f0e4' }}
                >
                  <f.icon size={18} style={{ color: '#3d7a50' }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#2d3a28' }}>{f.label}</div>
                  <div className="text-xs" style={{ color: '#7a8c74' }}>{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: '#3d7a50' }}
            >
              Browse By Occasion
            </span>
            <h2 className="font-bold mb-3" style={{ fontSize: '2.2rem', color: '#1e2e1a', fontFamily: 'Georgia, serif' }}>
              Our Collection
            </h2>
            <p className="mx-auto max-w-lg text-base" style={{ color: '#7a8c74' }}>
              Six purposeful blends — each crafted for a specific need in your life
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <Link href={`/shop?cat=${cat.slug}`}>
                  <div className="group text-center cursor-pointer">
                    <div
                      className="rounded-2xl p-6 mb-3 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: cat.bg, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
                    >
                      {cat.emoji}
                    </div>
                    <h3
                      className="font-semibold text-sm leading-tight transition-colors"
                      style={{ color: '#2d3a28', fontFamily: 'Georgia, serif' }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS - SECTION 1: ELEGANT GRID */}
      <section className="py-20" style={{ background: '#f5ede0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-2"
                style={{ color: '#3d7a50' }}
              >
                Best Sellers
              </span>
              <h2 className="font-bold" style={{ fontSize: '2rem', color: '#1e2e1a', fontFamily: 'Georgia, serif' }}>
                Featured Favorites
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:flex items-center gap-2 font-semibold text-sm uppercase tracking-wider transition-all hover:gap-3"
              style={{ color: '#2d5a3d' }}
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl overflow-hidden animate-pulse" style={{ background: '#ede0cc' }}>
                  <div className="aspect-square" style={{ background: '#e0d0b8' }} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 rounded w-1/3" style={{ background: '#d8c8ac' }} />
                    <div className="h-5 rounded" style={{ background: '#d8c8ac' }} />
                    <div className="h-4 rounded w-2/3" style={{ background: '#d8c8ac' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20" style={{ color: '#a89880' }}>
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-40" />
              <p className="text-xl font-semibold" style={{ fontFamily: 'Georgia, serif' }}>Products coming soon!</p>
              <p className="text-sm mt-2">Our premium Talbeena collection is being prepared.</p>
            </div>
          )}
        </div>
      </section>

      {/* PRODUCT SHOWCASE - SECTION 2: ALTERNATING CARDS */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: '#3d7a50' }}
            >
              Complete Range
            </span>
            <h2 className="font-bold" style={{ fontSize: '2rem', color: '#1e2e1a', fontFamily: 'Georgia, serif' }}>
              Discover Our Full Collection
            </h2>
          </div>

          {products.length > 3 && (
            <div className="space-y-8">
              {products.slice(3, 6).map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex gap-8 items-center ${idx % 2 === 1 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <div
                      className="rounded-2xl overflow-hidden aspect-square"
                      style={{ background: '#e8f0e4' }}
                    >
                      {product.images?.[0]?.image_url ? (
                        <img
                          src={product.images[0].image_url}
                          alt={product.images[0].alt_text || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag size={64} style={{ color: '#3d7a50', opacity: 0.2 }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 py-6">
                    <h3
                      className="font-bold text-2xl mb-2"
                      style={{ color: '#1e2e1a', fontFamily: 'Georgia, serif' }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm leading-relaxed mb-6"
                      style={{ color: '#7a8c74' }}
                    >
                      {product.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      {product.flavors?.slice(0, 2).map((flavor: any) => (
                        <div key={flavor.id} className="flex justify-between items-center">
                          <span style={{ color: '#5a6e54' }}>{flavor.flavor_name}</span>
                          <span
                            className="font-bold"
                            style={{ color: '#c8a96e' }}
                          >
                            ₹{flavor.price_modifier}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link href="/shop">
                      <button
                        className="font-semibold px-6 py-3 rounded-lg transition-all"
                        style={{ background: '#3d7a50', color: '#f5ece0', fontSize: '0.9rem' }}
                      >
                        Learn More
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div
                className="aspect-square rounded-3xl overflow-hidden flex items-center justify-center text-[160px] select-none"
                style={{ background: 'linear-gradient(135deg, #e8f0e4, #f5e8d0)' }}
              >
                🌾
              </div>
              <div
                className="absolute -top-4 -right-4 text-white rounded-2xl p-4 shadow-xl text-center"
                style={{ background: '#2d5a3d' }}
              >
                <div className="font-bold" style={{ fontSize: '1.8rem' }}>0%</div>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a8c8a0' }}>Artificial</div>
              </div>
              <div
                className="absolute -bottom-4 -left-4 text-white rounded-2xl p-4 shadow-xl text-center"
                style={{ background: '#c8a96e' }}
              >
                <div className="font-bold" style={{ fontSize: '1.8rem', color: '#1e2e1a' }}>100%</div>
                <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#3d2a10' }}>Pure</div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#3d7a50' }}
              >
                Our Promise
              </span>
              <h2
                className="font-bold mb-4"
                style={{ fontSize: '2rem', color: '#1e2e1a', fontFamily: 'Georgia, serif' }}
              >
                Why Choose Sehatfull?
              </h2>
              <p className="mb-8 leading-relaxed" style={{ color: '#7a8c74', fontSize: '1.02rem' }}>
                We carry forward a tradition of care — Talbeena prepared the way it was always meant to be. Pure, complete, and given with sincerity.
              </p>
              <div className="space-y-3">
                {whyUs.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-green-50"
                  >
                    <CheckCircle size={17} className="flex-shrink-0 mt-0.5" style={{ color: '#3d7a50' }} />
                    <span className="text-sm" style={{ color: '#2d3a28' }}>{item}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/about">
                  <button
                    className="flex items-center gap-2 font-semibold px-7 py-3.5 rounded-lg transition-all hover:opacity-90"
                    style={{ background: '#c8a96e', color: '#1e2e1a', fontSize: '0.9rem' }}
                  >
                    Learn Our Story <ArrowRight size={15} />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-14" style={{ background: '#2d5a3d' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="font-bold mb-1"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#c8a96e', fontFamily: 'Georgia, serif' }}
                >
                  {s.value}
                </div>
                <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#a8c8a0' }}>
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20" style={{ background: '#f5ede0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: '#3d7a50' }}
            >
              Simple Process
            </span>
            <h2
              className="font-bold"
              style={{ fontSize: '2.1rem', color: '#1e2e1a', fontFamily: 'Georgia, serif' }}
            >
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { n: '01', icon: '🛍️', title: 'Choose Your Pack', desc: 'Select from our range of Takmeeli Talbeena blends crafted for your need' },
              { n: '02', icon: '📦', title: 'Place Your Order', desc: 'Simple checkout, secure payment, and fast delivery across India' },
              { n: '03', icon: '🌾', title: 'Nourish & Repeat', desc: 'Receive your pure Talbeena at your door — and feel the difference daily' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2"
                    style={{ background: '#fdf8f1', borderColor: '#e0cdb0', boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
                  >
                    {item.icon}
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{ background: '#3d7a50', color: '#fff' }}
                  >
                    {item.n}
                  </div>
                </div>
                <h3
                  className="font-bold text-xl mb-2"
                  style={{ color: '#1e2e1a', fontFamily: 'Georgia, serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#7a8c74' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: '#3d7a50' }}
            >
              Happy Customers
            </span>
            <h2
              className="font-bold"
              style={{ fontSize: '2.1rem', color: '#1e2e1a', fontFamily: 'Georgia, serif' }}
            >
              What Our Customers Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-7 relative"
                style={{ background: '#f5ede0', border: '1px solid #e0cdb0' }}
              >
                <Quote size={28} className="absolute top-5 right-5" style={{ color: '#c8a96e', opacity: 0.4 }} />
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} style={{ color: '#c8a96e', fill: '#c8a96e' }} />
                  ))}
                </div>
                <p
                  className="text-sm leading-relaxed italic mb-5"
                  style={{ color: '#5a6e54', fontFamily: 'Georgia, serif' }}
                >
                  "{t.content}"
                </p>
                <div>
                  <div className="font-bold" style={{ color: '#1e2e1a', fontFamily: 'Georgia, serif' }}>{t.name}</div>
                  <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: '#9aab90' }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #1a3a2a, #2d5a3d)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8a96e' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2
              className="font-bold mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#f5ece0', fontFamily: 'Georgia, serif' }}
            >
              Begin Your Journey to Sehat Today
            </h2>
            <p className="text-lg mb-8" style={{ color: '#a8c8a0' }}>
              Free shipping on orders above ₹499. Join thousands of families who trust Sehatfull.
            </p>
            <Link href="/shop">
              <button
                className="flex items-center gap-2 mx-auto font-semibold px-10 py-4 rounded-lg transition-all hover:opacity-90"
                style={{ background: '#c8a96e', color: '#1e2e1a', fontSize: '0.95rem' }}
              >
                Shop Now <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}