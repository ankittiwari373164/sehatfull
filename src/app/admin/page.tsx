'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, Upload, X, Image as ImageIcon, Ticket, Settings, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [productImages, setProductImages] = useState<any[]>([])
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'Takmeeli Talbeena',
    stock: '',
    sku: '',
    weight: '100g',
  })
  const [productFlavors, setProductFlavors] = useState<any[]>([])
  const [newFlavor, setNewFlavor] = useState({ flavor_name: '', sku_suffix: '', price_modifier: '', stock: '' })
  
  // Coupon form state
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_order_value: '',
    max_discount: '',
    usage_limit: '',
    expires_at: '',
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    razorpay_key_id: '',
    razorpay_secret_key: '',
  })
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showKeys, setShowKeys] = useState({ key: false, secret: false })

  // Blog form state
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [uploadingBlogImage, setUploadingBlogImage] = useState(false)
  const [blogImages, setBlogImages] = useState<any[]>([])
  const [blogForm, setBlogForm] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    published: false,
    featured_image: '',
  })

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    fetchData()
  }

  const fetchData = async () => {
    try {
      const [productsData, ordersData, blogData, couponsData, settingsData] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('payment_settings').select('*'),
      ])

      setProducts(productsData.data || [])
      setOrders(ordersData.data || [])
      setBlogPosts(blogData.data || [])
      setCoupons(couponsData.data || [])

      // Load payment settings
      const settings = settingsData.data || []
      const settingsObj: any = {}
      settings.forEach((s: any) => {
        settingsObj[s.setting_key] = s.setting_value
      })
      setPaymentSettings({
        razorpay_key_id: settingsObj.razorpay_key_id || '',
        razorpay_secret_key: settingsObj.razorpay_secret_key || '',
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploadingImage(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      // Add image to productImages array
      setProductImages([...productImages, { image_url: publicUrl, alt_text: '', display_order: productImages.length }])
      toast.success('Image added successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index))
  }

  const handleBlogImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploadingBlogImage(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { data, error } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      setBlogForm({ ...blogForm, featured_image: publicUrl })
      setBlogImages([{ image_url: publicUrl, alt_text: 'Featured Image', display_order: 0 }])
      toast.success('Featured image added successfully!')
    } catch (error: any) {
      console.error('Error uploading image:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingBlogImage(false)
    }
  }

  const removeBlogImage = () => {
    setBlogForm({ ...blogForm, featured_image: '' })
    setBlogImages([])
  }

  const handleAddFlavor = () => {
    if (!newFlavor.flavor_name) {
      toast.error('Please enter flavor name')
      return
    }
    setProductFlavors([...productFlavors, { ...newFlavor, id: Date.now() }])
    setNewFlavor({ flavor_name: '', sku_suffix: '', price_modifier: '', stock: '' })
    toast.success('Flavor added')
  }

  const removeFlavor = (id: any) => {
    setProductFlavors(productFlavors.filter(f => f.id !== id))
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (productImages.length === 0) {
        toast.error('Please upload at least one product image')
        setLoading(false)
        return
      }

      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      }

      let productId = editingProduct?.id

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        if (error) throw error
        
        // Delete existing images
        const { error: deleteError } = await supabase
          .from('product_images')
          .delete()
          .eq('product_id', productId)
        if (deleteError) throw deleteError
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single()
        if (error) throw error
        productId = data.id
      }

      // Insert product images
      const imagesToInsert = productImages.map((img, index) => ({
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text || productForm.name,
        display_order: index,
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imagesToInsert)
      if (imagesError) throw imagesError

      // Insert product flavors
      if (productFlavors.length > 0) {
        const flavorsToInsert = productFlavors
          .filter((f: any) => !f.id || typeof f.id === 'number') // Only new flavors
          .map((f: any) => ({
            product_id: productId,
            flavor_name: f.flavor_name,
            sku_suffix: f.sku_suffix,
            price_modifier: f.price_modifier ? parseFloat(f.price_modifier) : 0,
            stock: f.stock ? parseInt(f.stock) : 0,
          }))

        if (flavorsToInsert.length > 0) {
          const { error: flavorsError } = await supabase
            .from('product_flavors')
            .insert(flavorsToInsert)
          if (flavorsError) throw flavorsError
        }
      }

      toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')

      setShowProductForm(false)
      setEditingProduct(null)
      setProductImages([])
      setProductFlavors([])
      setProductForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        category: 'Takmeeli Talbeena',
        stock: '',
        sku: '',
        weight: '100g',
      })
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      toast.success('Product deleted successfully!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product')
    }
  }

  const handleEditProduct = async (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      sku: product.sku,
      weight: product.weight || '100g',
    })

    // Fetch product images and flavors
    const { data: imagesData } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('display_order')

    const { data: flavorsData } = await supabase
      .from('product_flavors')
      .select('*')
      .eq('product_id', product.id)

    setProductImages(imagesData || [])
    setProductFlavors(flavorsData || [])
    setShowProductForm(true)
  }

  // Coupon Management Functions
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const couponData = {
        ...couponForm,
        discount_value: parseFloat(couponForm.discount_value),
        min_order_value: couponForm.min_order_value ? parseFloat(couponForm.min_order_value) : 0,
        max_discount: couponForm.max_discount ? parseFloat(couponForm.max_discount) : null,
        usage_limit: couponForm.usage_limit ? parseInt(couponForm.usage_limit) : null,
        expires_at: couponForm.expires_at || null,
      }

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', editingCoupon.id)
        if (error) throw error
        toast.success('Coupon updated successfully!')
      } else {
        const { error } = await supabase.from('coupons').insert(couponData)
        if (error) throw error
        toast.success('Coupon created successfully!')
      }

      setShowCouponForm(false)
      setEditingCoupon(null)
      setCouponForm({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_order_value: '',
        max_discount: '',
        usage_limit: '',
        expires_at: '',
      })
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save coupon')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id)
      if (error) throw error
      toast.success('Coupon deleted!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete coupon')
    }
  }

  const handleEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon)
    setCouponForm({
      code: coupon.code,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_value: coupon.min_order_value?.toString() || '',
      max_discount: coupon.max_discount?.toString() || '',
      usage_limit: coupon.usage_limit?.toString() || '',
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
    })
    setShowCouponForm(true)
  }

  // Payment Settings
  const handlePaymentSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Delete existing settings
      await supabase.from('payment_settings').delete().gte('id', '0')

      // Insert new settings
      const settingsToInsert = [
        { setting_key: 'razorpay_key_id', setting_value: paymentSettings.razorpay_key_id },
        { setting_key: 'razorpay_secret_key', setting_value: paymentSettings.razorpay_secret_key, is_encrypted: true },
      ]

      const { error } = await supabase.from('payment_settings').insert(settingsToInsert)
      if (error) throw error

      toast.success('Payment settings updated successfully!')
      setShowPaymentForm(false)
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment settings')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
  setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  try {
    const res = await fetch('/api/update-order-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    })
    if (!res.ok) throw new Error(await res.text())
    toast.success('Order status updated!')
  } catch (error: any) {
    fetchData()
    toast.error(error.message || 'Failed to update order')
  }
}

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const blogData = {
        title: blogForm.title,
        slug: blogForm.slug,
        content: blogForm.content,
        excerpt: blogForm.excerpt,
        author: blogForm.author,
        published: blogForm.published,
        featured_image: blogForm.featured_image,
      }

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', editingPost.id)
        if (error) throw error
        toast.success('Blog post updated!')
      } else {
        const { error } = await supabase.from('blog_posts').insert(blogData)
        if (error) throw error
        toast.success('Blog post created!')
      }

      setShowBlogForm(false)
      setEditingPost(null)
      setBlogForm({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        author: '',
        published: false,
        featured_image: '',
      })
      setBlogImages([])
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id)
      if (error) throw error
      toast.success('Blog post deleted!')
      fetchData()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete blog post')
    }
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post)
    setBlogForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      author: post.author || '',
      published: post.published,
      featured_image: post.featured_image || '',
    })
    setBlogImages(post.featured_image ? [{ image_url: post.featured_image, alt_text: 'Featured', display_order: 0 }] : [])
    setShowBlogForm(true)
  }

  if (loading && !products.length && !coupons.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 overflow-x-auto">
            {['products', 'coupons', 'payment', 'orders', 'blog'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products Management</h2>
                <button
                  onClick={() => {
                    setShowProductForm(!showProductForm)
                    setEditingProduct(null)
                    setProductImages([])
                    setProductFlavors([])
                    setProductForm({
                      name: '',
                      slug: '',
                      description: '',
                      price: '',
                      category: 'Takmeeli Talbeena',
                      stock: '',
                      sku: '',
                      weight: '100g',
                    })
                  }}
                  className="btn-primary flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Product
                </button>
              </div>

              {showProductForm && (
                <form onSubmit={handleProductSubmit} className="bg-white rounded-lg p-6 mb-6 border">
                  <h3 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'Add'} Product</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={productForm.name}
                      onChange={(e) => {
  const name = e.target.value
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  setProductForm({ ...productForm, name, slug })
}}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Slug (e.g., takmeeli-talbeena-cardamom)"
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="SKU"
                      value={productForm.sku}
                      onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Weight (e.g., 500g, 1kg)"
                      value={productForm.weight}
                      onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                      className="input-field"
                    />
                    <textarea
                      placeholder="Description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={3}
                      className="input-field md:col-span-2"
                    />
                  </div>

                  {/* Product Images Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <ImageIcon size={18} className="mr-2" />
                      Product Images (Up to 5)
                    </h4>
                    <label className="block mb-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage || productImages.length >= 5}
                        className="hidden"
                      />
                      <div className="p-4 border-2 border-dashed border-primary-300 rounded cursor-pointer hover:bg-primary-50 text-center">
                        {uploadingImage ? 'Uploading...' : `Upload Images (${productImages.length}/5)`}
                      </div>
                    </label>

                    {productImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {productImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <Image
                              src={img.image_url}
                              alt="Product"
                              width={150}
                              height={150}
                              className="w-full h-32 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Flavors Section */}
                  <div className="mb-6 p-4 bg-gray-50 rounded">
                    <h4 className="font-semibold mb-3">Product Flavors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Flavor Name (e.g., Cardamom)"
                        value={newFlavor.flavor_name}
                        onChange={(e) => setNewFlavor({ ...newFlavor, flavor_name: e.target.value })}
                        className="input-field"
                      />
                      <input
                        type="text"
                        placeholder="SKU Suffix"
                        value={newFlavor.sku_suffix}
                        onChange={(e) => setNewFlavor({ ...newFlavor, sku_suffix: e.target.value })}
                        className="input-field"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price Modifier"
                        value={newFlavor.price_modifier}
                        onChange={(e) => setNewFlavor({ ...newFlavor, price_modifier: e.target.value })}
                        className="input-field"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={newFlavor.stock}
                        onChange={(e) => setNewFlavor({ ...newFlavor, stock: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddFlavor}
                      className="btn-outline text-sm mb-3"
                    >
                      Add Flavor
                    </button>

                    {productFlavors.length > 0 && (
                      <div className="space-y-2">
                        {productFlavors.map((flavor, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="text-sm">{flavor.flavor_name} {flavor.price_modifier && `(+₹${flavor.price_modifier})`}</span>
                            <button
                              type="button"
                              onClick={() => removeFlavor(flavor.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductForm(false)
                        setEditingProduct(null)
                        setProductImages([])
                        setProductFlavors([])
                      }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Images</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {/* Show first image */}
                          {/* Will display from product_images table */}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.sku}</div>
                        </td>
                        <td className="px-4 py-3">{product.category}</td>
                        <td className="px-4 py-3">₹{product.price}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Multiple</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Coupons Management</h2>
                <button
                  onClick={() => {
                    setShowCouponForm(!showCouponForm)
                    setEditingCoupon(null)
                    setCouponForm({
                      code: '',
                      description: '',
                      discount_type: 'percentage',
                      discount_value: '',
                      min_order_value: '',
                      max_discount: '',
                      usage_limit: '',
                      expires_at: '',
                    })
                  }}
                  className="btn-primary flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Coupon
                </button>
              </div>

              {showCouponForm && (
                <form onSubmit={handleCouponSubmit} className="bg-white rounded-lg p-6 mb-6 border">
                  <h3 className="text-xl font-bold mb-4">{editingCoupon ? 'Edit' : 'Add'} Coupon</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g., SAVE10)"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      required
                      className="input-field"
                    />
                    <textarea
                      placeholder="Description"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                      className="input-field"
                      rows={2}
                    />
                    <select
                      value={couponForm.discount_type}
                      onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                      className="input-field"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (₹)</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Discount Value"
                      value={couponForm.discount_value}
                      onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Min Order Value (Optional)"
                      value={couponForm.min_order_value}
                      onChange={(e) => setCouponForm({ ...couponForm, min_order_value: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Max Discount (Optional)"
                      value={couponForm.max_discount}
                      onChange={(e) => setCouponForm({ ...couponForm, max_discount: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Usage Limit (Optional)"
                      value={couponForm.usage_limit}
                      onChange={(e) => setCouponForm({ ...couponForm, usage_limit: e.target.value })}
                      className="input-field"
                    />
                    <input
                      type="datetime-local"
                      placeholder="Expires At (Optional)"
                      value={couponForm.expires_at}
                      onChange={(e) => setCouponForm({ ...couponForm, expires_at: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="btn-primary">
                      {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCouponForm(false)
                        setEditingCoupon(null)
                      }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white rounded-lg p-4 border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-lg font-bold text-primary-600">{coupon.code}</p>
                        <p className="text-sm text-gray-600">{coupon.description}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <p className="text-gray-600">Discount</p>
                        <p className="font-semibold">
                          {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Usage</p>
                        <p className="font-semibold">{coupon.usage_count}/{coupon.usage_limit || '∞'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        className="flex-1 btn-outline text-sm"
                      >
                        <Edit size={16} className="inline mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded text-sm"
                      >
                        <Trash2 size={16} className="inline mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PAYMENT SETTINGS TAB */}
          {activeTab === 'payment' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Payment Settings</h2>
                <button
                  onClick={() => setShowPaymentForm(!showPaymentForm)}
                  className="btn-primary flex items-center"
                >
                  <Settings size={20} className="mr-2" />
                  Configure
                </button>
              </div>

              {showPaymentForm && (
                <form onSubmit={handlePaymentSettingsSubmit} className="bg-white rounded-lg p-6 mb-6 border">
                  <h3 className="text-xl font-bold mb-4">Razorpay Configuration</h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Add your Razorpay API credentials to enable online payments. Get these from your Razorpay Dashboard → Settings → API Keys
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Razorpay Key ID</label>
                      <input
                        type={showKeys.key ? 'text' : 'password'}
                        placeholder="rzp_live_XXXXXXXXXXXXXXXX"
                        value={paymentSettings.razorpay_key_id}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpay_key_id: e.target.value })}
                        required
                        className="input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, key: !showKeys.key })}
                        className="text-sm text-primary-600 mt-1 flex items-center"
                      >
                        {showKeys.key ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span className="ml-1">{showKeys.key ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Razorpay Secret Key</label>
                      <input
                        type={showKeys.secret ? 'text' : 'password'}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                        value={paymentSettings.razorpay_secret_key}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpay_secret_key: e.target.value })}
                        required
                        className="input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKeys({ ...showKeys, secret: !showKeys.secret })}
                        className="text-sm text-primary-600 mt-1 flex items-center"
                      >
                        {showKeys.secret ? <EyeOff size={16} /> : <Eye size={16} />}
                        <span className="ml-1">{showKeys.secret ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> These credentials are sensitive. Keep them secure and never share them publicly.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button type="submit" disabled={loading} className="btn-primary">
                      Save Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPaymentForm(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {!showPaymentForm && (paymentSettings.razorpay_key_id || paymentSettings.razorpay_secret_key) && (
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <p className="text-green-800">
                    <strong>✓ Razorpay is configured</strong>. Customers can now pay using online payment methods.
                  </p>
                </div>
              )}

              {!showPaymentForm && !paymentSettings.razorpay_key_id && (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <p className="text-yellow-800">
                    <strong>⚠ Payment settings not configured.</strong> Click "Configure" to add Razorpay credentials.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg border p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-lg">₹{order.total}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Order Status</label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="input-field w-full md:w-auto"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No orders yet.</p>
                )}
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Blog Posts Management</h2>
                <button
                  onClick={() => {
                    setShowBlogForm(!showBlogForm)
                    setEditingPost(null)
                  }}
                  className="btn-primary flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Post
                </button>
              </div>

              {showBlogForm && (
                <form onSubmit={handleBlogSubmit} className="bg-white rounded-lg p-6 mb-6 border">
                  <h3 className="text-xl font-bold mb-4">{editingPost ? 'Edit' : 'Add'} Blog Post</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Post Title"
                      value={blogForm.title}
                      onChange={(e) => {
  const title = e.target.value
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  setBlogForm({ ...blogForm, title, slug })
}}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Slug"
                      value={blogForm.slug}
                      onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                      required
                      className="input-field"
                    />
                    <input
                      type="text"
                      placeholder="Author Name"
                      value={blogForm.author}
                      onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                      className="input-field"
                    />
                    
                    {/* Featured Image Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <ImageIcon size={20} className="text-gray-600" />
                          <label className="font-semibold text-gray-700">Featured Image</label>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBlogImageUpload}
                          disabled={uploadingBlogImage}
                          className="input-field"
                        />
                        {uploadingBlogImage && <p className="text-sm text-gray-500">Uploading...</p>}
                        
                        {blogForm.featured_image && (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={blogForm.featured_image}
                              alt="Featured"
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={removeBlogImage}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <textarea
                      placeholder="Excerpt"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                      rows={2}
                      className="input-field"
                    />
                    <textarea
                      placeholder="Content"
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      required
                      rows={10}
                      className="input-field"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={blogForm.published}
                        onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="font-semibold">Publish</span>
                    </label>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button type="submit" className="btn-primary">
                      {editingPost ? 'Update' : 'Create'} Post
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBlogForm(false)
                        setEditingPost(null)
                      }}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <div key={post.id} className="bg-white border rounded-lg p-4 flex justify-between items-start gap-4">
                    {/* Featured Image Thumbnail */}
                    {post.featured_image && (
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <Image
                          src={post.featured_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{post.title}</h3>
                        {post.published ? (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Published</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Draft</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {blogPosts.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No blog posts yet.</p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}