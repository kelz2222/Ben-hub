import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Package, Wine, Utensils, Monitor, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const PACKAGES = [
  {
    id: 'match_night', emoji: '⚽', name: 'Match Night', tagline: 'The ultimate watch party setup',
    price: 85000, color: '#1A2E1A', accent: '#4CAF50', savings: 15000,
    includes: [
      { icon: Monitor, text: 'Standard 55" LED Screen (1 day)' },
      { icon: Wine, text: '2 bottles of premium wine' },
      { icon: Utensils, text: 'Food delivery for 4 (any menu items)' },
    ],
  },
  {
    id: 'dinner_party', emoji: '🍷', name: 'Dinner Party', tagline: 'Wine & food, curated for the evening',
    price: 55000, color: '#2E1A1A', accent: '#C9A84C', popular: true, savings: 10000,
    includes: [
      { icon: Wine, text: '4 bottles — red, white & rosé selection' },
      { icon: Utensils, text: 'Full dinner spread for 6 people' },
      { icon: Package, text: 'Branded packaging & presentation' },
    ],
  },
  {
    id: 'corporate', emoji: '🏢', name: 'Corporate Event', tagline: 'Screen + catering for your team',
    price: 200000, color: '#1A1A2E', accent: '#7C8CF8', savings: 35000,
    includes: [
      { icon: Monitor, text: 'Pro 85" LED Screen (1 day)' },
      { icon: Utensils, text: 'Catering for 20 people' },
      { icon: Wine, text: '6 bottles of wine or soft drinks' },
      { icon: Package, text: 'Setup & teardown service' },
    ],
  },
  {
    id: 'birthday', emoji: '🎉', name: 'Birthday Bash', tagline: 'Full celebration setup',
    price: 130000, color: '#2E1A2E', accent: '#E07BE0', savings: 25000,
    includes: [
      { icon: Monitor, text: 'Pro 85" LED Screen (1 day)' },
      { icon: Wine, text: '4 bottles of wine & champagne' },
      { icon: Utensils, text: 'Party food spread for 15 people' },
      { icon: Package, text: 'Delivery, setup & clearance' },
    ],
  },
]

export default function Packages() {
  const { user } = useAuth()
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ date: '', address: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleBook = async () => {
    if (!selected) { toast.error('Select a package first'); return }
    if (!form.date || !form.address) { toast.error('Date and address are required'); return }
    if (!user) { toast.error('Please sign in to book'); return }
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'packageBookings'), {
        packageId: selected, ...form,
        userId: user.uid, userEmail: user.email,
        status: 'pending', createdAt: new Date().toISOString(),
      })
      toast.success("Package booked! We'll be in touch within 12 hours.")
      setSelected(null)
      setForm({ date: '', address: '', notes: '' })
    } catch { toast.error('Something went wrong. Try again.') }
    setSubmitting(false)
  }

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="container">
        <div style={{ paddingTop: 24, marginBottom: 56, textAlign: 'center' }}>
          <div className="eyebrow">Ben Hub</div>
          <h1 style={{ color: 'var(--bone)', fontStyle: 'italic', marginBottom: 12 }}>Event Packages</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 480, margin: '0 auto' }}>
            Bundle our services and save. Everything you need for the perfect occasion.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, marginBottom: 64 }}>
          {PACKAGES.map(pkg => (
            <div key={pkg.id} onClick={() => setSelected(pkg.id)} style={{
              background: pkg.color, borderRadius: 'var(--radius-lg)', padding: '32px',
              border: `1px solid ${selected === pkg.id ? pkg.accent : pkg.accent + '30'}`,
              cursor: 'pointer', transition: 'all 0.25s ease', position: 'relative',
              transform: selected === pkg.id ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: selected === pkg.id ? `0 12px 40px ${pkg.accent}20` : 'none',
            }}>
              {pkg.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: pkg.accent, color: '#fff', fontSize: 10, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 'var(--radius-pill)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Most Popular</div>
              )}
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{pkg.emoji}</div>
              <h3 style={{ color: 'var(--bone)', marginBottom: 4 }}>{pkg.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>{pkg.tagline}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {pkg.includes.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'var(--text-muted)', fontSize: 13 }}>
                      <Icon size={14} color={pkg.accent} style={{ marginTop: 2, flexShrink: 0 }} /> {item.text}
                    </li>
                  )
                })}
              </ul>
              <div style={{ borderTop: `1px solid ${pkg.accent}20`, paddingTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: pkg.accent, lineHeight: 1 }}>
                      ₦{Number(pkg.price).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                      Save ₦{Number(pkg.savings).toLocaleString()}
                    </div>
                  </div>
                  {selected === pkg.id && (
                    <div style={{ background: pkg.accent, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={16} color="#fff" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto 80px', background: 'var(--noir-soft)', borderRadius: 'var(--radius-lg)', padding: '40px' }}>
          <h2 style={{ color: 'var(--bone)', marginBottom: 8 }}>Book a package</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>
            {selected ? `Selected: ${PACKAGES.find(p => p.id === selected)?.name}` : 'Select a package above first.'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="date" className="input" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            <input type="text" className="input" placeholder="Delivery address in Lagos *" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
            <textarea className="input" placeholder="Any special requests..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            <button className="btn-gold" style={{ marginTop: 8 }} onClick={handleBook} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Book this package'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
