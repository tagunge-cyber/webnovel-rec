'use client'
import { Novel } from '@/lib/types'

interface Props {
  novel: Novel
  wished: boolean
  onWish: () => void
}

const FILLS = ['#EEEDFE','#E1F5EE','#FAEEDA','#FAECE7','#E6F1FB','#EAF3DE']

export default function NovelCard({ novel, wished, onWish, idx }: Props & { idx: number }) {
  const platLabel = novel.platform === 'naver' ? '네이버 시리즈' : '카카오페이지'
  const platCls = novel.platform === 'naver'
    ? 'bg-emerald-50 text-emerald-800'
    : 'bg-amber-50 text-amber-800'

  return (
    <div className="flex gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors">
      <div
        className="w-14 h-20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border border-gray-100"
        style={{ background: FILLS[idx % FILLS.length] }}
      >
        {novel.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-medium text-gray-900">{novel.title}</p>
            <p className="text-xs text-gray-400">{novel.author}</p>
          </div>
          <button
            onClick={onWish}
            className={`text-xl leading-none transition-colors flex-shrink-0 ${wished ? 'text-pink-500' : 'text-gray-300 hover:text-gray-400'}`}
            aria-label="찜하기"
          >
            ♥
          </button>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed mb-2">{novel.reason}</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${platCls}`}>{platLabel}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${novel.status === 'done' ? 'bg-green-50 text-green-800' : 'bg-blue-50 text-blue-800'}`}>
            {novel.status === 'done' ? '완결' : '연재중'}
          </span>
          {novel.free && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-800">무료화</span>}
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-600">{novel.genre}</span>
          {novel.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-600">{t}</span>
          ))}
          
            href={novel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            작품 보러가기 ↗
          </a>
        </div>
      </div>
    </div>
  )
}
