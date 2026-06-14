import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--noir-soft)',
      borderTop: '1px solid rgba(201,168,76,0.1)',
      padding: '48px 24px 32px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--bone)', marginBottom: 8 }}>
              Ben<span style={{ color: 'var(--gold)' }}>Hub</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 260, lineHeight: 1.6 }}>
              Wine. Food. Screens. Everything you need for the perfect occasion, delivered in Lagos.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
                Services
              </div>
              {[
                { to: '/wine', label: 'Wine Shop' },
                { to: '/food', label: 'Food Delivery' },
                { to: '/screens', label: 'LED Screens' },
                { to: '/packages', label: 'Packages' },
              ].map(l => (
                <div key={l.to} style={{ marginBottom: 10 }}>
                  <Link to={l.to} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'var(--bone)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                  >{l.label}</Link>
                </div>
              ))}
            </div>

            <div>
              <div style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
                Contact
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8 }}>
                Lagos, Nigeria<br />
                +234 — —<br />
                hello@benhub.com
              </p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(201,168,76,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            © 2024 Ben Hub. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Wine · Food · Screens · Lagos
          </p>
        </div>
      </div>
    </footer>
  )
}
