'use client'

const GENRES = ['all','로맨스','로맨스판타지','판타지','무협','현대판타지','BL','스릴러','회귀','이세계']
const STATUSES = [
  { value: 'all', label: '전체' },
  { value: 'ongoing', label: '연재중' },
  { value: 'done', label: '완결' },
  { value: 'free', label: '무료' },
]

interface Props {
  platforms: Set<string>
  genre: string
  status: string
  onPlatform: (p: string) => void
  onGenre: (g: string) => void
  onStatus: (s: string) => void
}

export default function FilterBar({ platforms, genre, status, onPlatform, onGenre, onStatus }: Props) {
  const pill = (active: boolean, extra?: string) =>
    `px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer ${
      active
        ? extra ?? 'bg-purple-100 text-purple-800 border-purple-300'
        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
    }`

  return (
    <div className="space-y-2 mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button
          className={pill(platforms.has('naver'), platforms.has('naver') ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : undefined)}
          onClick={() => onPlatform('naver')}
        >
          네이버 시리즈
        </button>
        <button
          className={pill(platforms.has('kakao'), platforms.has('kakao') ? 'bg-amber-100 text-amber-800 border-amber-300' : undefined)}
          onClick={() => onPlatform('kakao')}
        >
          카카오페이지
        </button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {STATUSES.map((s) => (
          <button key={s.value} className={pill(status === s.value)} onClick={() => onStatus(s.value)}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {GENRES.map((g) => (
          <button key={g} className={pill(genre === g)} onClick={() => onGenre(g)}>
            {g === 'all' ? '전체 장르' : g}
          </button>
        ))}
      </div>
    </div>
  )
}
