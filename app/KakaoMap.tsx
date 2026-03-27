"use client";

import Script from "next/script";
import { useRef, useEffect } from "react";

declare global {
  interface Window { naver: any; }
}

interface Props { showRoute?: boolean; }

// 건대입구역 5번출구 (동쪽 출구, 7호선 라인 서측) → 건국대학교 동문회관
const ROUTE_COORDS: [number, number][] = [
  [37.5402, 127.0706], // 5번출구 노란 ⑤ 마커 위치 (올리브영 좌측)
  [37.5397, 127.0718],
  [37.5392, 127.0730],
  [37.5388, 127.0740],
  [37.538338, 127.074664], // 건국대학교 동문회관
];

export default function NaverDynamicMap({ showRoute = false }: Props) {
  const mapRef        = useRef<HTMLDivElement>(null);
  const mapInstance   = useRef<any>(null);
  const polyline      = useRef<any>(null);
  const startMarker   = useRef<any>(null);
  const animTimer     = useRef<ReturnType<typeof setInterval> | null>(null);
  const showRouteRef  = useRef(showRoute);

  // 항상 최신 showRoute 값 유지
  showRouteRef.current = showRoute;

  // initMap을 ref에 저장 → Script onLoad가 항상 최신 버전을 호출
  const initMapRef = useRef<() => void>(() => {});

  function drawRoute() {
    const map = mapInstance.current;
    if (!map || !window.naver?.maps) return;

    // 기존 경로 초기화
    if (animTimer.current) { clearInterval(animTimer.current); animTimer.current = null; }
    if (polyline.current)   { polyline.current.setMap(null);   polyline.current = null; }
    if (startMarker.current){ startMarker.current.setMap(null); startMarker.current = null; }

    const path = ROUTE_COORDS.map(([lat, lng]) => new window.naver.maps.LatLng(lat, lng));

    // 출발지 마커
    startMarker.current = new window.naver.maps.Marker({
      position: path[0],
      map,
      icon: {
        content: `<div style="background:#5b8dee;color:#fff;font-size:10px;font-weight:700;padding:3px 8px;border-radius:20px;white-space:nowrap;box-shadow:0 2px 8px rgba(91,141,238,0.35);font-family:sans-serif;">🚇 5번출구</div>`,
        anchor: new window.naver.maps.Point(40, 12),
      },
    });

    // Polyline 생성 후 getPath().push()로 점진적 드로우
    polyline.current = new window.naver.maps.Polyline({
      map,
      path: [path[0]],
      strokeColor: "#5b8dee",
      strokeWeight: 5,
      strokeOpacity: 0.9,
      strokeLineCap: "round",
      strokeLineJoin: "round",
    });

    let i = 1;
    animTimer.current = setInterval(() => {
      if (!polyline.current) return;
      if (i < path.length) {
        polyline.current.getPath().push(path[i]);
        i++;
      } else {
        clearInterval(animTimer.current!);
        animTimer.current = null;
      }
    }, 90);
  }

  function hideRoute() {
    if (animTimer.current) { clearInterval(animTimer.current); animTimer.current = null; }
    if (polyline.current)   { polyline.current.setMap(null);   polyline.current = null; }
    if (startMarker.current){ startMarker.current.setMap(null); startMarker.current = null; }
  }

  // initMapRef에 최신 로직 저장
  initMapRef.current = () => {
    if (!mapRef.current || !window.naver?.maps) return;
    if (mapInstance.current) return; // 중복 초기화 방지

    const center = new window.naver.maps.LatLng(37.538338, 127.074664);
    const map = new window.naver.maps.Map(mapRef.current, {
      center,
      zoom: 16,
      minZoom: 14,
      scaleControl: false,
      logoControlOptions: { position: window.naver.maps.Position.BOTTOM_LEFT },
      mapDataControl: false,
      zoomControlOptions: { position: window.naver.maps.Position.TOP_RIGHT },
    });

    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes pin-drop {
        0%   { transform: translateY(-20px) scale(0.75); opacity: 0; }
        65%  { transform: translateY(5px) scale(1.04); opacity: 1; }
        82%  { transform: translateY(-3px) scale(0.98); }
        100% { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes pin-breathe {
        0%, 100% { transform: scale(1); }
        50%       { transform: scale(1.07); }
      }
      .map-pin-outer {
        width: 36px; height: 48px;
        display: flex; align-items: flex-start; justify-content: center;
        filter: drop-shadow(0 4px 10px rgba(44,42,36,0.28));
        animation: pin-drop 0.5s cubic-bezier(.22,.68,0,1.2) forwards;
      }
      .map-pin-inner { animation: pin-breathe 2.8s ease-in-out 0.55s infinite; }
    `;
    document.head.appendChild(styleEl);

    new window.naver.maps.Marker({
      position: center,
      map,
      icon: {
        content: `<div id="map-pin-outer" class="map-pin-outer"><div class="map-pin-inner">
          <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2C9.716 2 3 8.716 3 17c0 11.8 15 29 15 29S33 28.8 33 17C33 8.716 26.284 2 18 2z" fill="#2c2a24"/>
            <path d="M18 2C9.716 2 3 8.716 3 17c0 11.8 15 29 15 29S33 28.8 33 17C33 8.716 26.284 2 18 2z" fill="none" stroke="rgba(255,248,240,0.18)" stroke-width="1.2"/>
            <path d="M18 12.5c-.85-.85-2-1.35-3.2-1.35s-2.35.5-3.2 1.35c-1.77 1.77-1.77 4.63 0 6.4L18 25l6.4-6.1c1.77-1.77 1.77-4.63 0-6.4-.85-.85-2-1.35-3.2-1.35s-2.35.5-3.2 1.35z" fill="#f5ede4" opacity="0.92"/>
          </svg>
        </div></div>`,
        anchor: new window.naver.maps.Point(20, 48),
      },
    });

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const outer = document.getElementById("map-pin-outer");
        if (!outer) return;
        const inner = outer.querySelector<HTMLElement>(".map-pin-inner");
        outer.style.animation = "none";
        if (inner) inner.style.animation = "none";
        outer.offsetWidth;
        outer.style.animation = "";
        if (inner) inner.style.animation = "";
      });
    }, { threshold: 0.4 });
    if (mapRef.current) obs.observe(mapRef.current);

    mapInstance.current = map;

    if (showRouteRef.current) drawRoute();
  };

  // showRoute 변화 반응
  useEffect(() => {
    if (!mapInstance.current) return;
    if (showRoute) drawRoute();
    else hideRoute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRoute]);

  // 이미 naver 스크립트가 로드된 경우 (dev hot-reload 등) 직접 초기화
  useEffect(() => {
    if (window.naver?.maps) initMapRef.current();
  }, []);

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={() => initMapRef.current()}
      />
      <div
        ref={mapRef}
        style={{ width: "100%", height: 280, borderRadius: 12, overflow: "hidden" }}
      />
    </>
  );
}
