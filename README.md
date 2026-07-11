# ❄️ 삿포로 겨울 여행 가이드

2027 삿포로 눈축제 & 조잔케이 온천 3박 4일 — 나만의 모바일 여행 가이드 앱.

- **여행**: 2027.2.4(목) ~ 2.7(일) · 부산(김해) ↔ 신치토세 · 2인 · 총예산 300만원
- **코스**: 삿포로 눈축제(오도리·스스키노) → 조잔케이 온천 료칸 1박 → 오타루 운하

## 기능

| 탭 | 내용 |
|---|---|
| 홈 | 출발 카운트다운, 여정 노선도(SVG 애니메이션), **실시간 삿포로 날씨**(Open-Meteo) + 기온 차트 |
| 일정 | Day 1–4 타임라인, 구글맵 연결, 항목별 완료 체크 |
| 예산 | 도넛 게이지, **항공권 시나리오 플래너**, **특가 레이더**(실시간 검색 딥링크 + 가격 추세 차트), **지출 건별 기록**(¥ 입력 시 실시간 환율 자동 환산) |
| 체크 | 예약·출국 준비·짐싸기 체크리스트, 섹션별 진행 링, **데이터 백업**(내보내기/가져오기) |
| 가이드 | 눈축제 회장·온천 카드 캐러셀, 먹킷리스트 그리드, 교통 노선 다이어그램 |

- **PWA 오프라인 지원**: 홈 화면에 추가하면 현지에서 인터넷 없이도 열립니다 (날씨·환율은 마지막 값 캐시)
- 모든 기록은 `localStorage` 저장, 체크 탭의 백업 카드로 폰 간 이전 가능
- 실시간 환율은 open.er-api.com, 날씨는 Open-Meteo (둘 다 키 불필요)

## 항공권 자동 조회 활성화 (선택)

`api/flight-price.js`가 Amadeus Self-Service API로 PUS→CTS 최저가를 조회합니다.
[developers.amadeus.com](https://developers.amadeus.com)에서 무료 키 발급 후 Vercel 프로젝트 환경변수에
`AMADEUS_CLIENT_ID` / `AMADEUS_CLIENT_SECRET`를 넣으면 특가 레이더에 자동 조회가 나타납니다.

## 기술 스택

Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · lucide-react · vite-plugin-pwa · Vitest

## 개발

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 프로덕션 빌드 (dist/)
npm test        # 데이터 정합성 테스트 (vitest)
```

push 시 GitHub Actions가 빌드+테스트를 자동 실행합니다.
