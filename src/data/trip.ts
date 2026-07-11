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

export interface BudgetLine {
  label: string
  amount: number // 2인 합계, 원
  note?: string
}

export interface BudgetCategory {
  id: string
  label: string
  planned: number // = lines 합계
  note: string
  lines: BudgetLine[]
}

/* 2026년 기준 시세로 산정 (¥100 ≈ 920원). 눈축제 주간은 항공·숙박이 더 뛸 수 있어요. */
export const BUDGET: BudgetCategory[] = [
  {
    id: 'flight',
    label: '항공권',
    planned: 1_000_000,
    note: '김해—신치토세 왕복, 인당 50만원',
    lines: [
      { label: '왕복 운임 44만 × 2인', amount: 880_000, note: '2월 평균 시세 — 축제 주간·주말은 60만+, 일찍 끊을수록 이득' },
      { label: '위탁수하물·좌석 지정 6만 × 2인', amount: 120_000, note: 'LCC 특가운임은 수하물 별도' },
    ],
  },
  {
    id: 'hotel',
    label: '삿포로 호텔',
    planned: 440_000,
    note: '스스키노/오도리 트윈 2박 (2/4, 2/6)',
    lines: [
      { label: '1박째 2/4(목) 트윈', amount: 220_000, note: '눈축제 기간 3성급 ¥24,000 수준' },
      { label: '2박째 2/6(토) 트윈', amount: 220_000, note: '토요일이라 조기 마감 주의' },
    ],
  },
  {
    id: 'ryokan',
    label: '조잔케이 료칸',
    planned: 560_000,
    note: '1박 2식 — 2/5(금), 2인',
    lines: [
      { label: '가이세키 석식 + 조식 플랜 2인', amount: 560_000, note: '노천탕 중상급 기준 ¥61,000 — 뷰호텔 뷔페 플랜이면 ~40만으로 절약 가능' },
    ],
  },
  {
    id: 'food',
    label: '식비',
    planned: 420_000,
    note: '외식 8끼 + 카페·간식 (가이세키·료칸 조식 제외)',
    lines: [
      { label: 'D1 점심 · 수프카레 GARAKU', amount: 30_000, note: '¥1,600 × 2인' },
      { label: 'D1 야식 · 라멘요코초 미소라멘', amount: 21_000, note: '¥1,150 × 2인' },
      { label: 'D2 아침 · 니조시장 카이센동', amount: 46_000, note: '¥2,500 × 2인' },
      { label: 'D2 점심 · 징기스칸 다루마', amount: 46_000, note: '¥2,500 × 2인' },
      { label: 'D3 점심 · 오타루 스시', amount: 65_000, note: '¥3,500 × 2인 세트' },
      { label: 'D3 카페 · 르타오 본점', amount: 28_000, note: '¥1,500 × 2인, 더블 프로마쥬 세트' },
      { label: 'D3 저녁 · 스스키노 마지막 밤', amount: 55_000, note: '¥3,000 × 2인 + 시메파르페' },
      { label: 'D4 점심 · 공항 라멘도조', amount: 23_000, note: '¥1,250 × 2인' },
      { label: '카페·간식·편의점 버퍼', amount: 106_000, note: '아침 커피, 야간 편의점, 축제 간식' },
    ],
  },
  {
    id: 'transport',
    label: '교통',
    planned: 140_000,
    note: '현지 이동 전체 (2인 왕복)',
    lines: [
      { label: 'JR 쾌속 에어포트 공항 왕복', amount: 42_000, note: '¥1,150 × 2인 × 2회' },
      { label: '갓파라이너호 조잔케이 왕복', amount: 35_000, note: '¥960 × 2인 × 2회 — 예약제' },
      { label: 'JR 오타루 왕복', amount: 28_000, note: '¥750 × 2인 × 2회' },
      { label: '지하철·시내버스', amount: 35_000, note: '¥210~ × 여러 회, Suica 충전' },
    ],
  },
  {
    id: 'activity',
    label: '관광·체험',
    planned: 140_000,
    note: '입장료 + 축제 즐길거리',
    lines: [
      { label: 'TV타워 전망대', amount: 18_000, note: '¥1,000 × 2인 — 야경 타임 추천' },
      { label: '눈축제 먹거리·굿즈', amount: 45_000, note: '회장 포장마차, 핫와인·구이' },
      { label: '오타루 오르골·유리공예', amount: 45_000, note: '소품 1~2개 기준' },
      { label: '기타 입장·체험', amount: 32_000, note: '츠도무 튜빙, 신사 오마모리 등' },
    ],
  },
  {
    id: 'shopping',
    label: '쇼핑·기념품',
    planned: 220_000,
    note: '공항·백화점 면세 포함',
    lines: [
      { label: '로이스 초콜릿', amount: 40_000, note: '생초콜릿 4~5박스' },
      { label: '시로이코이비토', amount: 40_000, note: '선물용 2~3박스' },
      { label: '마루세이 버터샌드·키노토야', amount: 40_000 },
      { label: '지인 선물·기타', amount: 100_000 },
    ],
  },
  {
    id: 'etc',
    label: '예비비',
    planned: 80_000,
    note: '비상금 + 환율 변동 대비',
    lines: [{ label: '예비 현금', amount: 80_000, note: '남으면 공항 쇼핑으로!' }],
  },
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
]


// ── 여정 노선도 ──────────────────────────────────────────────────────────────

export interface RouteStop {
  id: string
  name: string
  sub: string
  emoji: string
  day: string
}

export const ROUTE: RouteStop[] = [
  { id: 'pus', name: '김해공항', sub: '부산 출발', emoji: '✈️', day: 'DAY 1' },
  { id: 'cts', name: '신치토세', sub: '직항 2h 20m', emoji: '🛬', day: 'DAY 1' },
  { id: 'spk', name: '삿포로', sub: '눈축제 · 2박', emoji: '❄️', day: 'DAY 1·3' },
  { id: 'jzk', name: '조잔케이', sub: '온천 료칸 1박', emoji: '♨️', day: 'DAY 2' },
  { id: 'otr', name: '오타루', sub: '운하 당일치기', emoji: '🏮', day: 'DAY 3' },
]

// ── 눈축제 회장 & 스팟 ───────────────────────────────────────────────────────

export interface Venue {
  id: 'odori' | 'susukino' | 'tsudome' | 'jozankei'
  name: string
  tag: string
  emoji: string
  lines: string[]
  map: string
}

export const VENUES: Venue[] = [
  {
    id: 'odori',
    name: '오도리 회장',
    tag: '메인 · 대설상',
    emoji: '🏔️',
    lines: ['도심 1.5km 대형 설상 조각', '프로젝션 맵핑 + 라이트업 ~22시', 'TV타워 전망대 파노라마 뷰'],
    map: 'Odori Park Sapporo',
  },
  {
    id: 'susukino',
    name: '스스키노 회장',
    tag: '얼음조각',
    emoji: '🧊',
    lines: ['얼음조각 60여 점, 라이트업 ~23시', '저녁식사 후 산책 코스', '오도리에서 도보 10분'],
    map: 'Susukino Sapporo',
  },
  {
    id: 'tsudome',
    name: '츠도무 회장',
    tag: '체험 · 낮',
    emoji: '🛷',
    lines: ['대형 눈 미끄럼틀 · 스노 래프팅', '10:00–16:00 낮 운영, 셔틀버스', '일정 빠듯하면 과감히 생략'],
    map: 'Sapporo Community Dome Tsudome',
  },
  {
    id: 'jozankei',
    name: '조잔케이 온천',
    tag: '료칸 1박',
    emoji: '♨️',
    lines: ['삿포로 남서쪽 27km, 갓파 마을', '나트륨 염화물천 — 겨울 보온 최고', '2월 초 유키토로 눈 등불 (개최 시)'],
    map: 'Jozankei Onsen',
  },
]

// ── 먹킷리스트 ───────────────────────────────────────────────────────────────

export interface FoodSpot {
  emoji: string
  name: string
  desc: string
  map: string
}

export const FOOD_SPOTS: FoodSpot[] = [
  { emoji: '🍛', name: '수프카레 GARAKU', desc: '삿포로 수프카레 1티어', map: 'Soup Curry GARAKU Sapporo' },
  { emoji: '🍖', name: '징기스칸 다루마', desc: '숯불 양고기 노포', map: 'Jingisukan Daruma Honten' },
  { emoji: '🍜', name: '라멘요코초', desc: '미소라멘 발상지 골목', map: 'Ganso Sapporo Ramen Yokocho' },
  { emoji: '🦀', name: '니조시장 카이센동', desc: '성게·연어알 아침 덮밥', map: 'Nijo Market Sapporo' },
  { emoji: '🍰', name: '르타오 본점', desc: '오타루 더블 프로마쥬', map: 'LeTAO Otaru' },
  { emoji: '🍨', name: '시메파르페', desc: '삿포로식 마무리 파르페', map: 'Parfait Susukino' },
]

// ── 교통 노선 ────────────────────────────────────────────────────────────────

export interface TransitRoute {
  from: string
  to: string
  mode: string
  minutes: number
  fare: string
  note?: string
}

export const TRANSIT: TransitRoute[] = [
  { from: '신치토세', to: '삿포로', mode: 'JR 쾌속 에어포트', minutes: 40, fare: '¥1,150', note: '15분 간격' },
  { from: '삿포로', to: '조잔케이', mode: '갓파라이너호 버스', minutes: 60, fare: '¥960', note: '완전 예약제!' },
  { from: '삿포로', to: '오타루', mode: 'JR 쾌속', minutes: 40, fare: '¥750', note: '왼쪽 창가 = 바다 뷰' },
  { from: '시내 이동', to: '축제 회장', mode: '지하철 · 도보', minutes: 10, fare: '¥210~', note: '오도리·스스키노역 거점' },
]

export const TRANSIT_TIP = '아이폰 지갑에 Suica를 발급해두면 JR·지하철·편의점까지 논스톱이에요. 겨울 폭설로 JR 지연이 잦으니 공항 갈 땐 여유 있게!'

// ── 유틸 ────────────────────────────────────────────────────────────────────

export const fmtKRW = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`

export const mapUrl = (q: string) => `https://maps.google.com/?q=${encodeURIComponent(q)}`
