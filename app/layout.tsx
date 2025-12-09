import type { Metadata } from "next"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: {
    default: 'Hidden Treasures Network | Empowering Youth Through Aviation & STEM',
    template: '%s | Hidden Treasures Network',
  },
  description: 'A global network connecting aviation and STEM organizations to impact one million lives by 2030 through education, mentorship, and opportunity.',
  keywords: ['aviation', 'STEM', 'education', 'mentorship', 'nonprofit', 'youth empowerment'],
  authors: [{ name: 'Infinity Aero Club Tampa Bay, Inc.' }],
  creator: 'Hidden Treasures Network',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://HiddenTreasuresNetwork.org',
    siteName: 'Hidden Treasures Network',
    title: 'Hidden Treasures Network | Empowering Youth Through Aviation & STEM',
    description: 'A global network connecting aviation and STEM organizations to impact one million lives by 2030 through education, mentorship, and opportunity.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hidden Treasures Network',
    description: 'Empowering one million lives through aviation & STEM education.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Montserrat:wght@600;700;800&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
