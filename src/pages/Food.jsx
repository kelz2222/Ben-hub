import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../context/CartContext'
import { Utensils, Clock, ShoppingBag } from 'lucide-react'

const CATEGORIES = ['All', 'Starters', 'Mains', 'Sides', 'Desserts', 'Drinks']

export default function Food() {
  const [menu, setMenu] = useState([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    getDocs(collection(db, 'menu')).then(snap => {
      setMenu(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = category === 'All' ? menu : menu.filter(m => m.category === category)

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="container">
        <div style={{ paddingTop: 24, marginBottom: 48 }}>
          <div className="eyebrow">Ben Hub</div>
          <h1 style={{ color: 'var(--bone)', fontStyle: 'italic', marginBottom: 12 }}>Food Delivery</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <p style={{ color: 'var(--text-muted)' }}>Order from our menu — delivered fresh to your location.</p>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gold)', fontSize: 13 }}>
              <Clock size={14} /> 45–60 min delivery
            </span>
          </div>
        </div>

        <div style={{
          background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 'var(--radius-md)', padding: '16px 24px',
          display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 48,
        }}>
          {[
            { label: 'Minimum order', value: '₦3,000' },
            { label: 'Delivery fee', value: '₦500' },
            { label: 'Delivery time', value: '45–60 min' },
            { label: 'Hours', value: '10am – 11pm' },
          ].map(info => (
            <div key={info.label}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{info.label}</div>
              <div style={{ color: 'var(--bone)', fontWeight: 500 }}>{info.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              background: category === c ? 'var(--gold)' : 'transparent',
              color: category === c ? 'var(--noir)' : 'var(--text-muted)',
              border: `1px solid ${category === c ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
              padding: '7px 18px', borderRadius: 'var(--radius-pill)',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
            }}>{c}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading menu...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Utensils size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--text-muted)' }}>Menu items coming soon.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 80 }}>
            {filtered.map(item => (
              <div key={item.id} className="card" style={{ display: 'flex', height: 130 }}>
                <div style={{ width: 120, flexShrink: 0, background: 'var(--noir-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Utensils size={28} color="var(--gold-dim)" />
                  }
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--bone)', marginBottom: 4 }}>{item.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.description}</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                      ₦{Number(item.price).toLocaleString()}
                    </span>
                    <button onClick={() => addItem({ ...item, category: 'food' })} style={{
                      background: 'none', border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: 'var(--radius-pill)', padding: '6px 14px',
                      color: 'var(--gold)', fontSize: 12, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold)'; e.currentTarget.style.color = 'var(--noir)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--gold)' }}
                    ><ShoppingBag size={12} /> Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
