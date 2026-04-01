import type { Metadata } from 'next'
import { Prompt } from 'next/font/google'
import './globals.css'

const prompt = Prompt({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-prompt',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UNCLONED | เสื้อผ้าแฮนด์เมด',
  description: 'ความเรียบง่ายที่ถักทอด้วยความใส่ใจ เสื้อผ้าฝ้ายและลินินธรรมชาติ ตัดเย็บด้วยมือทุกชิ้น',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${prompt.variable} scroll-smooth`}>
      <body className={`font-sans antialiased bg-craft-50 text-craft-900 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
