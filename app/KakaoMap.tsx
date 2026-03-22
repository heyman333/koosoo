"use client";

import Script from "next/script";
import { useRef } from "react";

declare global {
  interface Window {
    naver: any;
  }
}

export default function NaverDynamicMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  function initMap() {
    if (!mapRef.current || !window.naver) return;
    const center = new window.naver.maps.LatLng(37.538338, 127.074664);
    const map = new window.naver.maps.Map(mapRef.current, {
      center,
      zoom: 16,
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
      .map-pin-inner {
        animation: pin-breathe 2.8s ease-in-out 0.55s infinite;
      }
    `;
    document.head.appendChild(styleEl);

    const markerIcon = {
      content: `
        <div id="map-pin-outer" class="map-pin-outer"><div class="map-pin-inner">
          <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2C9.716 2 3 8.716 3 17c0 11.8 15 29 15 29S33 28.8 33 17C33 8.716 26.284 2 18 2z" fill="#2c2a24"/>
            <path d="M18 2C9.716 2 3 8.716 3 17c0 11.8 15 29 15 29S33 28.8 33 17C33 8.716 26.284 2 18 2z" fill="none" stroke="rgba(255,248,240,0.18)" stroke-width="1.2"/>
            <path d="M18 12.5c-.85-.85-2-1.35-3.2-1.35s-2.35.5-3.2 1.35c-1.77 1.77-1.77 4.63 0 6.4L18 25l6.4-6.1c1.77-1.77 1.77-4.63 0-6.4-.85-.85-2-1.35-3.2-1.35s-2.35.5-3.2 1.35z" fill="#f5ede4" opacity="0.92"/>
          </svg>
        </div></div>`,
      anchor: new window.naver.maps.Point(20, 48),
    };
    new window.naver.maps.Marker({ position: center, map, icon: markerIcon });

    // 지도 뷰포트 진입 시 핀 애니메이션 재트리거
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const outer = document.getElementById("map-pin-outer");
        if (!outer) return;
        const inner = outer.querySelector<HTMLElement>(".map-pin-inner");
        outer.style.animation = "none";
        if (inner) inner.style.animation = "none";
        outer.offsetWidth; // reflow
        outer.style.animation = "";
        if (inner) inner.style.animation = "";
      });
    }, { threshold: 0.4 });

    if (mapRef.current) obs.observe(mapRef.current);
  }

  return (
    <>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div
        ref={mapRef}
        style={{ width: "100%", height: 280, borderRadius: 12, overflow: "hidden" }}
      />
    </>
  );
}
