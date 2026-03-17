"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!apiKey || !containerRef.current) return;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const coords = new window.kakao.maps.LatLng(37.5416, 127.0733);
        const options = {
          center: coords,
          level: 4,
        };
        const map = new window.kakao.maps.Map(containerRef.current, options);
        mapRef.current = map;

        const marker = new window.kakao.maps.Marker({ position: coords });
        marker.setMap(map);

        const infowindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:6px 10px;font-size:13px;font-weight:600;color:#333">건국대학교 동문회관</div>`,
        });
        infowindow.open(map, marker);
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: 260, borderRadius: 12, overflow: "hidden" }}
    />
  );
}
