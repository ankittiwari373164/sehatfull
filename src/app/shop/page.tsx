'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ProductCard'

const categories = ['All Products']
const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat && categories.includes(cat)) setSelectedCategory(cat)
    fetchProducts()
  }, [])

  useEffect(() => { filterAndSortProducts() }, [products, selectedCategory, searchQuery, sortBy])

  const fetchProducts = async () => {
    try {
      // Fetch products WITH their images and flavors
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          images:product_images(id, image_url, alt_text, display_order),
          flavors:product_flavors(id, flavor_name, price_modifier, stock)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]
    if (selectedCategory !== 'All Products') filtered = filtered.filter((p) => p.category === selectedCategory)
    if (searchQuery) filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    switch (sortBy) {
      case 'price-low': filtered.sort((a, b) => a.price - b.price); break
      case 'price-high': filtered.sort((a, b) => b.price - a.price); break
      case 'name': filtered.sort((a, b) => a.name.localeCompare(b.name)); break
      default: filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#2c1f0e] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-primary-300 text-xs font-bold uppercase tracking-widest block mb-2">Our Products</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Shop All Products</h1>
            <p className="text-secondary-300 mt-3 max-w-lg">Discover our complete range of premium healthy snacks — hot air roasted, 0% oil, 100% natural.</p>
          </motion.div>
        </div>
      </div>

      {/* Category Quick Filter */}
      <div className="bg-cream-100 border-b border-primary-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex gap-2 py-4 min-w-max md:min-w-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`cat-pill whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-white text-secondary-600 border border-primary-100 hover:border-primary-400 hover:text-primary-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-700">
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-sm w-auto px-3 py-2"
          >
            {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-secondary-500 text-sm">
            Showing <span className="font-bold text-secondary-800">{filteredProducts.length}</span> of {products.length} products
            {selectedCategory !== 'All Products' && <span className="text-primary-600 ml-1">in {selectedCategory}</span>}
          </p>
          {(selectedCategory !== 'All Products' || searchQuery) && (
            <button onClick={() => { setSelectedCategory('All Products'); setSearchQuery('') }} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-cream-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-cream-200 rounded w-1/3" />
                  <div className="h-5 bg-cream-200 rounded" />
                  <div className="h-4 bg-cream-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🥜</div>
            <h3 className="font-display text-2xl font-bold text-secondary-700 mb-2">No products found</h3>
            <p className="text-secondary-400 mb-6">Try adjusting your filters or search query</p>
            <button onClick={() => { setSelectedCategory('All Products'); setSearchQuery('') }} className="btn-primary">
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-primary-500 font-display text-xl">Loading...</div></div>}>
      <ShopContent />
    </Suspense>
  )
}