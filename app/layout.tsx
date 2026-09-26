import '../styles/globals.css'
import { ReactNode } from 'react'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CartProvider } from '../lib/cart'
import { DemoAuthProvider } from '../lib/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })

export const metadata = {
  title: 'NexCart | Everyday essentials',
  description: 'Premium essentials shopping experience',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <DemoAuthProvider>
          <CartProvider>
            <Header />
            <main className="site-main">{children}</main>
            <Footer />
          </CartProvider>
        </DemoAuthProvider>
      </body>
    </html>
  )
}
