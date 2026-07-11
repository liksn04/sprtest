import { describe, expect, it } from 'vitest'
import { BUDGET, FLIGHT_SCENARIOS, ITINERARY, CHECKLIST, TRIP, fmtKRW, mapUrl } from './trip'

describe('예산 정합성', () => {
  it('각 카테고리의 산정 내역 합계 = 계획 금액', () => {
    for (const c of BUDGET) {
      const sum = c.lines.reduce((a, l) => a + l.amount, 0)
      expect(sum, c.id).toBe(c.planned)
    }
  })

  it('기본(특가) 시나리오 기준 총예산 = 300만', () => {
    const total = BUDGET.reduce((a, c) => a + c.planned, 0)
    expect(total).toBe(TRIP.totalBudget)
  })

  it('항공 시나리오의 내역 합계 = 시나리오 총액, 총액 = 인당 × 2', () => {
    for (const s of FLIGHT_SCENARIOS) {
      const sum = s.lines.reduce((a, l) => a + l.amount, 0)
      expect(sum, s.id).toBe(s.total)
      expect(s.perPerson * 2, s.id).toBe(s.total)
    }
  })
})

describe('일정 데이터', () => {
  it('일정 항목 id는 전역 중복 없음', () => {
    const ids = ITINERARY.flatMap((d) => d.items.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('4일치 일정과 시간 오름차순', () => {
    expect(ITINERARY).toHaveLength(4)
    for (const day of ITINERARY) {
      const times = day.items.map((i) => i.time)
      expect([...times].sort(), `day ${day.day}`).toEqual(times)
    }
  })
})

describe('체크리스트', () => {
  it('체크 항목 id는 전역 중복 없음', () => {
    const ids = CHECKLIST.flatMap((s) => s.items.map((i) => i.id))
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('유틸', () => {
  it('fmtKRW는 천단위 콤마 + 원', () => {
    expect(fmtKRW(1_500_000)).toBe('1,500,000원')
    expect(fmtKRW(0)).toBe('0원')
  })

  it('mapUrl은 검색어를 인코딩', () => {
    expect(mapUrl('Odori Park Sapporo')).toBe('https://maps.google.com/?q=Odori%20Park%20Sapporo')
  })
})
