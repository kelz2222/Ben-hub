import { useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Wine, Utensils, Star, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Admin() {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/" />

  const [tab, setTab] = useState('bestseller')
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [wines, setWines] = useState([])

  const [bs, setBs] = useState({ name: '', type: '', origin: '', description: '', price: '', imageUrl: '' })
  const [newWine, setNewWine] = useState({ name: '', type: 'Red', origin: '', price: '', imageUrl: '' })
  const [newFood, setNewFood] = useState({ name: '', category: 'Mains', description: '', price: '', imageUrl: '' })

  useEffect(() => {
    getDocs(collection(db, 'orders')).then(s => setOrders(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    getDocs(collection(db, 'screenBookings')).then(s => setBookings(s.docs.map(d => ({ id: d.id, ...d.data() }))))
    getDocs(collection(db, 'wines')).then(s => setWines(s.docs.map(d => ({ id: d.id, ...d.data() }))))
  }, [])

  const saveBestSeller = async () => {
    await setDoc(doc(db, 'settings', 'bestSeller'), bs)
    toast.success('Best Seller updated!')
  }

  const addWine = async () => {
    if (!newWine.name || !newWine.price) { toast.error('Name and price required'); return }
    const ref = await addDoc(collection(db, 'wines'), { ...newWine, price: Number(newWine.price), createdAt: new Date().toISOString() })
    setWines(prev => [...prev, { id: ref.id, ...newWine }])
    setNewWine({ name: '', type: 'Red', origin: '', price: '', imageUrl: '' })
    toast.success('Wine added!')
  }

  const deleteWine = async (id) => {
    await deleteDoc(doc(db, 'wines', id))
    setWines(prev => prev.filter(w => w.id !== id))
    toast.success('Wine removed')
  }

  const addFood = async () => {
    if (!newFood.name || !newFood.price) { toast.error('Name and price required'); return }
    await addDoc(collection(db, 'menu'), { ...newFood, price: Number(newFood.price), createdAt: new Date().toISOString() })
    setNewFood({ name: '', category: 'Mains', description: '', price: '', imageUrl: '' })
    toast.success('Menu item added!')
  }

  const tabs = [
    { id: 'bestseller', label: '⭐ Best Seller' },
    { id: 'wines', label: '🍷 Wines' },
    { id: 'food', label: '🍔 Food Menu' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'bookings', label: '📺 Bookings' },
  ]

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <div className="eyebrow">Admin</div>
        <h1 style={{ color: 'var(--bone)', fontStyle: 'italic', marginBottom: 40 }}>Ben Hub Dashboard</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? 'var(--gold)' : 'var(--noir-soft)',
              color: tab === t.id ? 'var(--noir)' : 'var(--text-muted)',
              border: `1px solid ${tab === t.id ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`,
              padding: '9px 20px', borderRadius: 'var(--radius-pill)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{t.label}</button>
          ))}
        </div>

        {/* BEST SELLER TAB */}
        {tab === 'bestseller' && (
          <div style={{ maxWidth: 560 }}>
            <h3 style={{ color: 'var(--bone)', marginBottom: 24 }}>
              <Star size={16} color="var(--gold)" style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Update Best Seller Wine
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { key: 'name', placeholder: 'Wine name *', label: 'Name' },
                { key: 'type', placeholder: 'Type (Red, White, Rosé...)', label: 'Type' },
                { key: 'origin', placeholder: 'Origin / Region', label: 'Origin' },
                { key: 'price', placeholder: 'Price in ₦', label: 'Price', type: 'number' },
                { key: 'imageUrl', placeholder: 'Image URL', label: 'Image URL' },
              ].map(f => (
                <input key={f.key} type={f.type || 'text'} className="input" placeholder={f.placeholder}
                  value={bs[f.key]} onChange={e => setBs(p => ({ ...p, [f.key]: e.target.value }))} />
              ))}
              <textarea className="input" placeholder="Description" value={bs.description}
                onChange={e => setBs(p => ({ ...p, description: e.target.value }))} />
              <button className="btn-gold" onClick={saveBestSeller}>Save Best Seller</button>
            </div>
          </div>
        )}

        {/* WINES TAB */}
        {tab === 'wines' && (
          <div>
            <h3 style={{ color: 'var(--bone)', marginBottom: 24 }}>Add New Wine</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
              <input className="input" placeholder="Wine name *" value={newWine.name} onChange={e => setNewWine(p => ({ ...p, name: e.target.value }))} />
              <select className="input" value={newWine.type} onChange={e => setNewWine(p => ({ ...p, type: e.target.value }))}>
                {['Red', 'White', 'Rosé', 'Sparkling', 'Dessert'].map(t => <option key={t}>{t}</option>)}
              </select>
              <input className="input" placeholder="Origin / Region" value={newWine.origin} onChange={e => setNewWine(p => ({ ...p, origin: e.target.value }))} />
              <input type="number" className="input" placeholder="Price ₦ *" value={newWine.price} onChange={e => setNewWine(p => ({ ...p, price: e.target.value }))} />
              <input className="input" placeholder="Image URL" value={newWine.imageUrl} onChange={e => setNewWine(p => ({ ...p, imageUrl: e.target.value }))} />
            </div>
            <button className="btn-gold" onClick={addWine} style={{ marginBottom: 40 }}>Add Wine</button>

            <h3 style={{ color: 'var(--bone)', marginBottom: 20 }}>Current Wines ({wines.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {wines.map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 'var(--radius-md)', padding: '14px 20px' }}>
                  <div>
                    <span style={{ color: 'var(--bone)', fontWeight: 500 }}>{w.name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 12 }}>{w.type} · ₦{Number(w.price).toLocaleString()}</span>
                  </div>
                  <button onClick={() => deleteWine(w.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOD TAB */}
        {tab === 'food' && (
          <div style={{ maxWidth: 640 }}>
            <h3 style={{ color: 'var(--bone)', marginBottom: 24 }}>Add Menu Item</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="input" placeholder="Item name *" value={newFood.name} onChange={e => setNewFood(p => ({ ...p, name: e.target.value }))} />
              <select className="input" value={newFood.category} onChange={e => setNewFood(p => ({ ...p, category: e.target.value }))}>
                {['Starters', 'Mains', 'Sides', 'Desserts', 'Drinks'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="input" placeholder="Short description" value={newFood.description} onChange={e => setNewFood(p => ({ ...p, description: e.target.value }))} />
              <input type="number" className="input" placeholder="Price ₦ *" value={newFood.price} onChange={e => setNewFood(p => ({ ...p, price: e.target.value }))} />
              <input className="input" placeholder="Image URL" value={newFood.imageUrl} onChange={e => setNewFood(p => ({ ...p, imageUrl: e.target.value }))} />
              <button className="btn-gold" onClick={addFood}>Add to Menu</button>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <h3 style={{ color: 'var(--bone)', marginBottom: 24 }}>Orders ({orders.length})</h3>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <span style={{ color: 'var(--bone)', fontWeight: 600 }}>{o.userEmail}</span>
                      <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>₦{Number(o.total).toLocaleString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{o.address} · {o.phone}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>
                      {o.items?.map(i => `${i.name} x${i.qty}`).join(', ')}
                    </p>
                    <div style={{ marginTop: 10 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        padding: '3px 10px', borderRadius: 'var(--radius-pill)',
                        background: o.status === 'pending' ? 'rgba(201,168,76,0.15)' : 'rgba(76,175,80,0.15)',
                        color: o.status === 'pending' ? 'var(--gold)' : '#4CAF50',
                      }}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {tab === 'bookings' && (
          <div>
            <h3 style={{ color: 'var(--bone)', marginBottom: 24 }}>Screen Bookings ({bookings.length})</h3>
            {bookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No bookings yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ color: 'var(--bone)', fontWeight: 600 }}>{b.userEmail}</span>
                      <span style={{ color: 'var(--gold)', fontSize: 13 }}>Screen: {b.screenId}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>
                      📅 {b.eventDate} · 📍 {b.location} · 👥 {b.guestCount} guests
                    </p>
                    {b.notes && <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>{b.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
