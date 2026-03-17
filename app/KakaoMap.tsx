export default function NaverStaticMap() {
  return (
    <div style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/naver-map"
        alt="건국대학교 동문회관 지도"
        style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
      />
    </div>
  );
}
