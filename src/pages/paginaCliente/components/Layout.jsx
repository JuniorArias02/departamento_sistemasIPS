import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-100px)]">
        <Outlet /> {/* Aquí se cargan las páginas según la ruta */}
      </main>
      <Footer />
    </>
  )
}
