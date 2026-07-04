import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Preloader from '@/components/Preloader'

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-space-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'GROUNDHOOD | Thrift Store',
    template: '%s | GROUNDHOOD',
  },
  description:
    'Thrift store produk secondhand pilihan. Temukan pakaian unik berkualitas dengan harga terjangkau.',
  keywords: ['thrift store', 'secondhand', 'preloved', 'fashion', 'indonesia', 'groundhood'],
  // Official GROUNDHOOD logo as the browser-tab favicon across every page.
  icons: {
    icon: '/GROUNDHOOD_LOGOS.png',
    shortcut: '/GROUNDHOOD_LOGOS.png',
    apple: '/GROUNDHOOD_LOGOS.png',
  },
  openGraph: {
    siteName: 'GROUNDHOOD',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={spaceMono.variable}>
        <Preloader />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
