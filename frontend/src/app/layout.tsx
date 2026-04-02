import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'
import CartSidebar from '@/components/CartSidebar'
import { Analytics } from '@vercel/analytics/react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import './globals.css'

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-prompt',
  display: 'swap',
})

const BASE_URL = 'https://uncloned-frontend.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'UNCLONED | เสื้อผ้าแฮนด์เมด ฝ้าย ลินิน ธรรมชาติ',
    template: '%s | UNCLONED',
  },
  description: 'ความเรียบง่ายที่ถักทอด้วยความใส่ใจ เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น มินิมอลดีไซน์ ใส่ได้ทุกโอกาส สนับสนุนงานฝีมือไทย',
  keywords: ['เสื้อผ้าแฮนด์เมด', 'ผ้าฝ้าย', 'ผ้าลินิน', 'UNCLONED', 'งานคราฟต์', 'มินิมอล', 'เสื้อผ้าธรรมชาติ', 'handmade clothes Thailand'],
  authors: [{ name: 'UNCLONED Handcraft' }],
  creator: 'UNCLONED Handcraft',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: BASE_URL,
    siteName: 'UNCLONED',
    title: 'UNCLONED | เสื้อผ้าแฮนด์เมด ฝ้าย ลินิน',
    description: 'เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น ออกแบบมาเพื่อความสวมใส่สบาย มินิมอล และเป็นมิตรกับสิ่งแวดล้อม',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UNCLONED — เสื้อผ้าแฮนด์เมดธรรมชาติ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNCLONED | เสื้อผ้าแฮนด์เมด ฝ้าย ลินิน',
    description: 'เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
}

// JSON-LD Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'UNCLONED Handcraft',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  description: 'เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น รักษ์โลก ใส่ใจทุกฝีเข็ม',
  sameAs: [
    'https://www.instagram.com/uncloned.craft',
    'https://www.facebook.com/uncloned',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${prompt.variable}`} data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`font-sans antialiased bg-craft-50 text-craft-900 min-h-screen`}>
        <LanguageProvider>
          {children}
          <CartSidebar />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
