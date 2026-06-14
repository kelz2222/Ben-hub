import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const addItem = (product) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === product.id)
      if (exists) {
        toast.success(`${product.name} quantity updated`)
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      toast.success(`${product.name} added to cart`)
      return [...prev, { ...product, qty: 1 }]
    })
  }

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const clearCart = () => setItems([])
  const cartCount = items.reduce((s, i) => s + i.qty, 0)
  const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}
