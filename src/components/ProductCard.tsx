// File: src/components/ProductCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'

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

interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  category: string
  weight: string
  stock: number
  images?: ProductImage[]
  flavors?: ProductFlavor[]
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product, flavor?: ProductFlavor) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Use product images if available, otherwise create a fallback
  const images = product.images && product.images.length > 0 
    ? product.images.sort((a, b) => a.display_order - b.display_order)
    : [{ id: '1', image_url: '/placeholder.jpg', alt_text: product.name, display_order: 0 }]

  const hasMultipleImages = images.length > 1

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, selectedFlavor || undefined)
    }
  }

  const finalPrice = selectedFlavor 
    ? product.price + (selectedFlavor.price_modifier || 0)
    : product.price

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative bg-gray-100 overflow-hidden aspect-square group">
          {/* Image Display */}
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={images[currentImageIndex].image_url}
              alt={images[currentImageIndex].alt_text}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Image Navigation Buttons */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10 transition-all"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentImageIndex(idx)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? 'bg-primary-600 w-6' : 'bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Stock Status Badge */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
          >
            <Heart
              size={20}
              className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}
            />
          </button>

          {/* Sale Badge */}
          {product.category === 'Takmeeli Talbeena' && (
            <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Fresh
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-display font-bold text-lg text-secondary-800 hover:text-primary-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3">{product.weight}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Flavors Selector */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Select Flavor:
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFlavor(null)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
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
                  className={`text-xs px-2 py-1 rounded border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedFlavor?.id === flavor.id
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-gray-300 text-gray-700 hover:border-primary-600'
                  }`}
                >
                  {flavor.flavor_name}
                  {flavor.price_modifier > 0 && `(+₹${flavor.price_modifier})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price and Rating */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-primary-600">
                ₹{finalPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-xs text-gray-600">(128)</span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}