import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const [form, setForm] = useState({ address: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [ordered, setOrdered] = useState(false)

  const DELIVERY_FEE = 500
  const total = cartTotal + DELIVERY_FEE

  const handleOrder = async () => {
    if (!user) { toast.error('Please sign in to place an order'); return }
    if (!form.address || !form.phone) { toast.error('Address and phone are required'); return }
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'orders'), {
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, category: i.category })),
        subtotal: cartTotal, deliveryFee: DELIVERY_FEE, total,
        ...form, userId: user.uid, userEmail: user.email,
        status: 'pending', createdAt: new Date().toISOString(),
      })
      clearCart()
      setOrdered(true)
    } catch { toast.error('Order failed. Please try again.') }
    setSubmitting(false)
  }

  if (ordered) {
    return (
      <div className="page" style={{ paddingTop: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>🎉</div>
          <h2 style={{ color: 'var(--bone)', marginBottom: 12 }}>Order placed!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>We've received your order and will deliver within 45–60 minutes.</p>
          <Link to="/" className="btn-gold" style={{ textDecoration: 'none' }}>Back to home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div className="eyebrow">Ben Hub</div>
        <h1 style={{ color: 'var(--bone)', fontStyle: 'italic', marginBottom: 40 }}>Your Cart</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <ShoppingBag size={56} color="var(--text-muted)" style={{ marginBottom: 20 }} />
            <h3 style={{ color: 'var(--bone)', marginBottom: 12 }}>Your cart is empty</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Browse our wine or food section to add items.</p>
            <Link to="/wine" className="btn-gold" style={{ textDecoration: 'none' }}>Shop wines</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 48, alignItems: 'start' }} className="cart-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.1)',
                  borderRadius: 'var(--radius-md)', padding: '20px',
                  display: 'flex', alignItems: 'center', gap: 20,
                }}>
                  <div style={{ width: 60, height: 60, background: 'var(--noir-mid)', borderRadius: 8, flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <ShoppingBag size={20} color="var(--gold-dim)" />
                    }
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--bone)', fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 12, textTransform: 'capitalize' }}>{item.category}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: 'var(--noir-mid)', border: 'none', color: 'var(--bone)', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                    <span style={{ color: 'var(--bone)', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: 'var(--noir-mid)', border: 'none', color: 'var(--bone)', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                  </div>
                  <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.1rem', minWidth: 90, textAlign: 'right' }}>
                    ₦{(item.price * item.qty).toLocaleString()}
                  </div>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              <h3 style={{ color: 'var(--bone)', marginBottom: 24 }}>Order summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Subtotal</span>
                  <span style={{ color: 'var(--bone)', fontSize: 14 }}>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Delivery fee</span>
                  <span style={{ color: 'var(--bone)', fontSize: 14 }}>₦{DELIVERY_FEE.toLocaleString()}</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--bone)', fontWeight: 600 }}>Total</span>
                  <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>₦{total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <input type="text" className="input" placeholder="Delivery address *" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                <input type="tel" className="input" placeholder="Phone number *" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                <textarea className="input" placeholder="Notes (optional)" style={{ minHeight: 80 }} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <button className="btn-gold" style={{ width: '100%' }} onClick={handleOrder} disabled={submitting}>
                {submitting ? 'Placing order...' : 'Place order'}
              </button>
              <p style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'center', marginTop: 12 }}>Payment on delivery. Cash or transfer.</p>
            </div>
          </div>
        )}
        <style>{`.cart-grid { grid-template-columns: 1fr 360px; } @media(max-width:768px){ .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </div>
  )
}
