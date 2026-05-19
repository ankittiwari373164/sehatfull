// File: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Re-export types for use throughout the app
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          category: string
          stock: number
          sku: string | null
          weight: string
          created_at: string
          updated_at: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          created_at: string
        }
      }
      product_flavors: {
        Row: {
          id: string
          product_id: string
          flavor_name: string
          sku_suffix: string | null
          price_modifier: number
          stock: number
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          total: number
          discount_amount: number
          coupon_id: string | null
          status: string
          payment_method: string
          payment_status: string
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          shipping_address: Record<string, any> | null
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          flavor_id: string | null
          quantity: number
          price: number
          created_at: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: string
          discount_value: number
          min_order_value: number
          max_discount: number | null
          usage_limit: number | null
          usage_count: number
          expires_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      payment_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: string
          is_encrypted: boolean
          updated_at: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          author: string | null
          published: boolean
          featured_image: string | null
          created_at: string
          updated_at: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          phone: string | null
          default_address: Record<string, any> | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}