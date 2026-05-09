import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic()

const PLATFORM_SEARCH: Record<string, string> = {
  naver: 'https://series.naver.com/search/search.series?categoryTypeCode=novel&keyword=',
  kakao: 'https://page.kakao.com/search/result?keyword=',
}

const SYSTEM = `당신은 한국 웹소설 전문 큐레이터입니다. 실제로 존재하는 유명 웹소설만 추천하세요.
반드시 순수 JSON 배열만 반환하세요. 마크다운, 코드블록, 설명 없이 JSON만.
각 항목 형식:
{
  "id": "영문 고유 id",
  "title": "실제 작품 제목",
  "author": "실제 작가명",
  "platform": "naver 또는 kakao",
  "genre": "로맨스|로맨스판타지|판타지|무협|현대판타지|BL|스릴러|회귀|이세계 중 하나",
  "status": "done 또는 ongoing",
  "free": true 또는 false,
  "reason": "이 사용자 취향에 맞는 이유 2문장",
  "tags": ["태그1","태그2"],
  "emoji": "작품 분위기 이모지 1개",
  "url": "실제 작품 페이지 URL, 모르면 null"
}`

export async function POST(req: NextRequest) {
  const { platforms, genre, status, preference } = await req.json()

  const platLabels = platforms
    .map((p: string) => (p === 'naver' ? '네이버 시리즈' : '카카오페이지'))
    .join(', ')

  const userMsg = `플랫폼: ${platLabels}
선호 장르: ${genre === 'all' ? '무관' : genre}
연재상태: ${status === 'all' ? '무관' : status === 'done' ? '완결' : status === 'free' ? '무료화 포함' : '연재중'}
취향 설명: ${preference || '특별한 선호 없음'}
조건에 맞는 실존 웹소설 6편을 추천해주세요.`

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1500,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMsg }],
    })

    const text = message.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as { type: 'text'; text: string }).text)
      .join('')

    const novels = JSON.parse(text.replace(/```json|```/g, '').trim())

    // URL이 null이면 검색 URL로 대체
    const enriched = novels.map((n: any) => ({
      ...n,
      url: n.url ?? PLATFORM_SEARCH[n.platform] + encodeURIComponent(n.title),
    }))

    return NextResponse.json({ novels: enriched })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: '추천 실패' }, { status: 500 })
  }
}
