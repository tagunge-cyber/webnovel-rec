'use client'
import { Novel } from '@/lib/types'

interface Props { novels: Novel[] }

export default function WishList({ novels }: Props) {
  if (!novels.length) return null
  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h2 className="text-sm font-medium text-gray-700 mb-3">♥ 찜 목록 ({novels.length})</h2>
      <div className="space-y-2">
        {novels.map((n) => (
          <div key={n.id} className="flex items-center gap-2 text-sm py-1.5 border-b border-gray-50">
            <span className="text-base">{n.emoji}</span>
            <span className="font-medium text-gray-800 flex-1">{n.title}</span>
            <span className="text-gray-400 text-xs">{n.author}</span>
            <a href={n.url} target="_blank" rel="noopener noreferrer"
              className="text-xs px-2 py-0.5 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">
              보기 ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
