'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Star, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase, Product } from '@/lib/supabase'
import { useCartStore } from '@/lib/cartStore'
import toast from 'react-hot-toast'

interface ProductImage {
  id: string
  image_url: string
  alt_text: string
  display_order: number
}

interface ProductFlavor {
  id: string
  flavor_name: string
  price_modifier: number
  stock: number
}

interface ProductWithImages extends Product {
  images?: ProductImage[]
  flavors?: ProductFlavor[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<ProductWithImages | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, image_url, alt_text, display_order),
          flavors:product_flavors(id, flavor_name, price_modifier, stock)
        `)
        .eq('slug', slug)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const images =
    product?.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.display_order - b.display_order)
      : product
      ? [{ id: '1', image_url: '/placeholder.jpg', alt_text: product.name, display_order: 0 }]
      : []

  const hasMultipleImages = images.length > 1

  const finalPrice = selectedFlavor
    ? (product?.price || 0) + (selectedFlavor.price_modifier || 0)
    : product?.price || 0

  const handleAddToCart = () => {
    if (product) {
      addItem(product as any, selectedFlavor || undefined, quantity)
      toast.success(`Added ${quantity} ${product.name} to cart!`, { icon: '🛒' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Product not found</h2>
          <Link href="/shop">
            <button className="btn-primary">Back to Shop</button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/" className="text-gray-600 hover:text-primary-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="text-gray-600 hover:text-primary-600">Shop</Link>
            <span className="mx-2">/</span>
            <span className="font-semibold">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={images[currentImageIndex]?.image_url || '/placeholder.jpg'}
                  alt={images[currentImageIndex]?.alt_text || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Navigation arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all"
                    >
                      <ChevronLeft size={20} className="text-gray-800" />
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all"
                    >
                      <ChevronRight size={20} className="text-gray-800" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-primary-600 w-6' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {hasMultipleImages && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <Image src={img.image_url} alt={img.alt_text} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current" size={20} />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">(24 reviews)</span>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary-600">₹{finalPrice}</span>
                  <span className="text-gray-500 ml-2 text-xl">/ {product.weight}</span>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Flavor Selector */}
                {product.flavors && product.flavors.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Select Flavor</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedFlavor(null)}
                        className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                          selectedFlavor === null
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 text-gray-700 hover:border-primary-600'
                        }`}
                      >
                        Default
                      </button>
                      {product.flavors.map((flavor) => (
                        <button
                          key={flavor.id}
                          onClick={() => setSelectedFlavor(flavor)}
                          disabled={flavor.stock <= 0}
                          className={`text-xs px-3 py-1.5 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            selectedFlavor?.id === flavor.id
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 text-gray-700 hover:border-primary-600'
                          }`}
                        >
                          {flavor.flavor_name}
                          {flavor.price_modifier > 0 && ` (+₹${flavor.price_modifier})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Quantity</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full btn-primary text-lg py-4 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  <ShoppingCart size={24} className="mr-2" />
                  Add to Cart
                </button>

                <Link href="/shop">
                  <button className="w-full btn-outline py-3">Continue Shopping</button>
                </Link>
              </div>

              {/* Features */}
              <div className="mt-6 bg-white rounded-xl shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Truck className="mx-auto text-primary-600 mb-2" size={32} />
                    <p className="font-semibold">Free Shipping</p>
                    <p className="text-sm text-gray-600">On all orders</p>
                  </div>
                  <div className="text-center">
                    <Shield className="mx-auto text-primary-600 mb-2" size={32} />
                    <p className="font-semibold">100% Natural</p>
                    <p className="text-sm text-gray-600">No preservatives</p>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="mx-auto text-primary-600 mb-2" size={32} />
                    <p className="font-semibold">Easy Returns</p>
                    <p className="text-sm text-gray-600">7 days policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Ingredients:</h3>
                <p className="text-gray-700">Premium almonds, cashews, raisins, dates, and mixed nuts</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Nutritional Info:</h3>
                <p className="text-gray-700">Rich in protein, fiber, vitamins, and minerals</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Storage:</h3>
                <p className="text-gray-700">Store in a cool, dry place</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Shelf Life:</h3>
                <p className="text-gray-700">6 months from manufacturing date</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}