import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { Monitor, Check, Calendar, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'

const SCREENS = [
  {
    id: 'small', name: 'Standard Screen', size: '55"', price: 25000,
    features: ['Full HD 1080p', 'Indoor use', 'Ideal up to 50 guests', 'Basic setup included'],
  },
  {
    id: 'medium', name: 'Pro Screen', size: '85"', price: 50000, popular: true,
    features: ['4K Ultra HD', 'Indoor & outdoor', 'Up to 150 guests', 'Full setup & teardown', 'HDMI / wireless'],
  },
  {
    id: 'large', name: 'Event Screen', size: '120"+ LED Wall', price: 120000,
    features: ['LED modular wall', 'Large outdoor events', '500+ guests', 'Technician on-site', 'Custom sizing available'],
  },
]

export default function Screens() {
  const { user } = useAuth()
  const [form, setForm] = useState({ screenId: '', eventDate: '', location: '', duration: '', guestCount: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.screenId || !form.eventDate || !form.location) { toast.error('Please fill required fields'); return }
    if (!user) { toast.error('Please sign in to book'); return }
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'screenBookings'), {
        ...form, userId: user.uid, userEmail: user.email,
        status: 'pending', createdAt: new Date().toISOString(),
      })
      toast.success("Booking request sent! We'll confirm within 24 hours.")
      setForm({ screenId: '', eventDate: '', location: '', duration: '', guestCount: '', notes: '' })
    } catch { toast.error('Something went wrong. Please try again.') }
    setSubmitting(false)
  }

  return (
    <div className="page" style={{ paddingTop: 100 }}>
      <div className="container">
        <div style={{ paddingTop: 24, marginBottom: 56 }}>
          <div className="eyebrow">Ben Hub</div>
          <h1 style={{ color: 'var(--bone)', fontStyle: 'italic', marginBottom: 12 }}>LED Screen Rentals</h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
            Professional LED screens for events of every size. We deliver and set up.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 72 }}>
          {SCREENS.map(s => (
            <div key={s.id} className="card" style={{
              padding: '32px', position: 'relative',
              border: form.screenId === s.id ? '1px solid var(--gold)' : s.popular ? '1px solid rgba(201,168,76,0.35)' : undefined,
            }}>
              {s.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--gold)', color: 'var(--noir)',
                  fontSize: 10, fontWeight: 700, padding: '4px 16px',
                  borderRadius: 'var(--radius-pill)', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>Most Popular</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Monitor size={28} color="var(--gold)" />
                <div>
                  <div style={{ color: 'var(--bone)', fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{s.size}</div>
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--gold)', fontWeight: 300 }}>
                  ₦{Number(s.price).toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}> / day</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {s.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
                    <Check size={14} color="var(--gold)" /> {f}
                  </li>
                ))}
              </ul>
              <button className={form.screenId === s.id ? 'btn-gold' : 'btn-outline'} style={{ width: '100%' }}
                onClick={() => setForm(p => ({ ...p, screenId: s.id }))}>
                {form.screenId === s.id ? '✓ Selected' : 'Select this screen'}
              </button>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto 80px' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Book your screen</div>
          <h2 style={{ color: 'var(--bone)', marginBottom: 32 }}>Request a booking</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <Calendar size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Event date *
              </label>
              <input type="date" className="input" value={form.eventDate} onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                <MapPin size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Event location *
              </label>
              <input type="text" className="input" placeholder="Address in Lagos" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Duration (days)</label>
                <input type="number" className="input" placeholder="1" min="1" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  <Users size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Guest count
                </label>
                <input type="number" className="input" placeholder="50" value={form.guestCount} onChange={e => setForm(p => ({ ...p, guestCount: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Additional notes</label>
              <textarea className="input" placeholder="Tell us more about your event..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
            </div>
            <button className="btn-gold" style={{ marginTop: 8 }} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Send booking request'}
            </button>
            <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
              We'll confirm availability and pricing within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
