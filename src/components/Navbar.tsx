// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Menu, X, LogOut, LayoutDashboard, Home, Store, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    checkUser()
    // Listen for cart updates from localStorage
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]')
        setCartCount(cart.length)
      } catch {
        setCartCount(0)
      }
    }
    updateCart()
    window.addEventListener('storage', updateCart)
    return () => window.removeEventListener('storage', updateCart)
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <>
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-sm md:text-base text-gray-900">SEHATFULL FOODS</span>
                <span className="text-xs text-yellow-600 font-semibold">HEALTHY SUPPLEMENTS</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-yellow-600 transition font-medium">
                HOME
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-yellow-600 transition font-medium">
                SHOP
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-yellow-600 transition font-medium">
                BLOG
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-yellow-600 transition font-medium">
                ABOUT
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-yellow-600 transition font-medium">
                CONTACT
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link href="/cart" className="relative text-gray-700 hover:text-yellow-600 transition">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-yellow-600 transition flex items-center gap-1"
                  >
                    <LayoutDashboard size={20} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-yellow-600 transition flex items-center gap-1"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-medium"
                >
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-3 pb-20">
              <Link href="/" className="block text-gray-700 hover:text-yellow-600 transition font-medium">
                HOME
              </Link>
              <Link href="/shop" className="block text-gray-700 hover:text-yellow-600 transition font-medium">
                SHOP
              </Link>
              <Link href="/blog" className="block text-gray-700 hover:text-yellow-600 transition font-medium">
                BLOG
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-yellow-600 transition font-medium">
                ABOUT
              </Link>
              <Link href="/contact" className="block text-gray-700 hover:text-yellow-600 transition font-medium">
                CONTACT
              </Link>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block text-gray-700 hover:text-yellow-600 transition font-medium"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-gray-700 hover:text-yellow-600 transition font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-medium text-center"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around items-center h-16">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center w-full h-full text-gray-700 hover:text-yellow-600 transition"
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          {/* Shop */}
          <Link
            href="/shop"
            className="flex flex-col items-center justify-center w-full h-full text-gray-700 hover:text-yellow-600 transition"
          >
            <Store size={24} />
            <span className="text-xs mt-1">Shop</span>
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex flex-col items-center justify-center w-full h-full text-gray-700 hover:text-yellow-600 transition relative"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>

          {/* Account */}
          <Link
            href={user ? "/dashboard" : "/login"}
            className="flex flex-col items-center justify-center w-full h-full text-gray-700 hover:text-yellow-600 transition"
          >
            <User size={24} />
            <span className="text-xs mt-1">Account</span>
          </Link>
        </div>
      </div>
    </>
  )
}