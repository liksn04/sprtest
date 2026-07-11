import { useEffect, useRef, useState } from 'react'
import { Map as MapIcon, KeyRound } from 'lucide-react'
import { MAP_SPOTS, MAP_ROUTES, SPOT_CAT_COLOR, mapUrl } from '../data/trip'

const KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined

let loader: Promise<void> | null = null
function loadMaps(key: string): Promise<void> {
  if (window.google?.maps?.Map) return Promise.resolve()
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&language=ko&region=JP&loading=async&callback=__gmapsReady`
      s.async = true
      ;(window as unknown as Record<string, unknown>).__gmapsReady = () => resolve()
      s.onerror = () => reject(new Error('maps script failed'))
      document.head.appendChild(s)
    })
  }
  return loader
}

function SetupCard() {
  return (
    <section className="rounded-3xl bg-card p-5 shadow-card">
      <div className="flex items-center gap-2">
        <MapIcon size={16} className="text-accent" />
        <h2 className="text-[15px] font-bold">여행 지도</h2>
      </div>
      <div className="mt-3 rounded-2xl bg-fill p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold text-sub">
          <KeyRound size={13} className="text-warn" /> Google Maps 키를 기다리고 있어요
        </p>
        <ol className="mt-2.5 list-decimal space-y-1.5 pl-4 text-[11px] leading-relaxed text-mute">
          <li>console.cloud.google.com → Maps JavaScript API 사용 설정</li>
          <li>사용자 인증 정보 → API 키 생성</li>
          <li>키 제한: HTTP 리퍼러 → <code className="font-bold">sprtest-one.vercel.app/*</code></li>
          <li>Vercel 프로젝트 → Settings → Environment Variables → <code className="font-bold">VITE_GOOGLE_MAPS_KEY</code> 추가 후 Redeploy</li>
        </ol>
        <p className="mt-2.5 text-[11px] leading-relaxed text-mute">
          키가 들어오면 이 자리에 전체 스팟 마커 + Day별 동선이 그려진 구글맵이 나타나요.
        </p>
      </div>
    </section>
  )
}

/** Google Map with every trip spot and day-route polylines; markers open Google Maps proper. */
export default function TripMap() {
  const hostRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!KEY || !hostRef.current) return
    let cancelled = false

    loadMaps(KEY)
      .then(() => {
        if (cancelled || !hostRef.current) return
        const g = window.google
        const map = new g.maps.Map(hostRef.current, {
          center: { lat: 43.03, lng: 141.3 },
          zoom: 9,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          clickableIcons: false,
          gestureHandling: 'cooperative',
        })

        const bounds = new g.maps.LatLngBounds()
        const info = new g.maps.InfoWindow()

        for (const spot of MAP_SPOTS) {
          const pos = { lat: spot.lat, lng: spot.lng }
          bounds.extend(pos)
          const marker = new g.maps.Marker({
            map,
            position: pos,
            title: spot.name,
            label: { text: spot.emoji, fontSize: '13px' },
            icon: {
              path: g.maps.SymbolPath.CIRCLE,
              scale: 13,
              fillColor: SPOT_CAT_COLOR[spot.cat],
              fillOpacity: 0.25,
              strokeColor: SPOT_CAT_COLOR[spot.cat],
              strokeWeight: 2,
            },
          })
          marker.addListener('click', () => {
            info.setContent(
              `<div style="font-family:inherit;min-width:150px">
                 <p style="margin:0;font-weight:800;font-size:13px">${spot.emoji} ${spot.name}</p>
                 <p style="margin:4px 0 8px;font-size:11px;color:#4e5968">${spot.desc}</p>
                 <a href="${mapUrl(spot.map)}" target="_blank" rel="noreferrer"
                    style="font-size:11px;font-weight:700;color:#3182f6;text-decoration:none">구글맵에서 열기 →</a>
               </div>`,
            )
            info.open({ map, anchor: marker })
          })
        }

        for (const route of MAP_ROUTES) {
          new g.maps.Polyline({
            map,
            path: route.path,
            strokeColor: route.color,
            strokeOpacity: 0.75,
            strokeWeight: 3,
            geodesic: true,
          })
        }

        map.fitBounds(bounds, { top: 30, bottom: 20, left: 24, right: 24 })
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!KEY) return <SetupCard />
  if (failed) {
    return (
      <section className="rounded-3xl bg-card p-5 shadow-card">
        <div className="flex items-center gap-2">
          <MapIcon size={16} className="text-accent" />
          <h2 className="text-[15px] font-bold">여행 지도</h2>
        </div>
        <p className="mt-3 rounded-2xl bg-fill px-3.5 py-3 text-xs leading-relaxed text-sub">
          지도를 불러오지 못했어요. 네트워크 또는 API 키 리퍼러 제한을 확인해 주세요.
        </p>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-3xl bg-card shadow-card">
      <div className="flex items-center gap-2 px-5 pb-3 pt-4">
        <MapIcon size={16} className="text-accent" />
        <h2 className="text-[15px] font-bold">여행 지도</h2>
        <span className="ml-auto text-[10px] font-medium text-mute">마커 탭 → 구글맵 열기</span>
      </div>
      <div ref={hostRef} className="h-[320px] w-full bg-fill" aria-label="여행 스팟 지도" />
    </section>
  )
}
