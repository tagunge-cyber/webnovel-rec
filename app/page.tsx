'use client'
import { useState, useMemo } from 'react'
import FilterBar from '@/components/FilterBar'
import NovelCard from '@/components/NovelCard'
import WishList from '@/components/WishList'
import { Novel } from '@/lib/types'

export default function Home() {
  const [platforms, setPlatforms] = useState<Set<string>>(new Set(['naver', 'kakao']))
  const [genre, setGenre] = useState('all')
  const [status, setStatus] = useState('all')
  const [preference, setPreference] = useState('')
  const [novels, setNovels] = useState<Novel[]>([])
  const [wishIds, setWishIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function togglePlatform(p: string) {
    setPlatforms(prev => {
      const next = new Set(prev)
      if (next.has(p)) { if (next.size > 1) next.delete(p) }
      else next.add(p)
      return next
    })
  }

  function toggleWish(id: string) {
    setWishIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => novels.filter(n => {
    if (!platforms.has(n.platform)) return false
    if (status === 'ongoing' && n.status !== 'ongoing') return false
    if (status === 'done' && n.status !== 'done') return false
    if (status === 'free' && !n.free) return false
    if (genre !== 'all' && n.genre !== genre) return false
    return true
  }), [novels, platforms, genre, status])

  const wishedNovels = useMemo(() => novels.filter(n => wishIds.has(n.id)), [novels, wishIds])

  async function recommend() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms: [...platforms], genre, status, preference }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setNovels(data.novels)
    } catch (e: any) {
      setError('추천을 불러오지 못했어요. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-900">웹소설 추천</h1>
        <p className="text-sm text-gray-400 mt-1">장르를 고르고 취향을 설명하면 AI가 딱 맞는 작품을 추천해드려요</p>
      </div>

      <FilterBar
        platforms={platforms}
        genre={genre}
        status={status}
        onPlatform={togglePlatform}
        onGenre={setGenre}
        onStatus={setStatus}
      />

      <div className="border border-gray-200 rounded-xl p-3 mb-4 bg-white flex gap-3 items-end">
        <textarea
          className="flex-1 text-sm text-gray-800 resize-none outline-none bg-transparent leading-relaxed min-h-[56px] placeholder:text-gray-300"
          placeholder="예: 주인공이 강하게 성장하는 스토리, 달달한 로맨스보다 갈등 있는 편이 좋아요. 최근에 전지적 독자 시점을 재밌게 읽었어요."
          value={preference}
          onChange={e => setPreference(e.target.value)}
          rows={2}
        />
        <button
          onClick={recommend}
          disabled={loading}
          className="px-4 py-2 bg-purple-700 text-purple-50 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-purple-800 transition-colors whitespace-nowrap"
        >
          {loading ? '분석 중...' : 'AI 추천받기 ↗'}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      {novels.length > 0 && !loading && (
        <p className="text-xs text-gray-400 mb-3">{filtered.length}편 표시 중</p>
      )}

      {loading && (
        <div className="text-center py-12 text-gray-400 text-sm">
          <div className="inline-block w-5 h-5 border-2 border-gray-200 border-t-purple-600 rounded-full animate-spin mb-3" />
          <p>AI가 취향을 분석하는 중...</p>
        </div>
      )}

      {!loading && novels.length === 0 && (
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl text-gray-300 text-sm">
          취향을 입력하고 추천받기를 눌러보세요
        </div>
      )}

      {!loading && filtered.length === 0 && novels.length > 0 && (
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl text-gray-300 text-sm">
          필터 조건에 맞는 작품이 없어요
        </div>
      )}

      <div className="space-y-3">
        {!loading && filtered.map((n, i) => (
          <NovelCard key={n.id} novel={n} idx={i} wished={wishIds.has(n.id)} onWish={() => toggleWish(n.id)} />
        ))}
      </div>

      <WishList novels={wishedNovels} />
    </main>
  )
}
