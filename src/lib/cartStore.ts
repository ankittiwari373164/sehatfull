// File: src/lib/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartProductImage {
  id: string
  image_url: string
  alt_text: string
  display_order: number
}

export interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  category: string
  weight: string
  stock: number
  images?: CartProductImage[]
}

export interface CartFlavor {
  id: string
  flavor_name: string
  price_modifier: number
}

export interface CartItem {
  product: CartProduct
  flavor?: CartFlavor
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (product: CartProduct, flavor?: CartFlavor, quantity?: number) => void
  removeItem: (productId: string, flavorId?: string) => void
  updateQuantity: (productId: string, quantity: number, flavorId?: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, flavor, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id &&
              (flavor?.id === item.flavor?.id || (!flavor && !item.flavor))
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item === existingItem
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, flavor, quantity }],
          }
        })
      },

      removeItem: (productId, flavorId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                (flavorId === item.flavor?.id || (!flavorId && !item.flavor))
              )
          ),
        }))
      },

      updateQuantity: (productId, quantity, flavorId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.product.id === productId &&
              (flavorId === item.flavor?.id || (!flavorId && !item.flavor))
                ? { ...item, quantity: Math.max(0, quantity) }
                : item
            )
            .filter((item) => item.quantity > 0),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const itemPrice = item.product.price + (item.flavor?.price_modifier || 0)
          return total + itemPrice * item.quantity
        }, 0)
      },

      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)