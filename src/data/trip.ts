// ── 2027 삿포로 눈축제 & 조잔케이 온천 3박 4일 여행 데이터 ──────────────────

export const TRIP = {
  title: '삿포로 겨울 여행',
  subtitle: '눈축제 · 조잔케이 온천 · 오타루',
  departAt: '2027-02-04T08:00:00+09:00',
  dateLabel: '2027.2.4(목) — 2.7(일) · 3박 4일',
  travelers: '2인',
  totalBudget: 3_000_000,
  festival: { name: '제78회 삿포로 눈축제', period: '2027.2.4 — 2.11', note: '오도리 · 스스키노 · 츠도무 3개 회장' },
} as const

// ── 일정 ────────────────────────────────────────────────────────────────────

export type Category = 'move' | 'stay' | 'food' | 'tour' | 'onsen' | 'shop'

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  move: { label: '이동', color: 'var(--color-cat-move)' },
  stay: { label: '숙소', color: 'var(--color-cat-stay)' },
  food: { label: '식사', color: 'var(--color-cat-food)' },
  tour: { label: '관광', color: 'var(--color-cat-tour)' },
  onsen: { label: '온천', color: 'var(--color-cat-onsen)' },
  shop: { label: '쇼핑', color: 'var(--color-cat-shop)' },
}

export interface ItineraryItem {
  id: string
  time: string
  title: string
  desc: string
  category: Category
  map?: string // Google Maps 검색어
  tip?: string
}

export interface DayPlan {
  day: number
  date: string
  dow: string
  headline: string
  items: ItineraryItem[]
}

export const ITINERARY: DayPlan[] = [
  {
    day: 1,
    date: '2/4',
    dow: '목',
    headline: '부산 출발 → 눈축제 개막 야경',
    items: [
      { id: 'd1-1', time: '08:00', title: '김해국제공항 출발 수속', desc: '국제선 2층 출국장. 에어부산/진에어 오전 직항편 기준 (실제 예약 시간에 맞춰 조정)', category: 'move', tip: '출발 2시간 전 도착, 온라인 체크인 미리' },
      { id: 'd1-2', time: '10:00', title: '부산 → 신치토세 비행', desc: '직항 약 2시간 20분. 기내에서 입국카드 작성 불필요 — 비짓재팬웹 QR 준비', category: 'move' },
      { id: 'd1-3', time: '12:30', title: '신치토세공항 도착 · 입국', desc: '입국심사 → 수하물 → 세관(QR). B1 JR역으로 이동', category: 'move', map: 'New Chitose Airport', tip: '아이폰 지갑에 Suica 발급해두면 교통이 편해요' },
      { id: 'd1-4', time: '13:30', title: '쾌속 에어포트 → 삿포로역', desc: 'JR 쾌속 에어포트 약 40분, ¥1,150. 15분 간격 운행', category: 'move', map: 'JR Sapporo Station' },
      { id: 'd1-5', time: '14:30', title: '호텔 체크인 (스스키노/오도리 인근)', desc: '짐 풀고 방한 장비 착용. 눈축제 회장까지 도보권 숙소 추천', category: 'stay', map: 'Susukino Sapporo' },
      { id: 'd1-6', time: '15:30', title: '늦은 점심 — 수프카레', desc: '수프카레 GARAKU 또는 스아게+ (스스키노). 삿포로 대표 음식으로 여행 시작', category: 'food', map: 'Soup Curry GARAKU Sapporo', tip: '피크 지난 시간이라 웨이팅 짧아요' },
      { id: 'd1-7', time: '17:30', title: '오도리 공원 — 눈축제 개막', desc: '대설상 & 프로젝션 맵핑. 1.5km 12개 블록, 라이트업 22:00까지', category: 'tour', map: 'Odori Park Sapporo', tip: '개막일 저녁이 가장 설레는 순간! TV타워 전망대에서 내려다보는 뷰도 추천' },
      { id: 'd1-8', time: '20:00', title: '스스키노 얼음축제', desc: '얼음조각 60여 점 + 니카 위스키 간판. 오도리에서 도보 10분', category: 'tour', map: 'Susukino Ice World' },
      { id: 'd1-9', time: '21:00', title: '야식 — 라멘요코초 미소라멘', desc: '스스키노 라멘 골목. 추운 밤 뜨거운 미소라멘 한 그릇', category: 'food', map: 'Ganso Sapporo Ramen Yokocho' },
    ],
  },
  {
    day: 2,
    date: '2/5',
    dow: '금',
    headline: '삿포로 시내 → 조잔케이 온천 료칸',
    items: [
      { id: 'd2-1', time: '08:00', title: '니조시장 아침 — 카이센동', desc: '성게·연어알·게가 올라간 해산물 덮밥으로 아침', category: 'food', map: 'Nijo Market Sapporo' },
      { id: 'd2-2', time: '09:30', title: '시계탑 · 홋카이도청 구본청사', desc: '삿포로 상징 시계탑과 붉은 벽돌 청사. 설경 산책 & 인증샷', category: 'tour', map: 'Sapporo Clock Tower' },
      { id: 'd2-3', time: '11:00', title: '오도리 공원 낮 관람', desc: '밤과 전혀 다른 대설상의 디테일. 오도리 빗세에서 스위츠 휴식', category: 'tour', map: 'Odori Bisse' },
      { id: 'd2-4', time: '12:30', title: '점심 — 징기스칸', desc: '다루마 본점 등에서 홋카이도식 양고기 구이', category: 'food', map: 'Jingisukan Daruma Honten' },
      { id: 'd2-5', time: '14:00', title: '갓파라이너호 → 조잔케이', desc: '삿포로역 앞 버스터미널 출발, 약 60분, ¥960. 완전 예약제!', category: 'move', map: 'Sapporo Station Bus Terminal', tip: '갓파라이너는 온라인 사전 예약 필수 (조테츠버스 快速7·8번은 예약 불필요 대안)' },
      { id: 'd2-6', time: '15:30', title: '료칸 체크인', desc: '조잔케이 뷰 호텔 · 누쿠모리노야도 후루카와 등. 유카타로 갈아입기', category: 'stay', map: 'Jozankei Onsen' },
      { id: 'd2-7', time: '16:00', title: '노천온천 — 눈 맞으며 온천욕', desc: '나트륨 염화물천(보온·보습). 눈 내리는 노천탕이 이 여행의 하이라이트', category: 'onsen', tip: '탕에 들어가기 전 몸 씻기, 수건은 탕 밖에!' },
      { id: 'd2-8', time: '18:30', title: '가이세키 저녁', desc: '료칸 회석요리 — 홋카이도 제철 해산물과 향토 요리 코스', category: 'food' },
      { id: 'd2-9', time: '20:00', title: '유키토로(눈 등불) 산책', desc: '조잔케이 신사 일대 촛불 눈길 (雪灯路, 2월 초 개최 시). 미개최 시 온천가 야경 산책', category: 'tour', map: 'Jozankei Shrine' },
    ],
  },
  {
    day: 3,
    date: '2/6',
    dow: '토',
    headline: '아침 온천 → 오타루 운하 야경',
    items: [
      { id: 'd3-1', time: '07:00', title: '아침 온천 & 조식', desc: '고요한 아침 노천탕 한 번 더, 료칸 조식', category: 'onsen' },
      { id: 'd3-2', time: '10:00', title: '버스로 삿포로 복귀', desc: '갓파라이너 또는 조테츠버스로 삿포로역까지 약 60~75분', category: 'move' },
      { id: 'd3-3', time: '11:30', title: '삿포로 호텔에 짐 맡기기', desc: '2박째 호텔 체크인(또는 짐 보관) 후 바로 JR 삿포로역으로', category: 'stay' },
      { id: 'd3-4', time: '12:00', title: 'JR → 오타루', desc: '쾌속 에어포트 약 40분, ¥750. 왼쪽 창가 자리에서 바다 뷰', category: 'move', map: 'JR Otaru Station', tip: '진행 방향 왼쪽이 이시카리만 바다쪽!' },
      { id: 'd3-5', time: '12:50', title: '점심 — 오타루 스시', desc: '스시야도리(초밥거리)의 마사즈시 등. 홋카이도 근해 스시', category: 'food', map: 'Otaru Masazushi' },
      { id: 'd3-6', time: '14:00', title: '사카이마치 거리 산책', desc: '키타이치 글라스 · 오르골당 · 르타오 본점(더블 프로마쥬)', category: 'shop', map: 'Sakaimachi Street Otaru' },
      { id: 'd3-7', time: '17:00', title: '오타루 운하 야경', desc: '가스등 켜진 설경 운하. 시기가 맞으면 "오타루 눈빛거리 축제" 캔들 로드까지', category: 'tour', map: 'Otaru Canal', tip: '해지는 17시 전후가 사진 황금시간' },
      { id: 'd3-8', time: '19:00', title: 'JR로 삿포로 복귀', desc: '오타루 → 삿포로 약 40분', category: 'move' },
      { id: 'd3-9', time: '20:00', title: '저녁 — 스스키노 마지막 밤', desc: '못 먹은 것 클리어: 징기스칸 or 수프카레 or 시메파르페(마무리 파르페)', category: 'food', map: 'Susukino Sapporo' },
    ],
  },
  {
    day: 4,
    date: '2/7',
    dow: '일',
    headline: '쇼핑 → 부산 도착',
    items: [
      { id: 'd4-1', time: '09:00', title: '호텔 체크아웃', desc: '짐 챙겨 삿포로역으로 이동', category: 'stay' },
      { id: 'd4-2', time: '09:30', title: '삿포로역 쇼핑', desc: '다이마루 · 스텔라 플레이스 — 키노토야 치즈타르트, 기념품 마지막 찬스', category: 'shop', map: 'Daimaru Sapporo', tip: '시간 여유 있으면 시로이코이비토 파크(지하철 30분)도 선택지' },
      { id: 'd4-3', time: '12:00', title: '쾌속 에어포트 → 신치토세공항', desc: '약 40분. 출발 3시간 전 공항 도착 권장(겨울 성수기 혼잡)', category: 'move' },
      { id: 'd4-4', time: '13:00', title: '공항 점심 & 기념품', desc: '라멘도조에서 마지막 라멘, 로이스 · 시로이코이비토 · 마루세이 버터샌드 쇼핑', category: 'food', map: 'New Chitose Airport Ramen Dojo' },
      { id: 'd4-5', time: '15:30', title: '신치토세 → 부산 비행', desc: '직항 약 2시간 40분 (실제 예약 시간에 맞춰 조정)', category: 'move' },
      { id: 'd4-6', time: '18:30', title: '김해공항 도착', desc: '수고했어요! 3박 4일 겨울 여행 끝 ❄️', category: 'move' },
    ],
  },
]

// ── 예산 (2인 총액, 원) ─────────────────────────────────────────────────────

export interface BudgetCategory {
  id: string
  label: string
  planned: number
  note: string
}

export const BUDGET: BudgetCategory[] = [
  { id: 'flight', label: '항공권', planned: 1_000_000, note: '김해—신치토세 왕복 2인, 성수기 LCC' },
  { id: 'hotel', label: '삿포로 숙박', planned: 400_000, note: '스스키노/오도리 인근 2박' },
  { id: 'ryokan', label: '조잔케이 료칸', planned: 550_000, note: '1박 2식(가이세키+조식)' },
  { id: 'food', label: '식비', planned: 400_000, note: '약 6끼 외식 + 카페/야식' },
  { id: 'transport', label: '교통', planned: 150_000, note: 'JR·지하철·갓파라이너 등' },
  { id: 'activity', label: '관광·입장료', planned: 150_000, note: 'TV타워 전망대 등' },
  { id: 'shopping', label: '쇼핑·기념품', planned: 250_000, note: '로이스, 시로이코이비토 등' },
  { id: 'etc', label: '예비비', planned: 100_000, note: '비상금' },
]

export const DEFAULT_JPY_RATE = 9.2 // 원/엔

// ── 체크리스트 ──────────────────────────────────────────────────────────────

export interface ChecklistSection {
  id: string
  title: string
  emoji: string
  items: { id: string; label: string; note?: string }[]
}

export const CHECKLIST: ChecklistSection[] = [
  {
    id: 'booking',
    title: '예약 (서두르세요!)',
    emoji: '📌',
    items: [
      { id: 'b1', label: '항공권 — 김해↔신치토세 왕복', note: '눈축제 성수기, 6개월 전 예약 권장' },
      { id: 'b2', label: '삿포로 호텔 2박 (2/4, 2/6)', note: '축제 기간 조기 마감 — 스스키노/오도리 도보권' },
      { id: 'b3', label: '조잔케이 료칸 1박 2식 (2/5)', note: '노천탕 + 가이세키 포함 플랜' },
      { id: 'b4', label: '갓파라이너호 버스 왕복', note: '완전 예약제 — 조테츠 홈페이지에서 사전 예약' },
      { id: 'b5', label: '여행자보험 가입', note: '겨울 빙판 낙상 대비 필수' },
    ],
  },
  {
    id: 'before',
    title: '출국 전 준비',
    emoji: '🛂',
    items: [
      { id: 'p1', label: '여권 유효기간 6개월+ 확인' },
      { id: 'p2', label: '비짓재팬웹(Visit Japan Web) 등록', note: '입국심사·세관 QR — 출발 전 미리' },
      { id: 'p3', label: 'eSIM/유심/로밍 준비' },
      { id: 'p4', label: '엔화 환전 + 트래블카드 충전', note: '현금 2인 3~5만엔 + 트래블월렛/트래블로그' },
      { id: 'p5', label: '아이폰 지갑에 Suica 발급', note: 'JR·지하철·편의점 전부 커버' },
      { id: 'p6', label: '구글맵 오프라인 지도 저장 (삿포로·오타루)' },
      { id: 'p7', label: 'e-티켓·바우처 폰에 저장' },
    ],
  },
  {
    id: 'packing',
    title: '짐싸기 — 방한이 전부!',
    emoji: '🧳',
    items: [
      { id: 'k1', label: '방수 방한 부츠', note: '눈길·빙판 필수, 운동화 금지' },
      { id: 'k2', label: '아이젠(미끄럼 방지)', note: '빙판 인도에서 진가 발휘' },
      { id: 'k3', label: '롱패딩 + 히트텍 상하' },
      { id: 'k4', label: '장갑 · 니트모자 · 목도리' },
      { id: 'k5', label: '핫팩 넉넉히', note: '야간 눈축제 관람 시 생명템' },
      { id: 'k6', label: '보습크림 · 립밤', note: '건조한 실내 난방 대비' },
      { id: 'k7', label: '110V 돼지코 어댑터' },
      { id: 'k8', label: '상비약 (감기약·소화제·밴드)' },
      { id: 'k9', label: '선글라스', note: '맑은 날 설면 반사가 강해요' },
    ],
  },
  {
    id: 'onsen',
    title: '온천 준비',
    emoji: '♨️',
    items: [
      { id: 'o1', label: '문신 커버 스티커 (해당 시)', note: '문신 노출 시 입욕 제한 료칸 있음' },
      { id: 'o2', label: '온천 에티켓 숙지', note: '가이드 탭 참고 — 수영복 불필요, 수건은 료칸 제공' },
    ],
  },
]

// ── 가이드 ──────────────────────────────────────────────────────────────────

export interface GuideCard {
  title: string
  lines: string[]
  map?: string
}

export interface GuideSection {
  id: string
  title: string
  emoji: string
  cards: GuideCard[]
}

export const GUIDE: GuideSection[] = [
  {
    id: 'festival',
    title: '삿포로 눈축제 3개 회장',
    emoji: '❄️',
    cards: [
      {
        title: '오도리 회장 (메인)',
        lines: [
          '도심 1.5km, 12개 블록에 대형 설상 조각',
          '프로젝션 맵핑 쇼 + 라이트업 22:00까지',
          '삿포로 TV타워 전망대에서 파노라마 뷰',
          '지하철 오도리역 바로 앞 — 지하도(오로라타운)로 추위 피하며 이동 가능',
        ],
        map: 'Odori Park Sapporo',
      },
      {
        title: '스스키노 회장 (얼음)',
        lines: ['환락가 한복판 얼음조각 60여 점', '라이트업 23:00까지 — 저녁식사 후 산책 코스', '오도리에서 도보 10분'],
        map: 'Susukino Sapporo',
      },
      {
        title: '츠도무 회장 (체험)',
        lines: ['대형 눈 미끄럼틀 · 스노 래프팅 등 체험형', '10:00–16:00 낮 운영, 셔틀버스 이용', '일정이 빠듯하면 과감히 생략 가능'],
        map: 'Sapporo Community Dome Tsudome',
      },
    ],
  },
  {
    id: 'onsen',
    title: '조잔케이 온천 가이드',
    emoji: '♨️',
    cards: [
      {
        title: '조잔케이(定山渓)란?',
        lines: [
          '삿포로 남서쪽 27km, "삿포로의 안방 온천"',
          '나트륨 염화물천 — 보온·보습 효과로 겨울에 최고',
          '갓파(전설 속 요괴) 마을 — 곳곳에 갓파 동상',
          '2월 초 "유키토로(눈 등불)" 촛불 행사 개최 시 필견',
        ],
        map: 'Jozankei Onsen',
      },
      {
        title: '온천 에티켓 6계명',
        lines: [
          '① 탕에 들어가기 전 몸 씻기 (카케유)',
          '② 수건은 탕 물에 넣지 않기 — 머리 위에',
          '③ 긴 머리는 묶기',
          '④ 수영복 착용 금지 (전원 나체 입욕)',
          '⑤ 욕장 내 사진 촬영 절대 금지',
          '⑥ 입욕 전후 물 충분히 마시기',
        ],
      },
    ],
  },
  {
    id: 'food',
    title: '먹킷리스트',
    emoji: '🍜',
    cards: [
      { title: '수프카레 GARAKU', lines: ['삿포로 수프카레 최고 인기점 (스스키노)', '치킨·야채 카레 + 밥 라지 무료'], map: 'Soup Curry GARAKU Sapporo' },
      { title: '징기스칸 다루마 본점', lines: ['숯불 양고기 구이, 스스키노 노포', '웨이팅 있지만 회전 빠름 — 늦은 밤도 OK'], map: 'Jingisukan Daruma Honten' },
      { title: '라멘요코초', lines: ['미소라멘 발상지 삿포로의 라멘 골목', '17개 점포 — 신겐·시라카바산소도 유명'], map: 'Ganso Sapporo Ramen Yokocho' },
      { title: '니조시장 카이센동', lines: ['아침 해산물 덮밥 — 성게·연어알·게', '오이소 등 시장 안 식당'], map: 'Nijo Market Sapporo' },
      { title: '르타오 본점 (오타루)', lines: ['더블 프로마쥬 치즈케이크', '사카이마치 거리 끝, 카페 이용 가능'], map: 'LeTAO Otaru' },
      { title: '시메파르페', lines: ['술·저녁 후 파르페로 마무리하는 삿포로 문화', '스스키노 파르페 전문점 밤 늦게까지'], map: 'Parfait Susukino' },
    ],
  },
  {
    id: 'transport',
    title: '교통 한눈에',
    emoji: '🚆',
    cards: [
      {
        title: '핵심 노선',
        lines: [
          '공항 ↔ 삿포로: JR 쾌속 에어포트 40분 · ¥1,150 · 15분 간격',
          '삿포로 ↔ 오타루: JR 40분 · ¥750',
          '삿포로 ↔ 조잔케이: 갓파라이너호 60분 · ¥960 (예약제)',
          '시내: 지하철 3개 노선 — 오도리·스스키노역이 축제 거점',
        ],
      },
      {
        title: '결제 팁',
        lines: [
          '아이폰 지갑 Suica로 JR·지하철·편의점 논스톱',
          '겨울 폭설로 JR 지연 잦음 — 공항 갈 땐 여유 있게',
          '택시는 비쌈 — 심야 이동 외엔 대중교통 추천',
        ],
      },
    ],
  },
  {
    id: 'weather',
    title: '2월 삿포로 날씨 & 복장',
    emoji: '🌨️',
    cards: [
      {
        title: '날씨',
        lines: ['평균 최고 -1°C / 최저 -8°C, 체감 그 이하', '적설 80cm+ — 도로 대부분 눈·빙판', '실내·지하도는 따뜻함 — 벗기 쉬운 레이어링'],
      },
      {
        title: '복장 공식',
        lines: ['히트텍 + 니트 + 롱패딩', '방수 부츠 + 아이젠 + 두꺼운 양말', '모자·장갑·목도리 + 주머니에 핫팩'],
      },
    ],
  },
]

// ── 여행 일본어 ─────────────────────────────────────────────────────────────

export interface Phrase {
  jp: string
  read: string
  ko: string
}

export const PHRASES: Phrase[] = [
  { jp: 'すみません', read: '스미마셍', ko: '실례합니다 / 저기요' },
  { jp: 'ありがとうございます', read: '아리가토- 고자이마스', ko: '감사합니다' },
  { jp: 'これください', read: '코레 쿠다사이', ko: '이거 주세요' },
  { jp: 'いくらですか', read: '이쿠라데스카', ko: '얼마예요?' },
  { jp: 'おすすめは何ですか', read: '오스스메와 난데스카', ko: '추천 메뉴가 뭐예요?' },
  { jp: 'カードで払えますか', read: '카-도데 하라에마스카', ko: '카드 결제 되나요?' },
  { jp: 'トイレはどこですか', read: '토이레와 도코데스카', ko: '화장실 어디예요?' },
  { jp: '予約した○○です', read: '요야쿠시타 ○○데스', ko: '예약한 ○○입니다' },
  { jp: '温泉は何時までですか', read: '온센와 난지마데 데스카', ko: '온천은 몇 시까지예요?' },
  { jp: '写真を撮ってもいいですか', read: '샤신오 톳테모 이이데스카', ko: '사진 찍어도 되나요?' },
  { jp: '持ち帰りでお願いします', read: '모치카에리데 오네가이시마스', ko: '포장해 주세요' },
  { jp: '美味しかったです', read: '오이시캇타데스', ko: '맛있었어요' },
]

// ── 유틸 ────────────────────────────────────────────────────────────────────

export const fmtKRW = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`

export const mapUrl = (q: string) => `https://maps.google.com/?q=${encodeURIComponent(q)}`
