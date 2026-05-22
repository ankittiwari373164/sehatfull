import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'SehatFull Foods - Takmeeli Talbeena & Healthy Superfoods',
  description: 'Premium Takmeeli Talbeena and healthy superfoods. 100% natural, Sunnah-inspired nutrition for the whole family.',
  keywords: 'talbeena, takmeeli talbeena, healthy foods, sunnah foods, barley, superfoods, sehatfull',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Toaster position="top-right" />
      </body>
    </html>
  )
}