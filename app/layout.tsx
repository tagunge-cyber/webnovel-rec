import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '웹소설 AI 추천',
  description: '취향에 맞는 웹소설을 AI가 추천해드립니다',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
