'use client'

import { motion } from 'framer-motion'
import { Heart, Leaf, Award, Users, Droplets, Zap, BookOpen, Smile } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import Link from 'next/link'

export default function AboutPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

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

  const values = [
    {
      icon: Heart,
      title: 'Pure & Authentic',
      description: 'Crafted from the sacred Sunnah recipe of Talbeena — no shortcuts, no compromises',
      gradient: 'from-rose-100 to-pink-100',
      accentColor: '#e85d75',
    },
    {
      icon: Leaf,
      title: 'Natural Goodness',
      description: 'Premium barley, pure honey, and herbs from trusted farms — zero artificial additives',
      gradient: 'from-emerald-100 to-green-100',
      accentColor: '#3d7a50',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Lab-tested, family-trusted, and recommended by wellness experts across India',
      gradient: 'from-amber-100 to-yellow-100',
      accentColor: '#c8a96e',
    },
    {
      icon: Users,
      title: 'Community Care',
      description: 'Serving 5,000+ families with love — your health is our mission',
      gradient: 'from-blue-100 to-cyan-100',
      accentColor: '#2d5a3d',
    },
  ]

  const benefits = [
    { icon: Droplets, title: 'Hydration & Strength', desc: 'Natural barley water restores fluids and energy' },
    { icon: Zap, title: 'Quick Recovery', desc: 'Specially formulated for post-illness wellness' },
    { icon: BookOpen, title: 'Prophetic Wisdom', desc: 'Rooted in Islamic teachings of healing' },
    { icon: Smile, title: 'Daily Vitality', desc: 'A gentle tonic for sustained wellbeing' },
  ]

  const storyMilestones = [
    { year: '2020', title: 'The Vision', desc: 'A family discovers the healing power of authentic Talbeena' },
    { year: '2021', title: 'The Research', desc: 'Months of studying Sunnah recipes and traditional methods' },
    { year: '2022', title: 'The Launch', desc: 'First batch crafted with pure barley and careful attention' },
    { year: '2024', title: 'The Movement', desc: 'Now trusted by thousands across India' },
  ]

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Georgia', 'Palatino Linotype', serif" }}>
      {/* HERO SECTION */}
      <section
        className="relative min-h-[85vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #2d5a3d 0%, #3d7a50 50%, #1a3a2a 100%)' }}
      >
        {/* Decorative grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f5e6c8' fill-opacity='1'%3E%3Cpath d='M0 0h4v4H0V0zm8 8h4v4H8V8zm8-8h4v4h-4V0zm8 8h4v4h-4V8zm8-8h4v4h-4V0zm8 8h4v4h-4V8zm8-8h4v4h-4V0zm8 8h4v4h-4V8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Warm glow background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 1000px 500px at 50% 0%, rgba(200,169,110,0.1), transparent 70%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-12 py-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-xs font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 border"
              style={{ background: 'rgba(200,169,110,0.15)', color: '#e8d5a3', borderColor: 'rgba(200,169,110,0.35)' }}
            >
              ✨ The Story Behind Sehatfull
            </motion.span>

            <h1
              className="font-bold leading-tight mb-6 max-w-4xl"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#f5ece0', letterSpacing: '-0.02em' }}
            >
              Reviving Ancient Wisdom for Modern Wellness
            </h1>

            <p
              className="max-w-3xl leading-relaxed mb-8"
              style={{ fontSize: '1.15rem', color: '#c8d8c0' }}
            >
              Sehatfull Foods is born from a simple belief: <span style={{ color: '#e8d5a3', fontWeight: 600 }}>healing is our birthright</span>. We're bringing back the forgotten treasure of Talbeena — a Prophetic superfood that nourished generations — crafted with absolute purity and deep reverence for its origins.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <button
                  className="flex items-center gap-2 font-semibold px-8 py-4 rounded-lg transition-all hover:opacity-90"
                  style={{ background: '#c8a96e', color: '#1a3a2a', fontSize: '0.95rem', letterSpacing: '0.05em' }}
                >
                  Explore Products
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 30C1200 70 960 10 720 40C480 70 240 20 0 50Z" fill="#fdf8f1" />
          </svg>
        </div>
      </section>

      {/* OUR MISSION & VISION */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div
                className="relative rounded-3xl overflow-hidden h-[450px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e8f0e4 0%, #f5e8d0 100%)' }}
              >
                <div className="text-center">
                  <span className="text-[140px] block" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>
                    🌾
                  </span>
                  <p
                    className="text-lg font-semibold mt-4"
                    style={{ color: '#2d5a3d', fontFamily: "'Georgia', serif" }}
                  >
                    Golden Barley,<br />
                    Timeless Healing
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: '#3d7a50' }}
              >
                Our Foundation
              </span>

              <h2
                className="font-bold mb-6"
                style={{ fontSize: '2.4rem', color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
              >
                Mission & Vision
              </h2>

              <div className="space-y-5 mb-8">
                <div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: '#2d5a3d', fontFamily: "'Georgia', serif" }}
                  >
                    🎯 Our Mission
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: '#5a6e54', fontSize: '1.02rem' }}
                  >
                    To restore the wisdom of prophetic nutrition by creating pure, authentic Talbeena that nourishes bodies and honors our Islamic heritage.
                  </p>
                </div>

                <div>
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: '#2d5a3d', fontFamily: "'Georgia', serif" }}
                  >
                    ✨ Our Vision
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: '#5a6e54', fontSize: '1.02rem' }}
                  >
                    Every household in India recognizes Talbeena as the ultimate wellness superfood — trusted, affordable, and accessible to all who seek natural healing.
                  </p>
                </div>
              </div>

              <div
                className="p-5 rounded-2xl border-l-4"
                style={{ background: '#f5ede0', borderColor: '#c8a96e' }}
              >
                <p style={{ color: '#5a6e54', fontSize: '0.95rem' }}>
                  <span style={{ color: '#3d7a50', fontWeight: 600 }}>"Talbeena for the ummah,</span> as it was prescribed for the Prophet ﷺ — that's what drives us every single day."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20" style={{ background: '#f5ede0' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#3d7a50' }}
              >
                What We Stand For
              </span>
              <h2
                className="font-bold"
                style={{ fontSize: '2.3rem', color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
              >
                Our Core Values
              </h2>
              <p
                className="mx-auto max-w-2xl mt-4 leading-relaxed"
                style={{ color: '#7a8c74', fontSize: '1.05rem' }}
              >
                Every decision we make is guided by these four pillars that define Sehatfull Foods
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl p-8 transition-all duration-300 hover:shadow-lg h-full flex flex-col"
                style={{
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  backgroundColor: value.gradient,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.5)', color: value.accentColor }}
                >
                  <value.icon size={32} />
                </div>
                <h3
                  className="font-bold text-xl mb-3 flex-grow"
                  style={{ color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
                >
                  {value.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#5a6e54', fontSize: '0.95rem' }}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR STORY TIMELINE */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#3d7a50' }}
              >
                Our Journey
              </span>
              <h2
                className="font-bold"
                style={{ fontSize: '2.3rem', color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
              >
                From Vision to Reality
              </h2>
            </motion.div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 hidden md:block"
              style={{ background: 'linear-gradient(180deg, transparent, #c8a96e, transparent)' }}
            />

            <div className="space-y-12">
              {storyMilestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className={`flex gap-8 items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="flex-1">
                    <div
                      className="rounded-2xl p-6 md:p-8 group hover:shadow-lg transition-all"
                      style={{ background: '#f5ede0', border: '1px solid #e0cdb0' }}
                    >
                      <div
                        className="text-sm font-bold uppercase tracking-widest mb-2"
                        style={{ color: '#c8a96e' }}
                      >
                        {milestone.year}
                      </div>
                      <h3
                        className="font-bold text-xl mb-2"
                        style={{ color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
                      >
                        {milestone.title}
                      </h3>
                      <p style={{ color: '#7a8c74' }}>{milestone.desc}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <div
                      className="w-5 h-5 rounded-full border-4"
                      style={{ borderColor: '#c8a96e', background: '#fdf8f1' }}
                    />
                  </div>

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY TALBEENA MATTERS */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #1a3a2a 0%, #2d5a3d 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8a96e' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 lg:px-12 relative">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#c8a96e' }}
              >
                Healing Power
              </span>
              <h2
                className="font-bold"
                style={{ fontSize: '2.3rem', color: '#f5ece0', fontFamily: "'Georgia', serif" }}
              >
                Why Talbeena is Special
              </h2>
              <p
                className="mx-auto max-w-2xl mt-4 leading-relaxed"
                style={{ color: '#a8c8a0', fontSize: '1.05rem' }}
              >
                Mentioned in Hadith as a cure for many ailments, Talbeena combines the wisdom of ancient Islamic medicine with modern nutritional science
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-7 text-center backdrop-blur-sm"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,169,110,0.2)' }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-white bg-opacity-10">
                  <benefit.icon size={28} style={{ color: '#c8a96e' }} />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  style={{ color: '#f5ece0', fontFamily: "'Georgia', serif" }}
                >
                  {benefit.title}
                </h3>
                <p style={{ color: '#a8c8a0', fontSize: '0.95rem' }}>{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUALITY COMMITMENT */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-4"
                style={{ color: '#3d7a50' }}
              >
                Our Promise
              </span>

              <h2
                className="font-bold mb-8"
                style={{ fontSize: '2.4rem', color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
              >
                Uncompromising Quality
              </h2>

              <div className="space-y-6">
                {[
                  { title: '🌾 Premium Barley', desc: 'Handpicked from the cleanest, most trusted farms' },
                  { title: '🍯 Pure Honey', desc: 'Natural sweetness without any processing additives' },
                  { title: '✓ Lab Certified', desc: 'Every batch tested for purity and safety' },
                  { title: '♻️ Zero Waste', desc: 'Sustainable packaging that respects our earth' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 rounded-xl transition-colors hover:bg-white hover:shadow-md"
                  >
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: '#2d5a3d', fontFamily: "'Georgia', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ color: '#7a8c74' }}>{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="rounded-3xl overflow-hidden h-[500px] flex items-center justify-center relative"
                style={{ background: 'linear-gradient(135deg, #e8f0e4 0%, #f5e8d0 100%)' }}
              >
                <div className="text-center">
                  <span className="text-[120px] block" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}>
                    ✨
                  </span>
                  <p
                    className="text-xl font-bold mt-6"
                    style={{ color: '#2d5a3d', fontFamily: "'Georgia', serif" }}
                  >
                    Pure. <br />
                    <span style={{ color: '#c8a96e' }}>Authentic.</span>
                    <br />
                    Trusted.
                  </p>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-8 -right-8 text-7xl"
              >
                🏺
              </motion.div>
              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, delay: 1, repeat: Infinity }}
                className="absolute -bottom-8 -left-8 text-6xl"
              >
                🌿
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      

      {/* TESTIMONIALS SECTION */}
      <section className="py-20" style={{ background: '#fdf8f1' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <span
                className="inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3"
                style={{ color: '#3d7a50' }}
              >
                Trust & Stories
              </span>
              <h2
                className="font-bold"
                style={{ fontSize: '2.3rem', color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
              >
                Loved by Our Community
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Fatima Khan',
                role: 'Mother of Three',
                content:
                  'Sehatfull Talbeena has become our morning ritual. My children love it and I feel confident about what I\'m feeding them every day.',
                emoji: '❤️',
              },
              {
                name: 'Dr. Imran Siddiqui',
                role: 'Physician',
                content:
                  'I recommend Takmeeli Talbeena to my patients recovering from illness. The barley-based formula is gentle, nourishing and truly effective.',
                emoji: '⭐',
              },
              {
                name: 'Rukhsana Ansari',
                role: 'Wellness Coach',
                content:
                  'A wholesome start to every morning. The traditional recipe, pure ingredients — you can feel the difference from day one.',
                emoji: '✨',
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl p-8 relative group hover:shadow-lg transition-all"
                style={{ background: '#f5ede0', border: '1px solid #e0cdb0' }}
              >
                <div className="text-4xl mb-4 absolute top-6 right-6">{testimonial.emoji}</div>

                <p
                  className="text-sm leading-relaxed italic mb-6 pr-12"
                  style={{ color: '#5a6e54', fontFamily: "'Georgia', serif" }}
                >
                  "{testimonial.content}"
                </p>

                <div>
                  <div
                    className="font-bold"
                    style={{ color: '#1e2e1a', fontFamily: "'Georgia', serif" }}
                  >
                    {testimonial.name}
                  </div>
                  <div className="text-xs uppercase tracking-wider mt-1" style={{ color: '#9aab90' }}>
                    {testimonial.role}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACT NUMBERS */}
      <section className="py-16" style={{ background: '#2d5a3d' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '5,000+', label: 'Families Served' },
              { value: '20,000+', label: 'Orders Delivered' },
              { value: '100%', label: 'Natural Ingredients' },
              { value: '4.9★', label: 'Customer Rating' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="font-bold mb-2"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#c8a96e', fontFamily: "'Georgia', serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#a8c8a0' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1a3a2a 0%, #2d5a3d 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8a96e'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2
              className="font-bold mb-6"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                color: '#f5ece0',
                fontFamily: "'Georgia', serif",
              }}
            >
              Join Our Community of Health-Conscious Families
            </h2>

            <p
              className="text-lg mb-10 max-w-2xl mx-auto"
              style={{ color: '#a8c8a0', lineHeight: '1.8' }}
            >
              Experience the healing power of authentic Talbeena. Start your wellness journey today with Sehatfull Foods.
            </p>

            <Link href="/shop">
              <button
                className="font-semibold px-10 py-4 rounded-lg transition-all hover:opacity-90 inline-flex items-center gap-2"
                style={{
                  background: '#c8a96e',
                  color: '#1e2e1a',
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                }}
              >
                Shop Now & Transform Your Health
              </button>
            </Link>

            <p className="text-sm mt-8" style={{ color: '#8aab88' }}>
              ✓ Free shipping on orders above ₹499 | ✓ 100% satisfaction guarantee
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}