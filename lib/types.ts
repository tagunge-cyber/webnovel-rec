export type Platform = 'naver' | 'kakao'
export type Status = 'ongoing' | 'done'

export interface Novel {
  id: string
  title: string
  author: string
  platform: Platform
  genre: string
  status: Status
  free: boolean
  reason: string
  tags: string[]
  emoji: string
  url: string
}
