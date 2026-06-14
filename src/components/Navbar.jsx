import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const navLinks = [
    { to: '/wine', label: 'Wine' },
    { to: '/food', label: 'Food' },
    { to: '/screens', label: 'LED Screens' },
    { to: '/packages', label: 'Packages' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(13, 11, 8, 0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(201, 168, 76, 0.1)' : 'none',
        transition: 'all 0.35s ease',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, color: 'var(--bone)', letterSpacing: '0.05em' }}>
                Ben<span style={{ color: 'var(--gold)' }}>Hub</span>
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 }}>
                Wine · Food · Screens
              </span>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} style={{
                textDecoration: 'none', fontFamily: 'var(--font-body)',
                fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: location.pathname === l.to ? 'var(--gold)' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--bone)'}
              onMouseLeave={e => e.target.style.color = location.pathname === l.to ? 'var(--gold)' : 'var(--text-muted)'}
              >{l.label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/cart" style={{ position: 'relative', color: 'var(--bone)', textDecoration: 'none' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -8, right: -8,
                  background: 'var(--gold)', color: 'var(--noir)',
                  fontSize: 10, fontWeight: 700, width: 18, height: 18,
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{cartCount}</span>
              )}
            </Link>

            {isAdmin && (
              <Link to="/admin" style={{ color: 'var(--gold)' }} title="Admin">
                <Settings size={18} />
              </Link>
            )}

            {user ? (
              <button onClick={logout} className="btn-ghost" style={{ padding: '8px 16px', fontSize: 12 }}>
                <LogOut size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Sign out
              </button>
            ) : (
              <Link to="/login" className="btn-gold" style={{ textDecoration: 'none', padding: '9px 20px', fontSize: 12 }}>
                Sign in
              </Link>
            )}

            <button onClick={() => setOpen(!open)} style={{
              background: 'none', border: 'none', color: 'var(--bone)',
              cursor: 'pointer', display: 'none'
            }} className="mobile-menu-btn">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, bottom: 0,
          background: 'rgba(13, 11, 8, 0.98)', zIndex: 99,
          display: 'flex', flexDirection: 'column', padding: '40px 24px', gap: 8,
        }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: 'none', color: 'var(--bone)',
              fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300,
              padding: '12px 0', borderBottom: '1px solid rgba(201,168,76,0.1)',
              letterSpacing: '0.04em',
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  )
}
