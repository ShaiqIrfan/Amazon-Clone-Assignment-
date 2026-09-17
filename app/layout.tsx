import '../styles/globals.css'
import { ReactNode } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CartProvider } from '../lib/cart'
import { DemoAuthProvider } from '../lib/auth'

export const metadata = {
  title: 'NexCart | Everyday shopping',
  description: 'NexCart demo shopping experience',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoAuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-[70vh]">{children}</main>
            <Footer />
          </CartProvider>
        </DemoAuthProvider>
      </body>
    </html>
  )
}
