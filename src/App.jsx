import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Wine from './pages/Wine'
import Food from './pages/Food'
import Screens from './pages/Screens'
import Packages from './pages/Packages'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Cart from './pages/Cart'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { isAdmin } = useAuth()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wine" element={<Wine />} />
          <Route path="/food" element={<Food />} />
          <Route path="/screens" element={<Screens />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          {isAdmin && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
