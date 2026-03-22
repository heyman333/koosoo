"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import KakaoMap from "./KakaoMap";

gsap.registerPlugin(ScrollTrigger);

/* ── Typewriter Component ── */
function TypewriterPoem({
  text, delay = 0, canStart = true, onComplete,
}: {
  text: string; delay?: number; canStart?: boolean; onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!canStart || started.current) return;
    started.current = true;
    let i = 0;
    const timer = setTimeout(() => {
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(tick); onComplete?.(); }
      }, 18);
      return () => clearInterval(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [canStart, text, delay, onComplete]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* 높이 고정용 ghost text */}
      <div className="poem-text" style={{ whiteSpace: "pre-line", visibility: "hidden", pointerEvents: "none" }}>
        {text}
      </div>
      {/* 타이핑 텍스트 */}
      <div className="poem-text" style={{ whiteSpace: "pre-line", position: "absolute", inset: 0 }}>
        {displayed}
        {displayed.length < text.length && displayed.length > 0 && <span className="tw-cursor" />}
      </div>
    </div>
  );
}

/* ── Types ── */
interface GBEntry {
  id: number;
  name: string;
  msg: string;
  date: string;
  color: string;
  attend?: "yes" | "no";
  side?: "groom" | "bride";
  meal?: "yes" | "no";
  headcount?: number;
}

/* ── Constants ── */
const GB_COLORS = [
  "#fef9e7", "#e8f5e9", "#fce4ec", "#e3f2fd",
  "#f3e5f5", "#e0f7fa", "#fff8e1", "#fbe9e7",
];

const INITIAL_ENTRIES: GBEntry[] = [
  { id: 1, name: "뺑부장",  msg: "넘 이쁜 선남선녀 늘 행복하고 꽃길만 걸어 !!", date: "07.05", color: "#fef9e7", attend: "yes" },
  { id: 2, name: "보라",    msg: "백년해로 하십시오~",                             date: "07.05", color: "#e8f5e9", attend: "yes" },
  { id: 3, name: "회사동료", msg: "결혼 너무 축하해~ 예쁜 두사람!",               date: "07.05", color: "#fce4ec", attend: "yes" },
];

const GROOM_ACCOUNTS = [
  { role: "신랑", name: "한영수", bank: "국민은행", num: "012345-67890-111" },
  { role: "혼주", name: "한기곤", bank: "국민은행", num: "012345-67890-222" },
  { role: "혼주", name: "윤미영", bank: "국민은행", num: "012345-67890-333" },
];

const BRIDE_ACCOUNTS = [
  { role: "신부", name: "구자민", bank: "국민은행", num: "012345-67890-444" },
  { role: "혼주", name: "구응회", bank: "국민은행", num: "012345-67890-555" },
  { role: "혼주", name: "김희진", bank: "국민은행", num: "012345-67890-666" },
];

/* July 2026 starts on Wednesday (index 3), 31 days → 3 leading empties + 1 trailing */
const CAL_DAYS: (number | null)[] = [
  null, null, null,
  ...Array.from({ length: 31 }, (_, i) => i + 1),
  null,
];

const GALLERY_PHOTOS = [
  "/p01.jpg", "/p02.jpg", "/p03.jpg",
  "/p04.jpg", "/p05.jpg", "/p06.jpg",
  "/p07.jpg", "/p08.jpg", "/p09.jpg",
  "/p10.jpg", "/p11.jpg", "/p12.jpg",
  "/p13.jpg", "/p14.jpg", "/p15.jpg",
];

const GALLERY_WIDE = ["/wide01.jpg", "/wide02.jpg", "/wide03.jpg", "/wide04.jpg", "/wide05.jpg", "/wide06.jpg"];

const ALL_PHOTOS = [...GALLERY_PHOTOS, ...GALLERY_WIDE];

/* ════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"groom" | "bride">("groom");
  const galleryRowRef = useRef<HTMLDivElement>(null);
  const [poem1Done, setPoem1Done] = useState(false);
  const [poem2Done, setPoem2Done] = useState(false);
  const [poemInView, setPoemInView] = useState(false);
  const poemRef = useRef<HTMLElement>(null);
  const [entries, setEntries] = useState<GBEntry[]>(INITIAL_ENTRIES);
  const [gbName, setGbName] = useState("");
  const [gbMsg, setGbMsg] = useState("");
  const [attend, setAttend] = useState<"yes" | "no" | null>(null);
  const [side, setSide] = useState<"groom" | "bride" | null>(null);
  const [meal, setMeal] = useState<"yes" | "no" | null>(null);
  const [headcount, setHeadcount] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxDir, setLightboxDir] = useState<"next" | "prev">("next");
  const touchStartX = useRef<number>(0);

  /* ── smooth scroll throttle (desktop only) ── */
  useEffect(() => {
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) return;

    const SPEED = 0.55; // 낮을수록 느림 (0~1)
    const LERP  = 0.10; // 낮을수록 부드러움

    let targetY = window.scrollY;
    let rafId   = 0;
    let running = false;

    const maxY = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const tick = () => {
      const diff = targetY - window.scrollY;
      if (Math.abs(diff) < 0.5) {
        window.scrollTo(0, targetY);
        running = false;
        return;
      }
      window.scrollTo(0, window.scrollY + diff * LERP);
      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetY = Math.max(0, Math.min(targetY + e.deltaY * SPEED, maxY()));
      if (!running) { running = true; rafId = requestAnimationFrame(tick); }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId);
    };
  }, []);

  /* ── cursor ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const onMove = (e: MouseEvent) =>
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2, ease: "power2.out", opacity: 1 });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── GSAP hero ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* progress bar */
      gsap.to("#progress-bar", {
        width: "100%",
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 0.3 },
      });

      /* illust crossfade initial state */
      gsap.set(".ic-char-layer", { opacity: 1 });
      gsap.set(".ic-real-layer", { opacity: 0 });
      gsap.set(".ic-real-img",   { scale: 1.08 });
      gsap.set(".ic-char-img",   { scale: 1.0 });
      gsap.set(".ic-names",      { opacity: 0, y: 24 });
      gsap.set(".ic-scroll-hint",{ opacity: 0 });

      /* scroll hint entrance */
      gsap.to(".ic-scroll-hint", { opacity: 1, y: 0, duration: 1.2, delay: 1.1, ease: "power2.out" });

      /* pin + scrub timeline */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".illust-crossfade-section",
          pin: true,
          scrub: 1.6,
          start: "top top",
          end: "+=1000",
        },
      });

      tl
        .to(".ic-char-layer", { opacity: 0, ease: "power2.inOut" }, 0)
        .to(".ic-char-img",   { scale: 0.93, ease: "power2.inOut" }, 0)
        .to(".ic-real-layer", { opacity: 1, ease: "power2.inOut" }, 0)
        .to(".ic-real-img",   { scale: 1.0, ease: "power2.inOut" }, 0)
        .to(".ic-names",      { opacity: 1, y: 0, ease: "power3.out" }, 0.5)
        .to(".ic-scroll-hint",{ opacity: 0, ease: "power2.in" }, 0.7);
    });

    return () => ctx.revert();
  }, []);

  /* ── poem section intersection ── */
  useEffect(() => {
    const el = poemRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setPoemInView(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── scroll fade-in ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".fade-in").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── lightbox keyboard navigation ── */
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { setLightboxDir("prev"); setLightboxIndex(i => i !== null ? (i - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length : null); }
      if (e.key === "ArrowRight") { setLightboxDir("next"); setLightboxIndex(i => i !== null ? (i + 1) % ALL_PHOTOS.length : null); }
      if (e.key === "Escape")     setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  /* ── gallery wide row scroll hint ── */
  useEffect(() => {
    const el = galleryRowRef.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.scrollTo({ left: 80, behavior: "smooth" });
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  /* ── profile shimmer (re-triggers every time in view) ── */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("shimmer-active");
            void (e.target as HTMLElement).offsetWidth; // force reflow
            e.target.classList.add("shimmer-active");
          } else {
            e.target.classList.remove("shimmer-active");
          }
        }),
      { threshold: 0.15 }
    );
    document.querySelectorAll(".profile-img").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── helpers ── */
  function copyText(txt: string) {
    navigator.clipboard.writeText(txt).then(() => alert("복사되었습니다."));
  }
  function copyLink() {
    navigator.clipboard.writeText(location.href).then(() => alert("링크가 복사되었습니다."));
  }
  function submitGuestbook() {
    if (!gbName.trim()) { alert("이름을 입력해주세요."); return; }
    if (!attend) { alert("참석 여부를 선택해주세요."); return; }
    if (attend === "yes" && !side) { alert("신랑측/신부측을 선택해주세요."); return; }
    if (attend === "yes" && !meal) { alert("식사 여부를 선택해주세요."); return; }
    const now = new Date();
    const date = `${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const msg = gbMsg.trim();
    if (msg) {
      setEntries((prev) => [
        { id: Date.now(), name: gbName.trim(), msg, date, color: GB_COLORS[prev.length % GB_COLORS.length], attend, side: side ?? undefined, meal: meal ?? undefined, headcount: attend === "yes" ? headcount : undefined },
        ...prev,
      ]);
    }
    const sideText = side === "groom" ? "신랑 측" : "신부 측";
    const detail = attend === "yes" ? `${sideText} · ${headcount}명 · 식사 ${meal === "yes" ? "예" : "아니오"}` : "불참";
    alert(`${gbName.trim()}님 — ${detail}\n전달되었습니다. 감사합니다!`);
    setGbName(""); setGbMsg(""); setAttend(null); setSide(null); setMeal(null); setHeadcount(1);
  }

  /* ════════════════════════════════════════════════════════════════════════ */
  return (
    <>
      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            if (Math.abs(dx) > 50) {
              if (dx < 0) { setLightboxDir("next"); setLightboxIndex(i => i !== null ? (i + 1) % ALL_PHOTOS.length : null); }
              else        { setLightboxDir("prev"); setLightboxIndex(i => i !== null ? (i - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length : null); }
            }
          }}
        >
          <button
            className="lightbox-close"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="닫기"
          >✕</button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); setLightboxDir("prev"); setLightboxIndex(i => i !== null ? (i - 1 + ALL_PHOTOS.length) % ALL_PHOTOS.length : null); }}
            aria-label="이전"
          >&#8249;</button>
          <div key={lightboxIndex} className={`lightbox-img-wrap lb-${lightboxDir}`} onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ALL_PHOTOS[lightboxIndex]}
              alt=""
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); setLightboxDir("next"); setLightboxIndex(i => i !== null ? (i + 1) % ALL_PHOTOS.length : null); }}
            aria-label="다음"
          >&#8250;</button>
          <div className="lightbox-counter">{lightboxIndex + 1} / {ALL_PHOTOS.length}</div>
        </div>
      )}
      <div className="cursor-dot" ref={cursorRef} />
      <div id="progress-bar" />

      <div className="page-container">
      {/* ══ HERO — illust → photo crossfade ══════════════════════════════════ */}
      <section className="illust-crossfade-section">
        {/* 실사 사진 (베이스) */}
        <div className="ic-real-layer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/w08.jpg" className="ic-real-img" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
        </div>

        {/* 캐릭터 일러스트 레이아웃 */}
        <div className="ic-char-layer" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="ic-char-top" />
          <div className="ic-char-mid">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/og.png" className="ic-char-img" alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
          </div>
          <div className="ic-char-bottom" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p className="ic-char-names">Han Yeongsoo <span className="ic-char-dot">·</span> Koo Jamin</p>
            <p className="ic-char-date">2026 · 07 · 05 · Sun · 13:00</p>
          </div>
        </div>

        {/* 이름 오버레이 (사진 전환 후) */}
        <div className="ic-names">
          <p className="ic-names-text">Han Yeongsoo <span className="ic-names-amp">·</span> Koo Jamin</p>
          <span className="ic-names-date">2026 · 07 · 05 · Sun · 13:00</span>
        </div>

        {/* 스크롤 힌트 */}
        <div className="ic-scroll-hint">
          <div className="ic-scroll-bar" />
          <span className="ic-scroll-label">Scroll</span>
        </div>
      </section>

      {/* ══ INVITATION ══════════════════════════════════════════════════════ */}
      <section className="w-section inv-section fade-in">
        <h2 className="sec-title">Invitation</h2>

        <p className="invite-text">
          무더운 여름,<br /><br />
          운명처럼 만나<br />
          사랑에 빠지는 데 많은 시간이 들지 않았습니다.<br />
          <br />
          세상을 알록달록하게 만들어주는,<br />
          매일매일 크게 웃게 해주는<br />
          서로에게 감사하며<br />
          그 여름에 약속을 나누려 합니다.<br />
          <br />
          함께해주시면 기쁘게 간직하겠습니다.
        </p>

        <div className="inv-divider" />

        <div className="names-block">
          <div className="name-row">한기곤 · 윤미영의 장남 <span className="name-hl">한영수</span></div>
          <div className="name-row">구응회 · 김희진의 장녀 <span className="name-hl">구자민</span></div>
        </div>

        <div className="inv-divider" />

        <div className="info-block">
          <div>2026년 07월 05일 (일) 오후 1시</div>
          <div className="info-venue">건국대학교 동문회관</div>
        </div>
      </section>

      {/* ══ CALENDAR ════════════════════════════════════════════════════════ */}
      <section className="w-section fade-in">
        <h2 className="sec-title">Calendar</h2>

        <div className="calendar">
          <div className="cal-month"><em>July</em></div>
          <div className="cal-grid">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className={`cal-day-label${d === "일" ? " cal-sun" : ""}`}>{d}</div>
            ))}
            {CAL_DAYS.map((day, i) => (
              <div key={i} className="cal-day">
                {day === 5 ? <span className="cal-hl-num">5</span> : day ?? ""}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROFILE ═════════════════════════════════════════════════════════ */}
      <section className="w-section profile-section fade-in" ref={poemRef}>
        <h2 className="sec-title">Groom &amp; Bride</h2>

        {/* 신랑 한영수 — 사진 좌, 텍스트 우 */}
        <div className="pp-card">
          <div className="pp-photo">
            <div className="profile-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo1.jpg" alt="신랑 한영수" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            </div>
          </div>
          <div className="pp-info">
            <strong className="pp-name">한영수</strong>
            <span className="pp-name-en">Han Yeongsoo</span>
          </div>
        </div>

        <div className="poem-block poem-block--right pp-poem">
          <div className="poem-greeting">영수가 자민에게</div>
          <p className="poem-anecdote">자민이와 첫 데이트 하던 날 이 시를 써서 선물했어요.</p>
          <TypewriterPoem
            canStart={poemInView}
            delay={300}
            onComplete={() => setPoem1Done(true)}
            text={`나의 여름이 모든 색을 잃고\n흑백이 되어도 좋습니다.\n내가 세상의 꽃들과 들풀,\n숲의 색을 모두 훔쳐올 테니\n전부 그대의 것 하십시오.\n\n그러니 그대는 나의 여름이 되세요.`}
          />
          <div className={`poem-cite${poem1Done ? " poem-cite--visible" : ""}`}>도둑이 든 여름 — 서덕준</div>
        </div>

        <div className="profile-poem-sep" />

        {/* 신부 구자민 — 텍스트 좌(우정렬), 사진 우 */}
        <div className="pp-card pp-card--reverse">
          <div className="pp-photo">
            <div className="profile-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photo2.jpg" alt="신부 구자민" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            </div>
          </div>
          <div className="pp-info pp-info--right">
            <strong className="pp-name">구자민</strong>
            <span className="pp-name-en">Koo Jamin</span>
          </div>
        </div>

        <div className="poem-block poem-block--left pp-poem">
          <div className="poem-greeting">자민이가 영수에게</div>
          <p className="poem-anecdote">오빠는 저의 초당옥수수예요 🌽</p>
          <TypewriterPoem
            canStart={poem1Done}
            delay={400}
            onComplete={() => setPoem2Done(true)}
            text={`좋아하는게 하나 생기면 세계는 그 하나보다 더 넓어진다. 그저 덜 휘청거리며 살면 다행이라고 위로하면서 지내다 불현듯 어떤 것에 마음이 가면 그때부터 일상에 밀도가 생긴다. 납작했던 하루가 포동포동 말랑말랑 입체감을 띈다. 초당옥수수 덕분에 여름을 향한 내 마음의 농도는 더 짙어졌다.`}
          />
          <div className={`poem-cite${poem2Done ? " poem-cite--visible" : ""}`}>아무튼 여름 — 김신회</div>
        </div>
      </section>

      {/* ══ GALLERY ═════════════════════════════════════════════════════════ */}
      <section className="w-section fade-in">
        <h2 className="sec-title">Gallery</h2>
        <p className="gallery-desc">사진을 눌러 크게 볼 수 있어요</p>

        <div className="gallery-grid">
          {GALLERY_PHOTOS.map((src, i) => (
            <div key={i} className="gallery-item" onClick={() => setLightboxIndex(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            </div>
          ))}
        </div>

        <div
          className="gallery-wide-row"
          ref={galleryRowRef}
          onMouseDown={(e) => {
            const el = galleryRowRef.current;
            if (!el) return;
            e.preventDefault();
            const startX = e.pageX - el.offsetLeft;
            const scrollLeft = el.scrollLeft;
            const onMove = (ev: MouseEvent) => {
              el.scrollLeft = scrollLeft - (ev.pageX - el.offsetLeft - startX);
            };
            const onUp = () => {
              window.removeEventListener("mousemove", onMove);
              window.removeEventListener("mouseup", onUp);
            };
            window.addEventListener("mousemove", onMove);
            window.addEventListener("mouseup", onUp);
          }}
        >
          {GALLERY_WIDE.map((src, i) => (
            <div key={i} className="gallery-wide-item" onClick={() => setLightboxIndex(GALLERY_PHOTOS.length + i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" draggable={false} onContextMenu={(e) => e.preventDefault()} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ LOCATION ════════════════════════════════════════════════════════ */}
      <section className="w-section fade-in">
        <h2 className="sec-title">Location</h2>

        <KakaoMap />

        <div className="loc-info">
          <p className="loc-venue">건국대학교 동문회관</p>
          <p className="loc-addr">서울특별시 광진구 능동로 120</p>
        </div>

        <div className="map-btns">
          <a
            href="https://map.naver.com/v5/search/건국대학교%20동문회관"
            target="_blank" rel="noopener noreferrer"
            className="map-btn"
          >
            네이버지도
          </a>
          <a
            href="https://map.kakao.com/link/search/건국대학교%20동문회관"
            target="_blank" rel="noopener noreferrer"
            className="map-btn"
          >
            카카오맵
          </a>
          <a href="tmap://search?name=건국대학교 동문회관" className="map-btn">
            T Map
          </a>
        </div>
      </section>

      {/* ══ ACCOUNT ═════════════════════════════════════════════════════════ */}
      <section className="w-section fade-in">
        <h2 className="sec-title">마음 전하실 곳</h2>

        <div className="acc-tabs">
          <button
            className={`acc-tab${activeTab === "groom" ? " active" : ""}`}
            onClick={() => setActiveTab("groom")}
          >
            신랑 측
          </button>
          <button
            className={`acc-tab${activeTab === "bride" ? " active" : ""}`}
            onClick={() => setActiveTab("bride")}
          >
            신부 측
          </button>
        </div>

        <div className="acc-panel">
          {(activeTab === "groom" ? GROOM_ACCOUNTS : BRIDE_ACCOUNTS).map(({ role, name, bank, num }) => (
            <div key={name} className="acc-card">
              <div className="acc-name">{role} <strong>{name}</strong></div>
              <div className="acc-num">
                <span>{bank} {num}</span>
                <button className="copy-btn" onClick={() => copyText(num)}>복사</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ RSVP + GUESTBOOK ════════════════════════════════════════════════ */}
      <section className="w-section fade-in">
        <h2 className="sec-title">참석 여부 &amp; 방명록</h2>

        {/* 참석 여부 폼 */}
        <div className="rsvp-form">
          <input
            type="text"
            className="rsvp-name-input"
            placeholder="이름"
            maxLength={20}
            value={gbName}
            onChange={(e) => setGbName(e.target.value)}
          />

          <div className="rsvp-attend-btns">
            <button
              className={`rsvp-attend-btn${attend === "yes" ? " active-yes" : ""}`}
              onClick={() => setAttend("yes")}
            >
              참석할게요 🤍
            </button>
            <button
              className={`rsvp-attend-btn${attend === "no" ? " active-no" : ""}`}
              onClick={() => { setAttend("no"); setSide(null); setMeal(null); setHeadcount(1); }}
            >
              함께하지 못해요 🥲
            </button>
          </div>

          {attend === "yes" && (
            <>
              <p className="rsvp-sub-label">신랑 측 / 신부 측</p>
              <div className="rsvp-attend-btns">
                <button
                  className={`rsvp-attend-btn${side === "groom" ? " active-yes" : ""}`}
                  onClick={() => setSide("groom")}
                >
                  신랑 측
                </button>
                <button
                  className={`rsvp-attend-btn${side === "bride" ? " active-yes" : ""}`}
                  onClick={() => setSide("bride")}
                >
                  신부 측
                </button>
              </div>

              <p className="rsvp-sub-label">참석 인원</p>
              <div className="rsvp-headcount">
                <button
                  className="rsvp-count-btn"
                  onClick={() => setHeadcount((v) => Math.max(1, v - 1))}
                >
                  −
                </button>
                <span className="rsvp-count-num">{headcount}</span>
                <button
                  className="rsvp-count-btn"
                  onClick={() => setHeadcount((v) => Math.min(10, v + 1))}
                >
                  +
                </button>
              </div>

              <p className="rsvp-sub-label">식사 여부</p>
              <div className="rsvp-attend-btns">
                <button
                  className={`rsvp-attend-btn${meal === "yes" ? " active-yes" : ""}`}
                  onClick={() => setMeal("yes")}
                >
                  할게요 🍽️
                </button>
                <button
                  className={`rsvp-attend-btn${meal === "no" ? " active-no" : ""}`}
                  onClick={() => setMeal("no")}
                >
                  안 할게요
                </button>
              </div>
            </>
          )}

          <textarea
            className="rsvp-textarea"
            placeholder="축하 메시지를 남겨주세요 (선택)"
            value={gbMsg}
            onChange={(e) => setGbMsg(e.target.value)}
          />

          <p className="rsvp-hint">남겨주신 메시지는 아래 방명록에 공개됩니다 🤍</p>

          <button className="rsvp-submit" onClick={submitGuestbook}>
            전달하기
          </button>
        </div>

        {/* 방명록 */}
        <div className="gb-messages-sep" />
        <div className="gb-messages-label">Messages</div>
        <div className="gb-grid">
          {entries.map((e) => (
            <div key={e.id} className="gb-card">
              <div className="gb-card-msg">{e.msg}</div>
              <div className="gb-card-footer">
                <span className="gb-card-author">{e.name}</span>
                <span className="gb-card-date">{e.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NOTICE ══════════════════════════════════════════════════════════ */}
      <section className="w-section fade-in">
        <h2 className="sec-title">Notice</h2>

        <div className="notice-box">
          <p>· 주차는 건국대학교 내 주차장을 이용해 주세요.</p>
          <p>· 혼잡이 예상되니 대중교통 이용을 권장합니다.</p>
          <p>· 식장 내 사진 촬영은 자유롭게 가능합니다.</p>
          <p>· 생화 반입은 삼가주시기 바랍니다.</p>
        </div>

        <div className="share-btns">
          <button className="share-btn" onClick={copyLink}>🔗 링크 복사</button>
          <button className="share-btn">💬 카카오톡 공유</button>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="wedding-footer">
        Han Yeongsoo <span className="footer-amp">&amp;</span> Koo Jamin
        <br />
        2026 · 07 · 05
      </footer>
      </div>

    </>
  );
}
