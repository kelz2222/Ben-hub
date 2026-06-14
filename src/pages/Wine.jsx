import { useEffect, useState } from 'react'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useCart } from '../context/CartContext'
import { Wine as WineIcon, Star, ShoppingBag, Filter } from 'lucide-react'

const FILTERS = ['All', 'Red', 'White', 'Rosé', 'Sparkling', 'Dessert']

export default function Wine() {
  const [wines, setWines] = useState([])
  const [bestSeller, setBestSeller] = useState(null)
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    Promise.all([
      getDocs(collection(db, 'wines')),
      getDoc(doc(db, 'settings', 'bestSeller'))
    ]).then(([wineSnap, bsSnap]) => {
      setWines(wineSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      if (bsSnap.exists()) setBestSeller(bsSnap.data())
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? wines : wines.filter(w => w.type === filter)

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="container">
        <div style={{ marginBottom: 56, paddingTop: 24 }}>
          <div className="eyebrow">Ben Hub</div>
          <h1 style={{ color: 'var(--bone)', fontStyle: 'italic', marginBottom: 12 }}>Wine Shop</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 500 }}>
            Carefully selected wines for every palate and occasion. Delivered to you in Lagos.
          </p>
        </div>

        {/* BEST SELLER */}
        {bestSeller && (
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(201,168,76,0.15)' }} />
              <span className="badge"><Star size={10} fill="currentColor" /> Best Seller</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(201,168,76,0.15)' }} />
            </div>
            <div style={{
              background: 'linear-gradient(135deg, rgba(107,31,42,0.3), var(--noir-mid))',
              border: '1px solid rgba(201,168,76,0.3)', borderRadius: 'var(--radius-lg)',
              padding: '40px', display: 'grid', gap: 40, alignItems: 'center',
              gridTemplateColumns: '160px 1fr',
            }} className="bs-wine-grid">
              <div style={{ aspectRatio: '3/4', background: 'var(--noir)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {bestSeller.imageUrl
                  ? <img src={bestSeller.imageUrl} alt={bestSeller.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <WineIcon size={48} color="var(--gold-dim)" />
                }
              </div>
              <div>
                <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}><Star size={10} fill="currentColor" /> This week's top pick</span>
                <h2 style={{ color: 'var(--bone)', marginBottom: 6 }}>{bestSeller.name}</h2>
                <p style={{ color: 'var(--gold)', fontSize: 13, marginBottom: 16 }}>{bestSeller.type} · {bestSeller.origin}</p>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28, maxWidth: 460 }}>{bestSeller.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--gold)' }}>
                    ₦{Number(bestSeller.price).toLocaleString()}
                  </span>
                  <button className="btn-gold" onClick={() => addItem({ ...bestSeller, id: 'bestseller', category: 'wine' })}>
                    <ShoppingBag size={14} style={{ marginRight: 8, verticalAlign: 'middle' }} /> Add to cart
                  </button>
                </div>
              </div>
            </div>
            <style>{`.bs-wine-grid { grid-template-columns: 160px 1fr; } @media(max-width:600px){ .bs-wine-grid { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}

        {/* FILTERS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          <Filter size={14} color="var(--text-muted)" />
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? 'var(--gold)' : 'transparent',
              color: filter === f ? 'var(--noir)' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
              padding: '7px 18px', borderRadius: 'var(--radius-pill)',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.06em',
              textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
            }}>{f}</button>
          ))}
        </div>

        {/* GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>Loading wines...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <WineIcon size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--text-muted)' }}>No wines in this category yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 24, marginBottom: 80 }}>
            {filtered.map(wine => (
              <div key={wine.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 200, background: 'var(--noir-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {wine.imageUrl
                    ? <img src={wine.imageUrl} alt={wine.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <WineIcon size={40} color="var(--gold-dim)" />
                  }
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{wine.type}</span>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--bone)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>{wine.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 'auto', lineHeight: 1.5 }}>{wine.origin}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--gold)' }}>
                      ₦{Number(wine.price).toLocaleString()}
                    </span>
                    <button className="btn-gold" style={{ padding: '8px 16px', fontSize: 11 }}
                      onClick={() => addItem({ ...wine, category: 'wine' })}>
                      Add to cart
                    </button>
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
