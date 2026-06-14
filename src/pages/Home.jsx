import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Wine, Utensils, Monitor, Package, Star, ArrowRight, ChevronRight } from 'lucide-react'

const occasions = [
  { title: 'Match Night', emoji: '⚽', desc: 'LED screen + premium wine + food delivery to your door', link: '/packages', color: '#1A2E1A', accent: '#4CAF50' },
  { title: 'Dinner Party', emoji: '🍽️', desc: 'Curated wine pairings + restaurant-quality food delivery', link: '/packages', color: '#2E1A1A', accent: '#C9A84C' },
  { title: 'Corporate Event', emoji: '🏢', desc: 'LED screen rental + catering + wine package for your team', link: '/packages', color: '#1A1A2E', accent: '#7C8CF8' },
  { title: 'Birthday Bash', emoji: '🎉', desc: 'Full setup — screen, drinks, food — we sort everything', link: '/packages', color: '#2E1A2E', accent: '#E07BE0' },
]

const services = [
  { icon: Wine, label: 'Wine Shop', sub: 'Premium selection', to: '/wine', color: 'var(--red-wine-soft)' },
  { icon: Utensils, label: 'Food Delivery', sub: 'Order now', to: '/food', color: '#2D5016' },
  { icon: Monitor, label: 'LED Screens', sub: 'Rent for events', to: '/screens', color: '#0D2E4A' },
  { icon: Package, label: 'Packages', sub: 'Bundle & save', to: '/packages', color: '#3D2000' },
]

export default function Home() {
  const [bestSeller, setBestSeller] = useState(null)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'bestSeller')).then(snap => {
      if (snap.exists()) setBestSeller(snap.data())
    }).catch(() => {})

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.3 }
    )
    document.querySelectorAll('.gold-underline').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="page">
      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: `radial-gradient(ellipse at 70% 50%, rgba(107, 31, 42, 0.25) 0%, transparent 60%),
                     radial-gradient(ellipse at 20% 80%, rgba(201, 168, 76, 0.08) 0%, transparent 50%),
                     var(--noir)`,
        position: 'relative', overflow: 'hidden', paddingTop: 80,
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: `linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700 }}>
            <div className="eyebrow" style={{ marginBottom: 24 }}>Lagos, Nigeria</div>
            <h1 style={{ marginBottom: 24, fontStyle: 'italic', color: 'var(--bone)' }}>
              Every occasion<br />
              <span className="gold-underline" style={{ color: 'var(--gold)' }}>deserves</span><br />
              the best of Ben.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 480, marginBottom: 40, lineHeight: 1.7 }}>
              Premium wines. Exceptional food delivery. LED screen rentals for any event. One hub. Everything sorted.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/packages" className="btn-gold" style={{ textDecoration: 'none' }}>Plan your occasion</Link>
              <Link to="/wine" className="btn-outline" style={{ textDecoration: 'none' }}>Explore wines</Link>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLER SPOTLIGHT */}
      {bestSeller && (
        <section style={{ background: 'var(--noir-soft)', padding: '64px 0' }}>
          <div className="container">
            <div className="eyebrow">Featured Wine</div>
            <div style={{
              display: 'grid', gap: 48, alignItems: 'center',
              background: 'linear-gradient(135deg, var(--noir-mid), var(--noir-soft))',
              border: '1px solid rgba(201,168,76,0.25)', borderRadius: 'var(--radius-lg)',
              padding: 48, marginTop: 24, gridTemplateColumns: '1fr 2fr',
            }} className="bs-home-grid">
              <div style={{ aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', background: 'var(--noir-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {bestSeller.imageUrl
                  ? <img src={bestSeller.imageUrl} alt={bestSeller.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <Wine size={64} color="var(--gold-dim)" />
                }
              </div>
              <div>
                <span className="badge" style={{ marginBottom: 20, display: 'inline-flex' }}><Star size={10} fill="currentColor" /> Best Seller</span>
                <h2 style={{ color: 'var(--bone)', marginBottom: 8 }}>{bestSeller.name}</h2>
                <p style={{ color: 'var(--gold)', fontSize: 13, marginBottom: 16 }}>{bestSeller.type} · {bestSeller.origin}</p>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>{bestSeller.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 300 }}>
                    ₦{Number(bestSeller.price).toLocaleString()}
                  </span>
                  <Link to="/wine" className="btn-gold" style={{ textDecoration: 'none' }}>
                    Order Now <ArrowRight size={14} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <style>{`.bs-home-grid { grid-template-columns: 1fr 2fr; } @media(max-width:640px){ .bs-home-grid { grid-template-columns: 1fr !important; } }`}</style>
        </section>
      )}

      {/* OCCASIONS */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow">Plan Your Night</div>
            <h2 className="gold-underline" style={{ color: 'var(--bone)' }}>Pick your occasion</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {occasions.map(o => (
              <Link key={o.title} to={o.link} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: o.color, border: `1px solid ${o.accent}30`,
                  borderRadius: 'var(--radius-lg)', padding: '32px 28px',
                  transition: 'all 0.25s ease', height: '100%',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = o.accent + '80'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = o.accent + '30'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{o.emoji}</div>
                  <h3 style={{ color: 'var(--bone)', marginBottom: 10 }}>{o.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{o.desc}</p>
                  <span style={{ color: o.accent, fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                    See package <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="gold-divider" />

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <div style={{ marginBottom: 48 }}>
            <div className="eyebrow">Everything Ben</div>
            <h2 style={{ color: 'var(--bone)' }}>Our services</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {services.map(s => {
              const Icon = s.icon
              return (
                <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '32px 24px', height: '100%' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                      <Icon size={22} color="var(--gold)" />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--bone)', marginBottom: 6 }}>{s.label}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.sub}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, var(--red-wine) 0%, var(--noir-mid) 60%)`, padding: '64px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'var(--bone)', marginBottom: 16, fontStyle: 'italic' }}>Ready to make it an occasion?</h2>
          <p style={{ color: 'rgba(245,240,232,0.7)', marginBottom: 32 }}>Browse our event packages — wine, food, and screens bundled for you.</p>
          <Link to="/packages" className="btn-gold" style={{ textDecoration: 'none' }}>View packages</Link>
        </div>
      </section>
    </div>
  )
}
