import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, register, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = async () => {
    setLoading(true)
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password)
      navigate('/')
    } catch (e) {
      toast.error(e.message?.replace('Firebase: ', '') || 'Something went wrong')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (e) {
      toast.error('Google sign-in failed')
    }
    setLoading(false)
  }

  return (
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', paddingTop: 80,
      background: `radial-gradient(ellipse at 50% 50%, rgba(107,31,42,0.15), transparent 70%), var(--noir)`,
    }}>
      <div style={{
        width: '100%', maxWidth: 420, padding: '0 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--bone)', marginBottom: 8 }}>
            Ben<span style={{ color: 'var(--gold)' }}>Hub</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div style={{
          background: 'var(--noir-soft)', border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 'var(--radius-lg)', padding: '40px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="email" className="input" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handle()} />
            <button className="btn-gold" style={{ marginTop: 6 }} onClick={handle} disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>or</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(201,168,76,0.1)' }} />
            </div>

            <button className="btn-outline" onClick={handleGoogle} disabled={loading}>
              Continue with Google
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: 13 }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 13 }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
