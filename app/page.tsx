"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Home() {
  const cursorRef = useRef<HTMLDivElement>(null);

  /* ── cursor ── */
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const fn = (e: MouseEvent) =>
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.2, ease: "power2.out", opacity: 1 });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  /* ── GSAP ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── progress bar ── */
      gsap.to("#progress-bar", {
        width: "100%",
        scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 0.3 },
      });

      /* ── nav ── */
      gsap.to([".nav-logo", ".nav-date"], {
        opacity: 1, duration: 1, stagger: 0.1, delay: 0.8, ease: "power2.out",
      });

      /* ════════════════════════
         ILLUST CROSSFADE — 스크롤로 캐릭터→실사 전환
         pin + scrub timeline
      ════════════════════════ */

      // 초기 상태
      gsap.set(".ic-char-layer", { opacity: 1 });
      gsap.set(".ic-real-layer", { opacity: 0 });
      gsap.set(".ic-real-img",   { scale: 1.08 });
      gsap.set(".ic-char-img",   { scale: 1.0 });
      gsap.set(".ic-names",      { opacity: 0, y: 24 });
      gsap.set(".ic-scroll-hint",{ opacity: 0 });

      // 스크롤 힌트 초기 등장
      gsap.to(".ic-scroll-hint", { opacity: 1, y: 0, duration: 1.2, delay: 1.0, ease: "power2.out" });

      // 핀 + 스크럽 타임라인
      const ilTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".illust-crossfade-section",
          pin: true,
          scrub: 1.6,
          start: "top top",
          end: "+=1000",
        },
      });

      ilTl
        // 0 ~ 0.45: 캐릭터 페이드아웃 + 살짝 축소
        .to(".ic-char-layer", { opacity: 0, ease: "power2.inOut" }, 0)
        .to(".ic-char-img",   { scale: 0.93, ease: "power2.inOut" }, 0)
        // 0 ~ 0.55: 실사 페이드인 + 자연 스케일
        .to(".ic-real-layer", { opacity: 1, ease: "power2.inOut" }, 0)
        .to(".ic-real-img",   { scale: 1.0,  ease: "power2.inOut" }, 0)
        // 0.5 ~: 이름 텍스트 등장
        .to(".ic-names", { opacity: 1, y: 0, ease: "power3.out" }, 0.5)
        // 0.7 ~: 스크롤 힌트 사라짐
        .to(".ic-scroll-hint", { opacity: 0, ease: "power2.in" }, 0.7);

      /* ════════════════════════
         INVITATION
      ════════════════════════ */

      gsap.to(".invite-tag", {
        opacity: 1, y: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".invite-tag", start: "top 82%" },
      });

      gsap.set(".invite-big-line", { clipPath: "inset(0 0 110% 0)" });
      gsap.to(".invite-big-line", {
        clipPath: "inset(0 0 0% 0)", duration: 1.5, stagger: 0.18, ease: "power4.out",
        scrollTrigger: { trigger: ".invite-big", start: "top 78%" },
      });

      gsap.to(".invite-divider", {
        scaleX: 1, duration: 1.2, ease: "power2.inOut",
        scrollTrigger: { trigger: ".invite-divider", start: "top 85%" },
      });

      gsap.to(".invite-body p", {
        opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".invite-body", start: "top 88%" },
      });

      /* ════════════════════════
         DATE STATEMENT
      ════════════════════════ */

      gsap.to(".date-tag", {
        opacity: 1, y: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".date-section", start: "top 78%" },
      });

      gsap.fromTo(".date-year",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out",
          scrollTrigger: { trigger: ".date-section", start: "top 72%" } }
      );
      gsap.fromTo(".date-month-day",
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1.4, delay: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: ".date-section", start: "top 72%" } }
      );
      gsap.to(".date-sub", {
        opacity: 1, y: 0, duration: 1.0, delay: 0.4, ease: "power3.out",
        scrollTrigger: { trigger: ".date-section", start: "top 70%" },
      });

      /* ════════════════════════
         FULLBLEED
      ════════════════════════ */

      gsap.from(".fullbleed-img", {
        scale: 1.08, duration: 1.8, ease: "power3.out",
        scrollTrigger: { trigger: ".fullbleed", start: "top 75%" },
      });
      gsap.to(".fullbleed-img", {
        yPercent: 14, ease: "none",
        scrollTrigger: { trigger: ".fullbleed", start: "top bottom", end: "bottom top", scrub: true },
      });

      gsap.set(".fullbleed-quote-line", { y: "110%", filter: "blur(6px)" });
      gsap.to(".fullbleed-quote-line", {
        y: "0%", filter: "blur(0px)", stagger: 0.14, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: ".fullbleed-text", start: "top 65%" },
      });
      gsap.to(".fullbleed-attr", {
        opacity: 1, duration: 1.0, delay: 0.4,
        scrollTrigger: { trigger: ".fullbleed-text", start: "top 60%" },
      });

      /* ════════════════════════
         CLOSING
      ════════════════════════ */

      gsap.to(".closing-tag", {
        opacity: 1, y: 0, duration: 1.0, ease: "power3.out",
        scrollTrigger: { trigger: ".closing", start: "top 72%" },
      });
      gsap.to(".closing-radial", {
        opacity: 1, duration: 2.4, ease: "power3.out",
        scrollTrigger: { trigger: ".closing", start: "top 70%" },
      });

      const splitClose = new SplitText(".closing-name", { type: "chars" });
      gsap.set(splitClose.chars, { y: "115%", opacity: 0, filter: "blur(8px)" });
      gsap.to(splitClose.chars, {
        y: "0%", opacity: 1, filter: "blur(0px)",
        duration: 1.6, stagger: 0.045, ease: "power3.out",
        scrollTrigger: { trigger: ".closing-names", start: "top 75%" },
      });

      gsap.to(".closing-amp", {
        opacity: 0.5, duration: 1.2, delay: 0.3, ease: "power3.out",
        scrollTrigger: { trigger: ".closing-names", start: "top 72%" },
      });
      gsap.to(".closing-line", {
        scaleX: 1, duration: 1.0, ease: "power2.inOut",
        scrollTrigger: { trigger: ".closing-line", start: "top 85%" },
      });
      gsap.to([".closing-date", ".closing-copy"], {
        opacity: 1, y: 0, stagger: 0.14, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".closing-copy", start: "top 88%" },
      });

    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorRef} />
      <div id="progress-bar" />

      <nav>
        <span className="nav-logo">한영수 &amp; 구자민</span>
        <span className="nav-date">2026 · 07 · 05</span>
      </nav>

      {/* ══ 0. ILLUST CROSSFADE ═══════════════
          캐릭터 일러스트 → 실제 사진 스크롤 전환
      ════════════════════════════════════════ */}
      <section className="illust-crossfade-section">

        {/* 레이어 1: 실사 사진 (베이스) */}
        <div className="ic-real-layer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/char-real.jpeg" className="ic-real-img" alt="" />
        </div>

        {/* 레이어 2: 캐릭터 일러스트 (위, 스크롤에 따라 fade out) */}
        <div className="ic-char-layer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/char.png" className="ic-char-img" alt="" />
        </div>

        {/* 실사 노출 후 나타나는 이름 오버레이 */}
        <div className="ic-names">
          <p className="ic-names-text">한영수 &amp; 구자민</p>
          <span className="ic-names-date">2026 · 07 · 05</span>
        </div>

        {/* 스크롤 유도 힌트 */}
        <div className="ic-scroll-hint">
          <div className="ic-scroll-bar" />
          <span className="ic-scroll-label">Scroll</span>
        </div>
      </section>

      {/* ══ 2. INVITATION ════════════════════ */}
      <section className="invite-section">
        <span className="invite-tag">— Invitation</span>
        <h2 className="invite-big">
          <span className="invite-big-line">우리의 가장</span>
          <span className="invite-big-line">빛나는 순간에</span>
          <span className="invite-big-line">함께해 주세요</span>
        </h2>
        <div className="invite-divider" />
        <div className="invite-body">
          <p>두 사람이 같은 마음으로<br />같은 날을 기다리게 되었습니다.</p>
          <p>소중한 분들을 모시고<br />조용하고 아름다운 시작의 자리를<br />함께하려 합니다.</p>
        </div>
      </section>

      {/* ══ 3. DATE STATEMENT ════════════════ */}
      <section className="date-section">
        <div className="date-bg-num">07·05</div>
        <div className="date-content">
          <span className="date-tag">— The Day</span>
          <div className="date-nums">
            <div className="date-year">2026</div>
            <div className="date-sep" />
            <div className="date-month-day">07 · 05</div>
          </div>
          <p className="date-sub">일요일 · 오전 11시</p>
        </div>
      </section>

      {/* ══ 4. FULLBLEED ═════════════════════ */}
      <section className="fullbleed">
        <Image
          className="fullbleed-img"
          src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1800&q=90"
          alt="" fill sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="fullbleed-dim" />
        <div className="fullbleed-text">
          <p className="fullbleed-quote">
            <span className="fullbleed-quote-line">함께한 모든 순간이</span>
            <span className="fullbleed-quote-line">우리의 이야기가 됩니다</span>
          </p>
          <p className="fullbleed-attr">한영수 &amp; 구자민 · 2026</p>
        </div>
      </section>

      {/* ══ 5. CLOSING ═══════════════════════ */}
      <section className="closing">
        <div className="closing-radial" />
        <p className="closing-tag">감사합니다</p>
        <div className="closing-names">
          <span className="closing-name">한영수</span>
          <span className="closing-amp">&amp;</span>
          <span className="closing-name">구자민</span>
        </div>
        <div className="closing-line" />
        <p className="closing-date">2026년 7월 5일 일요일 · 오전 11시</p>
        <p className="closing-copy">
          귀한 걸음으로 함께해 주시는<br />
          마음에 깊이 감사드립니다.
        </p>
      </section>
    </>
  );
}
