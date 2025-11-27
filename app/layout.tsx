import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Flow.io - 企业级低代码平台',
  description: '企业级 ToB Web 低代码实现平台',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={`${inter.className} h-full overflow-hidden`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

