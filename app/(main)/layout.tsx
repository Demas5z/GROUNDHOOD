import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getCartCount } from '@/lib/cart'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cartCount = await getCartCount()
  return (
    <>
      <Navbar cartCount={cartCount} />
      {children}
      <Footer />
    </>
  )
}
