import type { Metadata, Viewport } from 'next'
import { Orbitron, Share_Tech_Mono } from 'next/font/google'
import './globals.css'

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TOONIFY PRIME // V2.0',
  description: 'Visual Processing Unit - Neural Network Image Transformation',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${shareTechMono.variable}`}>
      <body className="min-h-screen antialiased bg-[#020617] text-cyan-50 font-mono overflow-x-hidden selection:bg-cyan-500/30">
        <div className="fixed inset-0 pointer-events-none z-50 scanline-overlay opacity-20 mix-blend-overlay"></div>
        {children}
      </body>
    </html>
  )
}
