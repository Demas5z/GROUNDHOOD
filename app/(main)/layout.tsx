import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getCartCount } from '@/lib/cart'
import { prisma } from '@/lib/prisma'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, categories] = await Promise.all([
    getCartCount(),
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    }),
  ])
  return (
    <>
      <Navbar cartCount={cartCount} categories={categories} />
      {children}
      <Footer />
    </>
  )
}
