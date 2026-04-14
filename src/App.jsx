import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import Lenis from 'lenis';

function useSmoothScroll() {
  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className={`bo-faq-item${isOpen ? ' bo-faq-item--open' : ''}`} onClick={onToggle}>
      <div className="bo-faq-item__top">
        <h3 className="bo-faq-item__q">{item.q}</h3>
        <span className="bo-faq-item__icon">{isOpen ? '–' : '+'}</span>
      </div>
      <div className="bo-faq-item__body">
        <p className="bo-faq-item__a">{item.a}</p>
      </div>
    </div>
  );
}

// ============================================================
// ALL STYLES
// ============================================================
const STYLES = `
@font-face { font-family: 'Feature Display'; src: url('/fonts/FeatureDisplay-Regular.ttf') format('truetype'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Aspekta'; src: url('/fonts/Aspekta-Font/Aspekta-400.ttf') format('truetype'); font-weight: 400; font-display: swap; }
@font-face { font-family: 'Aspekta'; src: url('/fonts/Aspekta-Font/Aspekta-500.ttf') format('truetype'); font-weight: 500; font-display: swap; }
@font-face { font-family: 'Aspekta'; src: url('/fonts/Aspekta-Font/Aspekta-600.ttf') format('truetype'); font-weight: 600; font-display: swap; }
@font-face { font-family: 'Aspekta'; src: url('/fonts/Aspekta-Font/Aspekta-700.ttf') format('truetype'); font-weight: 700; font-display: swap; }

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --color-bg: #f6fbf3;
  --color-bg-light: #ecf3ed;
  --color-dark: #06201d;
  --color-darker: #010c0b;
  --color-green-primary: #246044;
  --color-green-dark: #214f3f;
  --color-green-accent: #009444;
  --color-green-bright: #14a248;
  --color-text-body: rgba(23, 63, 45, 0.8);
  --color-text-muted: #5c7268;
  --color-text-label: #4a6b5e;
  --color-border: #c8ddd0;
  --color-border-light: #ddeae0;
  --font-display: 'Feature Display', Georgia, serif;
  --font-body: 'Aspekta', system-ui, sans-serif;
  --font-label: 'Aspekta', system-ui, sans-serif;
  --max-width: 1500px;
  --container-px: clamp(1.5rem, 4vw, 5rem);
  --nav-height: 72px;
}

html { scroll-behavior: smooth; overflow-x: hidden; max-width: 100%; }
body { font-family: var(--font-body); font-weight: 400; background-color: var(--color-bg); color: var(--color-green-primary); line-height: 1.6; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #e4f6e8; }
::-webkit-scrollbar-thumb { background: #3E9A63; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #0A7D39; }
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; background: none; font-family: inherit; }

.container { width: 100%; max-width: var(--max-width); margin-inline: auto; padding-inline: var(--container-px); }
.section-label { font-family: var(--font-label); font-size: 13px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #325E4A; }
.btn { display: inline-flex; align-items: center; gap: 16px; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; font-weight: 500; letter-spacing: 0.02em; padding: 14px 28px; border-radius: 5px; transition: all 0.2s ease; white-space: nowrap; cursor: pointer; }
.btn-outline { border: 1px solid rgba(3,136,57,0.6); color: #0A7D39; background: transparent; }
.btn-outline:hover { background: #3E9A63; color: #fff; border-color: #3E9A63; }
.btn-outline:hover img { filter: brightness(0) invert(1); }
.btn-green { background: var(--color-green-accent); color: #fff; border: 1px solid var(--color-green-accent); }
.btn-green:hover { background: var(--color-green-bright); border-color: var(--color-green-bright); }

/* ── NAV ── */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: var(--nav-height); transition: background 0.25s ease, backdrop-filter 0.25s ease, box-shadow 0.25s ease; background: transparent; border-bottom: 1px solid rgba(45,83,66,0.12); }
.nav--scrolled { background: rgba(233,249,236,0.9); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.nav__inner { display: flex; align-items: center; justify-content: space-between; height: 100%; }
.nav__logo { display: flex; align-items: center; text-decoration: none; }
.nav__logo-img { height: 26px; width: auto; display: block; }
.nav__links { display: flex; align-items: center; gap: 32px; list-style: none; margin: 0; padding: 0; height: 100%; }
.nav__links li { display: flex; align-items: center; height: 100%; }
.nav__link { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--color-green-primary); text-decoration: none; letter-spacing: 0.01em; transition: opacity 0.15s; white-space: nowrap; }
.nav__links li { position: relative; }
.nav__links li::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #57B94B; transform: scaleX(0); transition: transform 0.2s ease; }
.nav__links li:hover::after { transform: scaleX(1); }
.nav__link { position: relative; }
.nav__link:hover, .nav__link--active { opacity: 1; color: #009444; }
.nav__cta { font-family: var(--font-body); font-size: 14px; font-weight: 600; color: var(--color-green-primary); border: none; padding: 0; border-radius: 0; text-decoration: none; transition: color 0.2s; white-space: nowrap; letter-spacing: 0.01em; }
.nav__cta:hover { color: #009444; }
.nav__hamburger { display: none; flex-direction: column; align-items: flex-end; gap: 5px; padding: 4px; background: none; border: none; cursor: pointer; }
.nav__hamburger span { display: block; width: 24px; height: 2px; background: #0D5830; border-radius: 2px; transition: transform 0.25s, opacity 0.25s, width 0.25s; transform-origin: center; }
.nav__hamburger span:nth-child(1) { width: 16px; align-self: flex-end; }
.nav__hamburger span:nth-child(2) { width: 20px; align-self: flex-end; }
.nav__hamburger span:nth-child(3) { width: 24px; align-self: flex-end; }
.nav__hamburger--open span:nth-child(1) { transform: translateY(7px) rotate(45deg); width: 24px; }
.nav__hamburger--open span:nth-child(2) { opacity: 0; }
.nav__hamburger--open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); width: 24px; }
.nav__mobile { display: none; position: fixed; top: var(--nav-height); left: 0; right: 0; background: var(--color-bg); border-top: 1px solid var(--color-border-light); padding: 1.5rem var(--container-px) 2rem; transform: translateY(-8px); opacity: 0; pointer-events: none; transition: transform 0.25s ease, opacity 0.25s ease; }
.nav__mobile--open { transform: translateY(0); opacity: 1; pointer-events: auto; }
.nav__mobile-links { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.nav__mobile-link { display: block; font-size: 16px; font-weight: 500; color: var(--color-green-primary); padding: 12px 0; border-bottom: 1px solid var(--color-border-light); text-decoration: none; }
.nav__mobile-link--cta { margin-top: 12px; border: 1px solid var(--color-green-primary); border-radius: 2px; padding: 12px 20px; text-align: center; }
@media (max-width: 1024px) {
  :root { --container-px: 24px; }
  .nav__links { display: none; }
  .nav__hamburger { display: flex; }
  .nav__mobile { display: block; box-shadow: 0 8px 24px rgba(6,32,29,0.08); }
  .nav__logo { transform: scale(0.82); transform-origin: left center; }
}

/* ── FOOTER ── */
.footer { background: linear-gradient(180deg, #010c0b 0%, #06201d 100%); color: rgba(255,255,255,0.75); padding: 0 0 2.5rem; }
.footer__inner { display: flex; flex-direction: column; }
.footer__top { display: flex; align-items: center; justify-content: space-between; gap: 2rem; padding: 2rem 0; }
.footer__logo { display: block; flex-shrink: 0; }
.footer__logo-img { height: 29px; width: auto; display: block; }
.footer__nav ul { list-style: none; display: flex; flex-wrap: wrap; gap: 0.75rem 2.5rem; justify-content: flex-end; }
.footer__nav-link { font-family: var(--font-body); font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.7); text-decoration: none; letter-spacing: 0.01em; transition: color 0.15s; }
.footer__nav-link:hover { color: #44AA78; }
.footer__divider { height: 1px; background: rgba(255,255,255,0.1); margin-bottom: 2rem; }
.footer__legal { font-family: var(--font-label); font-size: 11px; line-height: 1.7; color: rgba(255,255,255,0.4); width: 100%; margin-bottom: 0.5rem; }
.footer__legal:last-child { margin-bottom: 0; }
.footer__legal--services { color: rgba(255,255,255,0.55); font-weight: 500; margin-bottom: 0.75rem; }
.footer__legal--links { margin-bottom: 0.75rem; }
.footer__legal--copy { margin-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem; }
.footer__legal-link { color: rgba(255,255,255,0.5); text-decoration: underline; text-underline-offset: 2px; transition: color 0.15s; }
.footer__legal-link:hover { color: #44AA78; }
@media (max-width: 1024px) {
  .footer__top { flex-direction: column; align-items: flex-start; gap: 0; padding: 2rem 0; }
  .footer__logo { padding-top: 0.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.15); width: 100%; }
  .footer__nav { padding-top: 1.5rem; width: 100%; }
  .footer__nav ul { justify-content: flex-start; gap: 0.5rem 1.75rem; flex-wrap: wrap; }
  .footer__nav li { display: flex; align-items: center; }
  .footer__nav li + li::before { display: none; }
}
@media (max-width: 700px) {
  .footer__top { flex-direction: column; gap: 1.5rem; }
}

/* ── HOME HERO ── */
.home-hero { background: #e4f6e8 url('/images/logo-glass-composition.png') 85% 78% no-repeat; background-size: 44% auto; height: 100vh; display: flex; flex-direction: column; position: sticky; top: 0; z-index: 0; overflow: hidden; }
.home-hero__inner { flex: 1; display: grid; grid-template-columns: 1fr 1fr; align-items: center; padding-top: calc(var(--nav-height) + 16px); padding-bottom: 0; position: relative; }
.home-hero__copy { max-width: 650px; min-height: 420px; display: flex; flex-direction: column; justify-content: center; margin-top: -20px; }
.home-hero__heading { font-family: var(--font-display); font-size: 66px; line-height: 1.08; letter-spacing: 0; font-weight: 400; color: #246044; margin-bottom: 0; }
.home-hero__heading-line1 { white-space: nowrap; }
.home-hero__accent { display: block; font-style: normal; color: #009444; margin-top: 2px; white-space: nowrap; }
.home-hero__body { font-size: 18px; line-height: 1.75; color: var(--color-text-body); max-width: 620px; margin-top: 28px; }
.home-hero__body:last-of-type { margin-bottom: 0; }
.home-hero__ctas { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 44px; }
.home-hero__image-wrap { display: none; }
.home-hero__image { display: none; }
.home-stats-bar { display: none; }
.home-stats-bar__inner { border-top: 1px solid rgba(62,154,99,0.15); padding-top: 2rem; }
.home-stats-bar__inner { display: grid; grid-template-columns: repeat(3,1fr); gap: 0; }
.home-stat { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 5px; padding: 1.5rem; }
.home-stat:first-child { padding-left: 0; }
.home-stat:last-child { padding-right: 0; }
.home-stat:not(:last-child) { border-right: 1px solid rgba(62,154,99,0.2); }
.home-stat__value { font-family: 'Noto Serif', serif; font-size: clamp(1.8rem,3vw,2.6rem); font-weight: 400; color: var(--color-green-dark); line-height: 1; letter-spacing: -0.02em; }
.home-stat__label { font-family: 'DM Sans', system-ui, sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: #577C6A; text-transform: uppercase; margin-top: 6px; white-space: pre-line; line-height: 1.6; }

/* HOME SERVICES */
.home-services { padding: 5rem 0; background: #fff; position: relative; z-index: 1; }
.home-services .section-label { display: block; margin-bottom: 2rem; }
.home-services__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.home-service-card { background: #fff; border: 1px solid var(--color-border-light); box-shadow: 0 4px 24px rgba(45,83,66,0.06); padding: 3rem; display: flex; flex-direction: column; border-radius: 2px; min-height: 360px; }
.home-service-card__title { font-family: var(--font-display); font-size: clamp(2rem,3.8vw,3rem); font-weight: 500; line-height: 1.15; color: var(--color-green-dark); letter-spacing: -0.02em; margin-bottom: 0.6rem; }
.home-service-card__sublabel { font-family: var(--font-label); font-size: 14px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #009444; line-height: 1.6; display: block; }
.home-service-card__divider { width: 2.5rem; height: 3px; background: #57B94B; margin: 1rem 0; }
.home-service-card__body { font-size: 18px; line-height: 1.75; color: var(--color-text-muted); }
.home-service-card__link { display: inline-flex; align-items: center; gap: 10px; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.08em; color: #39B22B; text-transform: uppercase; text-decoration: none; margin-top: 1.75rem; transition: color 0.2s ease; white-space: nowrap; }
.home-service-card__link:hover { color: #009444; }

/* HOME WHO WE ARE */
.home-who { background: var(--color-bg-light); padding: 5rem 0; position: relative; z-index: 1; }
.home-who__top { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 3rem; }
.home-who__top-label { font-family: var(--font-display); font-size: 31px; font-weight: 400; color: #417C61; letter-spacing: 0; text-transform: none; }
.home-who__top-divider { width: 100%; height: 1px; background: rgba(62,154,99,0.25); }
.home-who__inner { display: grid; grid-template-columns: 0.75fr 1fr; gap: 5rem; align-items: center; }
.home-who__photo-frame { position: relative; }
.home-who__photo-frame::after { content: ''; position: absolute; top: -20px; left: 20px; right: -20px; bottom: 20px; border: 1px solid rgba(62,154,99,0.25); border-radius: 0; z-index: 0; }
.home-who__photo-wrap { position: relative; border-radius: 0; overflow: hidden; aspect-ratio: 16/15; z-index: 1; }
.home-who__photo { width: 100%; height: 100%; object-fit: cover; }
.home-who__video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.home-who__photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top,rgba(6,32,29,0.7) 0%,transparent 50%); display: flex; align-items: flex-end; padding: 1.75rem 1.75rem 2.5rem; }
.home-who__photo-overlay span { font-family: var(--font-display); font-size: clamp(1.4rem,2.4vw,1.9rem); font-weight: 400; font-style: normal; color: #fff; line-height: 1.25; letter-spacing: -0.02em; }
.home-who__copy { display: flex; flex-direction: column; }
.home-who__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,3.2rem); font-weight: 400; color: var(--color-green-dark); letter-spacing: -0.01em; line-height: 1.15; margin-bottom: 0.75rem; }
.home-who__accent { display: block; width: 40px; height: 3px; background: #57B94B; margin-bottom: 1.5rem; }
.home-who__body { font-size: 18px; line-height: 1.85; color: var(--color-text-body); }
.home-who__link { display: inline-flex; align-items: center; gap: 12px; font-family: 'DM Sans', system-ui, sans-serif; font-size: 15px; font-weight: 500; color: #0A7D39; text-decoration: none; margin-top: 1.75rem; padding: 14px 28px; border: 1px solid rgba(3,136,57,0.6); border-radius: 5px; transition: all 0.2s ease; align-self: flex-start; }
.home-who__link:hover { background: #3E9A63; color: #fff; border-color: #3E9A63; }
.home-who__link:hover img { filter: brightness(0) invert(1); }

/* HOME INDUSTRIES */
.home-industries { padding: 5rem 0 4rem; background: #fff; position: relative; z-index: 1; }
.home-industries__header { text-align: center; margin-bottom: 3rem; }
.home-industries__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,3.2rem); font-weight: 400; color: var(--color-green-dark); letter-spacing: -0.01em; line-height: 1.15; margin-bottom: 0.75rem; }
.home-industries__subtitle { font-size: 18px; color: var(--color-text-muted); line-height: 1.6; }
.home-industries__slider { overflow: hidden; }
.home-industries__track { display: flex; gap: 1.25rem; align-items: flex-end; transition: opacity 0.26s ease; }
.home-industries__track.is-fading { opacity: 0; }
.home-industry-card { position: relative; border-radius: 0; overflow: hidden; flex: 1 1 0; min-width: 0; }
.home-industry-card:nth-child(odd) { height: 480px; }
.home-industry-card:nth-child(even) { height: 440px; }
@media (max-width: 599px) {
  .home-industry-card:nth-child(odd), .home-industry-card:nth-child(even) { height: 380px; }
}
.home-industry-card__img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.home-industry-card:hover .home-industry-card__img { transform: scale(1.04); }
.home-industry-card__overlay { position: absolute; inset: 0; background: linear-gradient(to top,rgba(6,32,29,0.75) 0%,transparent 55%); display: flex; align-items: flex-end; padding: 1.25rem 1.5rem 1.5rem; }
.home-industry-card__name { font-family: var(--font-display); font-size: clamp(1.05rem,1.5vw,1.25rem); font-weight: 400; color: #fff; line-height: 1.25; }
.home-industries__footer { display: flex; justify-content: space-between; align-items: center; margin-top: 2rem; position: relative; }
.home-industries__footer-line { flex: 1; height: 1px; background: rgba(62,154,99,0.2); position: relative; overflow: hidden; }
.home-industries__footer-progress { position: absolute; left: 0; top: 0; height: 100%; background: #4BD718; transition: width 0.4s ease; }
.home-industries__nav-btns { display: flex; align-items: center; gap: 0.4rem; padding-left: 1.5rem; flex-shrink: 0; }
.home-industries__nav-btn { display: flex; align-items: center; justify-content: center; border: none; background: none; cursor: pointer; transition: opacity 0.2s; padding: 0; }
.home-industries__nav-btn:hover { opacity: 1; }
.home-industries__nav-btn:disabled { opacity: 0.2; cursor: default; }
.home-industries__nav-btn--prev { color: #038839; opacity: 0.4; }
.home-industries__nav-btn--prev.active { opacity: 1; }
.home-industries__nav-btn--prev svg { width: 18px; height: 18px; }
.home-industries__nav-btn--next { color: #038839; opacity: 0.6; }
.home-industries__nav-btn--next svg { width: 26px; height: 26px; }

/* HOME CTA */
.home-cta { position: relative; z-index: 1; background-size: cover; background-position: center 30%; }
.home-cta__inner { position: relative; z-index: 1; padding-top: 8rem; padding-bottom: 8rem; display: flex; flex-direction: column; align-items: flex-start; text-align: left; gap: 1.25rem; }
.home-cta__heading { font-family: var(--font-display); font-size: clamp(2rem,4vw,3.2rem); font-weight: 500; color: #fff; letter-spacing: -0.02em; line-height: 1.15; max-width: 900px; }
.home-cta__body { font-size: 18px; line-height: 1.75; color: rgba(255,255,255,0.75); margin-bottom: 0.5rem; max-width: 680px; }

/* HOME RESPONSIVE */
@media (min-width: 1025px) and (max-width: 1300px) {
  .home-hero { background: #e4f6e8 url('/images/logo-glass-composition.png') 88% 55% no-repeat !important; background-size: 38% auto !important; height: auto; min-height: unset; }
  .home-hero__inner { grid-template-columns: 1fr; padding-top: calc(var(--nav-height) + 4rem); padding-bottom: 5rem; }
  .home-hero__copy { min-height: unset; max-width: 100%; }
  .home-hero__body { max-width: 60%; }
  .home-hero__heading-line1, .home-hero__accent { white-space: normal; }
  .home-hero__image-wrap { display: none; }
  .home-hero__image { display: none; }
}
@media (min-width: 1301px) and (max-width: 1399px) {
  .home-hero { background-position: 85% 85%; background-size: 42% auto; height: 100vh; }
  .home-hero__inner { padding-top: calc(var(--nav-height) + 20px); }
  .home-hero__copy { min-height: 400px; }
}
@media (min-width: 1400px) and (max-width: 2199px) {
  .home-hero { background-position: 85% 80%; background-size: 40% auto; height: 100vh; }
}
@media (max-width: 680px) {
  .home-services__grid { grid-template-columns: 1fr; }
  .home-service-card { padding: 2rem; }
  .home-stats-bar__inner { grid-template-columns: repeat(2,1fr); gap: 0; }
}
@media (max-width: 1024px) {
  .home-hero { background: #e4f6e8; background-image: none; height: auto; min-height: unset; overflow: hidden; position: relative; }
  .home-hero__body { padding-right: 10%; }
  .home-hero__inner { grid-template-columns: 1fr; padding-top: calc(var(--nav-height) + 4.5rem); padding-bottom: 0; }
  .home-hero__heading { font-size: clamp(2.4rem, 7vw, 3.5rem); }
  .home-hero__heading-line1, .home-hero__accent { white-space: normal; }
  .home-hero__copy { min-height: unset !important; max-width: 100% !important; width: 100%; margin-top: 0; }
  .home-hero__body { max-width: 100%; }
  .home-hero__ctas { flex-direction: row; flex-wrap: wrap; }
  .home-hero__image-wrap { display: block; margin-top: 1rem; margin-bottom: 0; overflow: hidden; }
  .home-hero__image { display: block; width: 75%; max-width: 550px; object-fit: contain; margin: 0 auto; }
  .home-hero__inner { padding-bottom: 0; }
  .home-stat__label { white-space: pre-line; }

  .home-stat { padding: 1.75rem 1.25rem; border-right: none; border-bottom: none; }
  .home-stat:first-child { padding-left: 1.25rem; border-right: 1px solid rgba(62,154,99,0.2); }
  .home-stat:nth-child(1), .home-stat:nth-child(2) { border-bottom: 1px solid rgba(62,154,99,0.2); }
  .home-stat:nth-child(2) { border-right: none; }
  .home-stats-bar__inner { grid-template-columns: repeat(2,1fr); }
  .home-who__inner { grid-template-columns: 1fr; }
  .home-services__grid { grid-template-columns: 1fr; }
  .home-service-card { padding: 2.25rem; }
  .home-who__photo-frame::after { display: none; }
  .home-who__photo-wrap { aspect-ratio: unset; height: 340px; }
  .home-who { padding: 3.5rem 0; }
  .home-industry-card:nth-child(odd), .home-industry-card:nth-child(even) { height: 340px; }
  .home-cta__inner { padding-top: 5rem; padding-bottom: 5rem; }
  .home-who__top-label { font-size: 26px; }
  .section-label { font-size: 15px; }
}
@media (max-width: 599px) {
  /* Global mobile padding */
  :root { --container-px: 16px; }
  /* Hero */
  .home-hero { background-image: none; height: auto; min-height: unset; position: relative; width: 100%; max-width: 100vw; overflow: hidden; }
  .home-hero__inner { grid-template-columns: 1fr; padding-top: calc(var(--nav-height) + 1.5rem); padding-bottom: 0; }
  .home-hero__copy { min-height: unset !important; margin-top: 0; max-width: 100%; }
  .home-hero__heading { font-size: clamp(2.4rem, 10vw, 3.2rem); line-height: 1.08; white-space: normal; }
  .home-hero__heading-line1 { white-space: normal; }
  .home-hero__accent { white-space: normal; }
  .home-hero__body { font-size: 16px; margin-top: 1.25rem; }
  .home-hero__ctas { margin-top: 2rem; flex-direction: column; gap: 10px; }
  .home-hero__ctas .btn { width: 100%; text-align: center; justify-content: center; }
  .home-hero__image-wrap { display: block; margin-top: 1rem; overflow: visible; margin-bottom: 0; }
  .home-hero__image { display: block; width: 90%; max-width: 400px; object-fit: contain; margin: 0 auto; }
  /* Stats */
  .home-stats-bar { padding: 1.25rem 0; }
  .home-stats-bar__inner { grid-template-columns: repeat(2,1fr); gap: 0; }
  .home-stat { padding: 1rem; border-right: none; border-bottom: none; }
  .home-stat:first-child { border-right: 1px solid rgba(62,154,99,0.2); }
  .home-stat__value { font-size: clamp(1.6rem, 8vw, 2.2rem); }
  .home-stat__label { font-size: 12px; letter-spacing: 0.08em; white-space: pre-line; }
  .home-stat:nth-child(1), .home-stat:nth-child(2) { border-bottom: 1px solid rgba(62,154,99,0.2); }
  /* Services */
  .home-services { padding: 1.5rem 0 2rem; }
  .home-services__grid { grid-template-columns: 1fr; gap: 0.75rem; }
  .home-service-card { padding: 1.75rem 1.25rem; min-height: unset; }
  .home-service-card__body { font-size: 16px; }
  .home-service-card__link { margin-top: 1rem; white-space: normal; }
  .home-service-card__title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
  .home-service-card__sublabel { font-size: 12px; }
  /* Who We Are */
  .home-who { padding: 2.5rem 0; }
  .home-who__inner { grid-template-columns: 1fr; gap: 1.5rem; }
  .home-who__photo { height: 260px; }
  .home-who__photo-frame::after { display: none; }
  /* Industries */
  .home-industry-card:nth-child(odd), .home-industry-card:nth-child(even) { height: 300px; }
  /* CTA */
  .home-cta__inner { padding-top: 3rem; padding-bottom: 3rem; }
  .home-cta__heading { font-size: clamp(1.8rem, 8vw, 2.5rem); }
  .home-cta__heading br { display: none; }
  .home-cta__body { font-size: 16px; }
  .home-cta__inner .btn { width: 100%; text-align: center; justify-content: center; }
  /* Footer */
  .footer__top { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .footer__nav ul { justify-content: flex-start; flex-direction: column; gap: 0.5rem; }
  .footer { padding-bottom: 1.5rem; }
}

/* ── VERTICAL DRAWER ── */
.vertical-drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; justify-content: flex-end; }
.vertical-drawer { background: #fff; width: 480px; max-width: 90vw; height: 100%; overflow-y: auto; padding: 52px 40px 60px; position: relative; display: flex; flex-direction: column; animation: drawerIn 0.3s ease; }
@keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.vertical-drawer__close { position: absolute; top: 24px; right: 28px; font-size: 18px; color: #214f3f; background: none; border: none; cursor: pointer; line-height: 1; transition: color 0.2s; }
.vertical-drawer__close:hover { color: #009444; }
.vertical-drawer__eyebrow { font-family: var(--font-display); font-size: clamp(1.1rem,1.5vw,1.4rem); font-weight: 400; letter-spacing: 0; text-transform: none; color: #417C61; margin: 0 0 6px; display: block; }
.vertical-drawer__title { font-family: var(--font-display); font-size: 32px; font-weight: 400; color: #214f3f; margin: 0 0 20px; line-height: 1.1; }
.vertical-drawer__divider { height: 1px; background: #c8ddd0; margin-bottom: 32px; }
.vertical-drawer__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0; }
.vertical-drawer__list li { font-family: var(--font-display); font-size: 20px; font-weight: 400; color: #214f3f; padding: 12px 0; line-height: 1.3; }
.vertical-drawer__nav { display: flex; align-items: center; gap: 1.5rem; margin-top: 2rem; }
.vertical-drawer__nav-prev { font-size: 2rem; color: #39B22B; background: none; border: none; cursor: pointer; line-height: 1; }
.vertical-drawer__nav-next { font-size: 2rem; color: #39B22B; background: none; border: none; cursor: pointer; line-height: 1; }
@media (max-width: 599px) {
  .vertical-drawer { padding: 64px 24px 48px; }
  .vertical-drawer__title { font-size: 26px; }
  .vertical-drawer__list li { font-size: 17px; }
}

/* ── INVESTORS PAGE ── */
.investors-hero { position: sticky; top: 0; z-index: 0; background: linear-gradient(254deg,#effff2 1.3%,rgba(202,242,209,0.47) 98.7%); min-height: 75vh; display: flex; align-items: center; overflow: hidden; }
.investors-hero__img { position: absolute; right: 0; bottom: -50px; width: 75%; height: 110%; object-fit: cover; object-position: left top; pointer-events: none; z-index: 0; }
.investors-hero-shell { position: relative; z-index: 1; padding-top: calc(var(--nav-height) + 5rem); padding-bottom: 6rem; }
.investors-hero-copy { max-width: 900px; }
.investors-hero-title { margin: 0 0 12px; font-family: var(--font-display); font-size: 62px; font-weight: 400; line-height: 1.08; letter-spacing: -0.02em; color: #214f3f; white-space: nowrap; }
.investors-hero-subtitle { margin: 0; font-family: var(--font-display); font-size: 40px; font-weight: 400; line-height: 1.08; letter-spacing: -0.02em; color: #214f3f; white-space: nowrap; }
.investors-hero-text { max-width: 580px; margin: 28px 0 0; font-size: 18px; line-height: 1.75; color: var(--color-text-body); }
.investors-services-section { padding: 40px 0 108px; background: #ffffff; position: relative; z-index: 1; }
.investors-services-header { margin-bottom: 28px; }
.investors-services-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.investors-services-subtitle { margin: 14px 0 0; font-family: var(--font-display); font-size: 26px; line-height: 1.3; font-weight: 400; letter-spacing: 0.05em; color: #2d5342; text-transform: capitalize; }
.investors-services-divider { height: 1px; margin-bottom: 28px; background: rgba(213,231,212,1); }
.investors-services-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }
.investors-service-card { background: #ffffff; box-shadow: 0 10px 28px rgba(122,160,135,0.08); }
.investors-service-image { padding: 0; }
.investors-service-image img { width: 100%; height: 200px; object-fit: cover; }
.investors-service-body { padding: 36px 24px 44px; }
.investors-service-title { margin: 0; font-family: var(--font-display); font-size: 32px; line-height: 1.15; font-weight: 400; color: #3b6d5b; }
.investors-service-line { width: 46px; height: 3px; margin: 16px 0 24px; border-radius: 999px; background: #57B94B; }
.investors-service-text { margin: 0; font-size: 17px; line-height: 1.55; color: rgba(45,96,77,0.74); }
.investors-approach-section { padding: 60px 0 80px; background: radial-gradient(circle at left top, rgba(224,244,219,0.5), transparent 30%), linear-gradient(180deg,#f4fbf2 0%,#edf8ea 100%); position: relative; z-index: 1; }
.investors-approach-shell { display: grid; grid-template-columns: minmax(0,1fr) minmax(360px,500px); align-items: center; gap: 72px; }
.investors-approach-copy { max-width: 760px; }
.investors-approach-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.investors-approach-line { width: 48px; height: 3px; margin: 20px 0 28px; border-radius: 999px; background: #57B94B; }
.investors-approach-text { margin: 0; max-width: 760px; font-size: 18px; line-height: 1.75; color: rgba(45,96,77,0.82); }
.investors-approach-link { display: inline-flex; align-items: center; gap: 12px; margin-top: 52px; font-family: var(--font-body); font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #2ab54a; text-decoration: none; transition: color 0.2s ease; }
.investors-approach-link:hover { color: #009444; }
.investors-approach-visual-wrap { position: relative; }
.investors-approach-visual-frame { position: absolute; inset: 36px 60px -20px -20px; border: 1px solid rgba(207,224,202,0.9); }
.investors-approach-visual { position: relative; z-index: 1; overflow: hidden; background: #09321e; }
.investors-approach-visual img { width: 100%; height: auto; display: block; object-fit: cover; }
.investors-approach-img--tablet { display: none !important; }
.investors-approach-visual-text { position: absolute; top: 24px; left: 24px; font-family: var(--font-display); font-size: 28px; font-weight: 400; line-height: 1.3; color: #ffffff; pointer-events: none; }
.investors-approach-visual-text span { display: block; }
.investors-advantages-section { padding: 84px 0 112px; background: #ffffff; position: relative; z-index: 1; }
.investors-advantages-header { margin-bottom: 28px; }
.investors-advantages-eyebrow { font-family: var(--font-display); margin: 0 0 8px; font-size: 24px; font-weight: 400; letter-spacing: 0; text-transform: none; color: #417C61; display: block; }
.investors-advantages-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.investors-advantages-divider { height: 1px; margin-bottom: 36px; background: rgba(213,231,212,1); }
.investors-advantages-layout { display: grid; grid-template-columns: 390px minmax(0,1fr); gap: 18px; align-items: stretch; }
.investors-advantages-visual { position: relative; overflow: hidden; min-height: 560px; background: #0b3f24; }
.investors-advantages-visual img { width: 100%; height: 100%; object-fit: cover; }
.investors-advantages-visual-caption { position: absolute; left: 22px; bottom: 28px; }
.investors-advantages-visual-caption p { margin: 0; font-family: var(--font-display); font-size: 28px; line-height: 1.1; font-weight: 400; color: #eef6eb; }
.investors-advantages-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 16px; }
.investors-advantage-card { min-height: 270px; padding: 40px 28px 36px; display: flex; flex-direction: column; justify-content: center; border: 1px solid rgba(213,231,212,1); background: #ffffff; }
.investors-advantage-title { margin: 0 0 18px; font-family: var(--font-display); font-size: 32px; line-height: 1.15; font-weight: 400; color: #3b6d5b; }
.investors-advantage-text { margin: 0; font-size: 17px; line-height: 1.65; color: rgba(45,96,77,0.74); }
.investors-verticals-section { padding: 84px 0 112px; background: radial-gradient(circle at left top, rgba(224,244,219,0.42), transparent 30%), linear-gradient(180deg,#f4fbf2 0%,#edf8ea 100%); position: relative; z-index: 1; }
.investors-verticals-header { max-width: 980px; margin-bottom: 42px; }
.investors-verticals-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.investors-verticals-line { width: 48px; height: 3px; margin: 20px 0 28px; border-radius: 999px; background: #57B94B; }
.investors-verticals-text { margin: 0; max-width: 760px; font-size: 18px; line-height: 1.75; color: rgba(45,96,77,0.78); }
.investors-verticals-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px 18px; }
.investors-vertical-card { display: flex; align-items: center; justify-content: space-between; gap: 18px; min-height: 72px; padding: 14px 18px; border: 1px solid rgba(194,230,190,0.9); background: rgba(244,251,242,0.22); cursor: pointer; transition: background 0.2s, border-color 0.2s; }
.investors-vertical-card:hover { background: #0a5a2a; border-color: #0a5a2a; }
.investors-vertical-card:hover span:first-child { color: #eef8ec; }
.investors-vertical-card:hover .investors-vertical-arrow { opacity: 1; }
.investors-vertical-card span:first-child { font-family: var(--font-display); font-size: 19px; line-height: 1.3; font-weight: 400; color: #2d604d; transition: color 0.2s; }
.investors-vertical-card-active { background: #0a5a2a; border-color: #0a5a2a; }
.investors-vertical-card-active span:first-child { color: #eef8ec; }
.investors-vertical-arrow { flex: 0 0 auto; opacity: 0; transition: opacity 0.2s; }
.investors-vertical-card-active .investors-vertical-arrow { opacity: 1; }
.investors-vertical-arrow img { width: 16px; height: 14px; filter: brightness(0) invert(1); display: block; }
.investors-cta-section { position: relative; z-index: 1; overflow: hidden; background: linear-gradient(90deg,rgba(0,53,18,0.86) 0%,rgba(0,53,18,0.58) 38%,rgba(0,53,18,0.16) 100%), url('/images/letsStartConversation.jpg') center/cover no-repeat; }
.investors-cta-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 78% 38%,rgba(140,197,137,0.18),transparent 28%), linear-gradient(180deg,rgba(0,43,17,0.12) 0%,rgba(0,43,17,0.2) 100%); pointer-events: none; }
.investors-cta-copy { position: relative; z-index: 1; padding: 8rem 0; display: flex; flex-direction: column; align-items: flex-start; text-align: left; gap: 1.25rem; }
.investors-cta-title { margin: 0; max-width: 640px; font-family: var(--font-display); font-size: clamp(2rem,4vw,3.2rem); line-height: 1.15; font-weight: 500; letter-spacing: -0.02em; color: #fff; }
.investors-cta-text { margin: 0; max-width: 560px; font-size: 18px; line-height: 1.75; color: rgba(255,255,255,0.75); }
.investors-cta-button { display: inline-flex; align-items: center; gap: 16px; margin-top: 0.5rem; padding: 14px 28px; border-radius: 5px; background: #009444; font-family: var(--font-body); font-size: 15px; font-weight: 600; color: #fff; transition: all 0.2s ease; }
.investors-cta-button:hover { transform: translateY(-1px); filter: brightness(1.1); }
@media (max-width: 1024px) {
  .investors-services-grid { grid-template-columns: 1fr 1fr; }
  .investors-approach-shell { grid-template-columns: 1fr; }
  .investors-advantages-layout { grid-template-columns: 1fr; }
  .investors-verticals-grid { grid-template-columns: repeat(2,1fr); }
}
@media (max-width: 680px) {
  .investors-services-grid { grid-template-columns: 1fr; }
  .investors-advantages-grid { grid-template-columns: 1fr; }
  .investors-verticals-grid { grid-template-columns: 1fr 1fr; }
  .investors-hero-title { font-size: 40px; line-height: 1.1; white-space: normal; }
  .investors-hero-subtitle { font-size: 30px; line-height: 1.2; white-space: normal; }
}
@media (max-width: 1024px) {
  .investors-hero { min-height: auto; }
  .investors-hero-title { font-size: clamp(2.4rem, 6vw, 3rem); white-space: normal; }
  .investors-hero-subtitle { font-size: clamp(1.6rem, 4vw, 2.2rem); white-space: normal; }
  .investors-hero__img { width: 55%; opacity: 0.25; }
  .investors-hero-shell { padding-top: calc(var(--nav-height) + 3rem); padding-bottom: 4rem; }
  .investors-services-section { padding: 60px 0 72px; }
  .investors-services-grid { grid-template-columns: 1fr; gap: 20px; }
  .investors-service-card { display: grid; grid-template-columns: 2fr 3fr; align-items: stretch; }
  .investors-service-image { padding: 2rem; }
  .investors-service-image img { height: 100%; min-height: 240px; object-fit: cover; border-radius: 4px; }
  .investors-service-body { padding: 2.5rem 2rem; display: flex; flex-direction: column; justify-content: center; }
  .investors-approach-visual-frame { display: none; }
  .investors-approach-shell { gap: 2.5rem; }
  .investors-approach-section { padding: 48px 0 60px; }
  .investors-approach-img--desktop { display: none !important; }
  .investors-approach-img--tablet { display: block !important; height: 320px; object-fit: cover; }
  .investors-approach-visual-text { top: 56px; }
  .investors-advantages-visual { min-height: 280px; max-height: 280px; }
  .investors-advantages-section { padding: 60px 0 72px; }
  .investors-advantage-card { min-height: auto; padding: 40px 24px; }
  .investors-service-title { font-size: 30px; }
  .investors-advantage-title { font-size: 30px; }
  .vertical-drawer__eyebrow { font-size: 20px; }
  .investors-advantages-eyebrow { font-size: 20px; }
  .investors-verticals-section { padding: 60px 0 72px; }
  .investors-cta-copy { padding: 5rem 0; }
  .home-cta__heading { line-height: 1.3; }
}
@media (max-width: 599px) {
  /* Investors hero */
  .investors-hero { min-height: auto; }
  .investors-hero__img { display: none; }
  .investors-hero-shell { padding-top: calc(var(--nav-height) + 2rem); padding-bottom: 3rem; }
  .investors-hero-title { font-size: clamp(1.8rem, 8vw, 2.4rem); white-space: normal; }
  .investors-hero-subtitle { font-size: clamp(1.3rem, 5.5vw, 1.8rem); white-space: normal; }
  .investors-hero-text { font-size: 16px; }
  /* Investors services */
  .investors-services-section { padding: 3rem 0 3.5rem; }
  .investors-services-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .investors-services-subtitle { font-size: 20px; }
  .investors-service-card { grid-template-columns: 1fr; }
  .investors-service-image img { height: 220px; min-height: unset; }
  .investors-service-body { padding: 1.5rem; }
  /* Investors approach */
  .investors-approach-section { padding: 3rem 0 3.5rem; }
  .investors-approach-shell { grid-template-columns: 1fr; gap: 2rem; }
  .investors-approach-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .investors-approach-visual-frame { display: none; }
  /* Investors advantages */
  .investors-advantages-section { padding: 3rem 0 3.5rem; }
  .investors-advantages-layout { grid-template-columns: 1fr; }
  .investors-advantages-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .investors-advantages-visual { min-height: 300px; }
  .investors-advantage-card { min-height: auto; padding: 28px 20px; }
  .investors-service-title { font-size: 26px; }
  .investors-advantage-title { font-size: 26px; }
  /* Investors verticals */
  .investors-verticals-section { padding: 3rem 0 3.5rem; }
  .investors-verticals-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .investors-verticals-grid { grid-template-columns: 1fr; }
  .investors-vertical-card { min-height: 56px; }
  /* Investors CTA */
  .investors-cta-copy { padding: 4rem 0; }
  .investors-cta-title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
  .investors-cta-button { width: 100%; text-align: center; justify-content: center; }
}

/* ── BUSINESS OWNERS PAGE ── */
.bo-hero { position: sticky; top: 0; z-index: 0; background: linear-gradient(254deg,#effff2 1.3%,rgba(202,242,209,0.47) 98.7%); min-height: 75vh; display: flex; align-items: center; overflow: hidden; }
.bo-hero__img { position: absolute; right: 0; bottom: -50px; width: 75%; height: 110%; object-fit: cover; object-position: left top; pointer-events: none; z-index: 0; }
.bo-hero__inner { position: relative; z-index: 1; padding-top: calc(var(--nav-height) + 4rem); padding-bottom: 5rem; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 4rem; }
.bo-hero__copy { max-width: 580px; }
.bo-hero__heading { font-family: var(--font-display); font-size: 62px; font-weight: 400; line-height: 1.08; color: #214f3f; letter-spacing: -0.02em; margin-bottom: 1.5rem; }
.bo-hero__body { font-size: 18px; line-height: 1.75; color: var(--color-text-body); max-width: 720px; }
@media (max-width: 1024px) { .bo-hero__heading { font-size: clamp(2.4rem,8vw,3.5rem); } .bo-hero__inner { grid-template-columns: 1fr; } .bo-hero__img { width: 55%; opacity: 0.25; } }
.bo-who { --bo-photo-frame-line: rgba(190,212,182,0.45); --bo-photo-caption-line: #57B94B; padding: 3rem 0 2.5rem; background: #fff; position: relative; z-index: 1; }
.bo-right { position: relative; z-index: 1; }
.bo-commitment { position: relative; z-index: 1; padding: 5rem 0; overflow: hidden; background: url('/images/commitmentBg.png') center/cover no-repeat; }
.bo-testimonial { position: relative; z-index: 1; }
.bo-faqs { position: relative; z-index: 1; }
.bo-cta { position: relative; z-index: 1; }
.bo-who__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; margin-bottom: 3rem; }
.bo-who__copy { display: flex; flex-direction: column; gap: 0; }
.bo-who__label { font-family: var(--font-display); font-size: clamp(1.1rem,1.5vw,1.4rem); font-weight: 400; color: #417C61; letter-spacing: 0; text-transform: none; margin-bottom: 4px; display: block; }
.bo-who__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,54px); font-weight: 400; color: var(--color-green-dark); letter-spacing: -0.02em; line-height: 1.1; margin-top: 0; margin-bottom: 0; position: relative; padding-bottom: 24px; text-transform: none; font-variant: normal; font-feature-settings: normal; }
.bo-who__heading::after { content: ''; position: absolute; bottom: 0; left: 0; width: 3rem; height: 3px; background-color: #57B94B; }
.bo-who__body { font-size: 18px; line-height: 1.75; color: var(--color-text-body); max-width: 52rem; margin-top: 24px; }
.bo-who__body--emphasis { font-weight: 500; margin-top: 20px; color: rgba(10,34,23,0.75); }
.bo-who__photo-wrap { position: relative; border-radius: 0; overflow: visible; aspect-ratio: 4/3; z-index: 0; margin-top: 0; }
.bo-who__photo-wrap::before { content: ''; position: absolute; top: -1.2rem; left: -1.2rem; width: 80%; height: 100%; border: 1px solid var(--bo-photo-frame-line); z-index: 0; pointer-events: none; }
.bo-who__photo { width: 100%; height: 100%; object-fit: cover; border-radius: 0; position: absolute; inset: 0; z-index: 1; }
.bo-who__photo-overlay { position: absolute; inset: 0; background: linear-gradient(to top,rgba(6,32,29,0.65) 0%,transparent 55%); display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: 1rem; padding: 1.75rem; border-radius: 4px; z-index: 2; }
.bo-who__photo-overlay::after { content: ''; width: 100%; height: 1px; background: var(--bo-photo-caption-line); opacity: 0.9; }
.bo-who__photo-overlay span { font-family: var(--font-display); font-size: clamp(1.5rem,2.5vw,2.2rem); font-weight: 400; color: #fff; line-height: 1.3; letter-spacing: 0; }
.bo-who__divider { height: 1px; background: var(--color-border-light); margin-bottom: 3rem; }
.bo-who__columns { display: grid; grid-template-columns: repeat(3,1fr); gap: 2.25rem; }
.bo-who__columns > div { padding: 3rem 2rem; }
.bo-who__columns > div:first-child { padding-left: 0; }
.bo-who__columns > div:not(:last-child) { border-right: 1px solid rgba(3,136,57,0.25); }
.bo-who__col-title { font-family: var(--font-display); font-size: 26px; font-weight: 400; line-height: 1.2; letter-spacing: -0.01em; margin-bottom: 0; position: relative; padding-bottom: 28px; }
.bo-who__col-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 2.5rem; height: 3px; background-color: #57B94B; }
.bo-who__col-body { font-size: 17px; line-height: 1.7; color: var(--color-text-muted); margin-top: 28px; }
.bo-right { padding: 5rem 0; background: #f7faf8; }
.bo-right__inner { }
.bo-right__header { margin-bottom: 3rem; }
.bo-right__label { font-family: var(--font-display); font-size: clamp(1.4rem,2.2vw,2.1rem); font-weight: 400; color: #417C61; letter-spacing: 0; text-transform: none; margin-bottom: 8px; display: block; }
.bo-right__heading { font-family: var(--font-display); font-size: clamp(2.2rem,3.8vw,60px); font-weight: 400; color: var(--color-green-dark); letter-spacing: -0.02em; line-height: 1.1; }
.bo-right__heading span { color: #009444; }
.bo-right__divider { width: 100%; height: 1px; background: #c8ddd0; margin-top: 1.5rem; }
.bo-right__layout { display: grid; grid-template-columns: 0.45fr 1fr; gap: 2rem; align-items: stretch; min-height: 600px; }
.bo-right__photo-wrap { position: relative; height: 100%; min-height: 600px; overflow: hidden; border-radius: 0; }
.bo-right__photo { width: 100%; height: 100%; object-fit: cover; border-radius: 0; }
.bo-right__photo-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; padding: 1.75rem; background: linear-gradient(to top,rgba(6,32,29,0.75) 0%,transparent 55%); }
.bo-right__photo-overlay span { font-family: var(--font-display); font-size: clamp(1.4rem,2vw,2rem); font-weight: 400; color: #fff; line-height: 1.2; letter-spacing: 0; }
.bo-right__cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; height: 100%; }
.bo-right-card { border: 1px solid #cfe5d6; padding: 2.5rem; display: flex; flex-direction: column; justify-content: flex-start; gap: 0.75rem; background: transparent; min-height: 290px; }
.bo-right-card__title { font-family: var(--font-display); font-size: 32px; line-height: 37px; font-weight: 400; color: var(--color-green-dark); letter-spacing: -0.01em; margin-bottom: 0; }
.bo-right-card__body { font-size: 17px; line-height: 1.75; color: var(--color-text-body); margin-top: 16px; }
.bo-commitment .container { position: relative; z-index: 2; }
.bo-commitment__header { margin-bottom: 2.5rem; max-width: 60rem; }
.bo-commitment__label { font-family: var(--font-display); font-size: clamp(1.1rem,1.5vw,1.4rem); font-weight: 400; color: #57B94B; letter-spacing: 0; text-transform: none; margin-bottom: 4px; display: block; }
.bo-commitment__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,54px); font-weight: 400; color: #fff; line-height: 1.1; position: relative; padding-bottom: 24px; letter-spacing: -0.02em; margin: 0; }
.bo-commitment__heading::after { content: ''; position: absolute; bottom: 0; left: 0; width: 3rem; height: 3px; background: #57B94B; }
.bo-commitment__grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.25rem; }
.bo-commitment-card { background: linear-gradient(85.58deg,#074B28 1.64%,#013F1F 98.36%); border: none; box-shadow: 0 8px 32px rgba(0,0,0,0.25); padding: 3rem 2.5rem; border-radius: 6px; display: flex; flex-direction: column; gap: 1rem; min-height: 220px; justify-content: center; transition: transform 0.2s ease, box-shadow 0.2s; }
.bo-commitment-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
.bo-commitment-card__title { font-family: var(--font-display); font-size: 36px; font-weight: 400; color: #fff; letter-spacing: -0.01em; line-height: 1.2; margin-bottom: 0; }
.bo-commitment-card__body { font-size: 1.1875rem; line-height: 1.7; color: rgba(255,255,255,0.75); }
.bo-process { padding: 6rem 0 43px; background: var(--color-bg-light); position: relative; z-index: 1; }
.bo-process__inner { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.bo-process__photo-wrap { position: relative; overflow: visible; width: 100%; }
.bo-process__photo-wrap::before { content: ''; position: absolute; top: -1rem; left: -1rem; width: 80%; height: 100%; border: 1px solid #c8ddd0; z-index: 0; pointer-events: none; }
.bo-process__photo { width: 100%; height: auto; aspect-ratio: 4/3; object-fit: cover; border-radius: 0; display: block; position: relative; z-index: 1; }
.bo-process__copy { display: flex; flex-direction: column; gap: 1.5rem; }
.bo-process__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,54px); font-weight: 400; color: var(--color-green-dark); line-height: 1.1; position: relative; padding-bottom: 24px; letter-spacing: -0.02em; margin: 0; }
.bo-process__heading::after { content: ''; position: absolute; bottom: 0; left: 0; width: 3rem; height: 3px; background: #57B94B; }
.bo-process__body { display: flex; flex-direction: column; gap: 1rem; margin-top: 8px; }
.bo-process__body p { font-size: 18px; line-height: 1.75; color: var(--color-text-body); }
.bo-process__cta { font-size: 0.875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #39B22B; text-decoration: none; margin-top: 1rem; transition: color 0.2s ease; display: inline-flex; align-items: center; gap: 10px; }
.bo-process__cta:hover { color: #009444; }
.bo-process__cta-arrow { font-size: 1.1rem; letter-spacing: 0; }
.bo-testimonial { padding: 0 0 4rem; background: var(--color-bg-light); }
.bo-testimonial__inner { display: flex; justify-content: center; }
.bo-testimonial__content { background: #fff; padding: 3.5rem 5rem; max-width: 90rem; width: 100%; text-align: center; border-radius: 4px; display: flex; flex-direction: column; align-items: center; }
.bo-testimonial__quote-icon { font-family: var(--font-display); font-size: 5rem; color: #57B94B; display: block; line-height: 0.8; margin-bottom: 0.4rem; }
.bo-testimonial__quote { font-family: var(--font-display); font-size: 26px; line-height: 1.55; letter-spacing: 0.05px; color: rgba(10,34,23,0.75); max-width: 55rem; margin: 0 auto 2rem; font-weight: 400; font-style: normal; }
.bo-testimonial__divider { height: 1px; background: #e2e8e5; margin: 2rem 0; width: 100%; }
.bo-testimonial__attribution { font-family: var(--font-body); font-size: 15px; font-weight: 500; font-style: normal; letter-spacing: 0.14em; text-transform: uppercase; color: #57B94B; display: block; margin-bottom: 1.5rem; }
.bo-testimonial__nav { display: flex; justify-content: center; align-items: center; gap: 1.5rem; }
.bo-testimonial__arrow { color: var(--color-green-accent); background: transparent; border: none; cursor: pointer; transition: opacity 0.2s ease; }
.bo-testimonial__arrow:hover { opacity: 0.7; }
.bo-testimonial__arrow--prev { font-size: 1.2rem; }
.bo-testimonial__arrow--next { font-size: 2rem; }
.bo-testimonial__dots { display: flex; gap: 8px; align-items: center; }
.bo-testimonial__dot { width: 8px; height: 8px; border-radius: 50%; background: #c5d9cc; cursor: pointer; transition: background 0.2s; }
.bo-testimonial__dot--active { background: var(--color-green-accent); }
.bo-faqs { padding: 6rem 0; background: var(--color-bg); }
.bo-faqs__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,54px); font-weight: 400; color: var(--color-green-dark); margin-bottom: 1.75rem; position: relative; padding-bottom: 24px; letter-spacing: -0.02em; line-height: 1.1; }
.bo-faqs__heading::after { content: ''; position: absolute; bottom: 0; left: 0; width: 3rem; height: 3px; background: #57B94B; }
.bo-faqs__grid { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--color-border-light); }
.bo-faqs__col { display: flex; flex-direction: column; }
.bo-faqs__col:first-child { border-right: 1px solid var(--color-border-light); }
.bo-faq-item { border-bottom: 1px solid var(--color-border-light); padding: 0; background: transparent; cursor: pointer; overflow: hidden; transition: background 0.25s ease, border-color 0.25s ease; }
.bo-faq-item:not(.bo-faq-item--open):hover { background: #0a5a2a; border-color: #0a5a2a; }
.bo-faq-item:not(.bo-faq-item--open):hover .bo-faq-item__q { color: #eef8ec; }
.bo-faq-item:not(.bo-faq-item--open):hover .bo-faq-item__icon { color: #8fd68a; }
.bo-faq-item:last-child { border-bottom: none; }
.bo-faq-item__top { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; gap: 1rem; }
.bo-faq-item__top { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; gap: 1rem; }
.bo-faq-item__q { font-family: var(--font-display); font-size: 20px; font-weight: 400; color: var(--color-green-dark); line-height: 1.3; letter-spacing: -0.01em; text-transform: none; transition: color 0.2s; }
.bo-faq-item--open .bo-faq-item__q { color: #009444; }
.bo-faq-item__icon { font-size: 1.3rem; color: #57B94B; flex-shrink: 0; line-height: 1; }
.bo-faq-item__body { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
.bo-faq-item--open .bo-faq-item__body { max-height: 300px; }
.bo-faq-item__a { padding: 0 1.5rem 1.25rem; font-size: 17px; line-height: 26px; color: var(--color-text-muted); }
.bo-cta { position: relative; padding: 8rem 0; overflow: hidden; background: #06201d url('/images/cta-bg.png') center/cover no-repeat; }
.bo-cta::after { content: ''; position: absolute; inset: 0; background: linear-gradient(102.05deg,rgba(0,55,21,0.88) 30%,rgba(5,54,32,0.2) 100%); z-index: 1; }
.bo-cta .container { position: relative; z-index: 2; }
.bo-cta__inner { display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; max-width: 700px; }
.bo-cta__heading { font-family: var(--font-display); font-size: clamp(2rem,3.5vw,3.2rem); font-weight: 400; color: #fff; line-height: 1.1; letter-spacing: -0.02em; }
.bo-cta__body { font-size: 18px; line-height: 1.75; color: rgba(255,255,255,0.75); }
@media (max-width: 990px) {
  .bo-who__inner { grid-template-columns: 1fr; }
  .bo-who__columns { grid-template-columns: 1fr; gap: 1.5rem; }
  .bo-right__layout { grid-template-columns: 1fr; }
  .bo-commitment__grid { grid-template-columns: 1fr 1fr; }
  .bo-process__inner { grid-template-columns: 1fr; gap: 3rem; }
  .bo-process__photo-wrap { order: -1; max-width: 100%; }
  .bo-testimonial__content { padding: 2.5rem 1.5rem; }
}
@media (max-width: 768px) {
  .bo-faqs__grid { grid-template-columns: 1fr; }
  .bo-cta { padding: 4rem 0; }
  .bo-commitment__grid { grid-template-columns: 1fr; }
}
@media (max-width: 680px) {
  .bo-right__cards { grid-template-columns: 1fr; }
  .bo-commitment__grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 440px) {
  .bo-commitment__grid { grid-template-columns: 1fr; }
}
@media (max-width: 1024px) {
  .bo-hero { min-height: auto; }
  .bo-hero__inner { padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 3.5rem; }
  .bo-who__photo-wrap { aspect-ratio: unset; height: 360px; }
  .bo-who__photo-wrap::before { display: none; }
  .bo-who__columns > div { padding: 2rem 0; }
  .bo-who { padding: 3.5rem 0 3rem; }
  .bo-right__photo-wrap { min-height: unset; height: 360px; order: 2; }
  .bo-right__photo { object-position: center 70%; }
  .bo-right__layout { min-height: auto; grid-template-columns: 1fr; }
  .bo-right__cards { order: 1; }
  .bo-process__photo { aspect-ratio: unset; height: 360px; object-fit: cover; }
  .bo-who__col-title { font-size: 22px; }
  .bo-who__label { font-size: 20px; }
  .bo-right__label { font-size: 20px; }
  .bo-commitment__label { font-size: 20px; }
  .bo-right-card { padding: 1.75rem; }
  .bo-right-card__title { font-size: 22px; }
  .bo-commitment-card__title { font-size: 30px; }
  .bo-commitment { padding: 3.5rem 0; }
  .bo-commitment-card { padding: 2rem 1.75rem; }
  .bo-process { padding: 3rem 0 2.5rem; }
  .bo-process__inner { gap: 2.5rem; }
  .bo-process__photo-wrap::before { display: none; }
  .bo-faqs { padding: 3.5rem 0; }
  .bo-cta { padding: 5rem 0; }
}
@media (max-width: 599px) {
  /* BO hero */
  .bo-hero { min-height: auto; }
  .bo-hero__heading { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .bo-hero__inner { padding-top: calc(var(--nav-height) + 2rem); padding-bottom: 3rem; }
  .bo-hero__body { font-size: 16px; }
  /* BO who */
  .bo-who { padding: 3rem 0 2.5rem; }
  .bo-who__body { font-size: 16px; }
  .bo-who__photo-wrap::before { display: none; }
  .bo-who__columns > div { padding: 1.5rem 0; }
  .bo-who__columns > div:first-child { padding-left: 0; }
  .bo-who__columns > div:not(:last-child) { border-right: none; border-bottom: 1px solid rgba(3,136,57,0.25); }
  /* BO right for you */
  .bo-right { padding: 3rem 0; }
  .bo-right__layout { grid-template-columns: 1fr; min-height: auto; }
  .bo-right__photo-wrap { min-height: 280px; order: 2; }
  .bo-right__cards { grid-template-columns: 1fr; order: 1; }
  .bo-who__col-title { font-size: 26px; }
  .bo-right-card { padding: 1.5rem; min-height: auto; }
  .bo-right-card__title { font-size: 26px; }
  /* BO commitment */
  .bo-commitment-card__title { font-size: 26px; }
  .bo-commitment { padding: 3rem 0; }
  .bo-commitment-card { padding: 2rem 1.5rem; min-height: auto; }
  /* BO process */
  .bo-process { padding: 3rem 0 2rem; }
  .bo-process__photo-wrap::before { display: none; }
  .bo-process__body p { font-size: 16px; }
  /* BO testimonial */
  .bo-testimonial__quote { font-size: 20px; }
  /* BO FAQs */
  .bo-faqs { padding: 3rem 0; }
  .bo-faqs__grid { grid-template-columns: 1fr; }
  .bo-faqs__col:first-child { border-right: none; border-bottom: 1px solid var(--color-border-light); }
  .bo-faq-item__q { font-size: 17px; }
  .bo-faq-item__top { padding: 1rem 1rem; }
  .bo-faq-item__a { padding: 0 1rem 1rem; font-size: 15px; }
  /* BO CTA */
  .bo-cta { padding: 3rem 0; }
  .bo-cta .btn { width: 100%; text-align: center; justify-content: center; }
}

/* ── ABOUT PAGE ── */
.about-page-hero { position: sticky; top: 0; z-index: 0; background: linear-gradient(254deg,#effff2 1.3%,rgba(202,242,209,0.47) 98.7%); min-height: 75vh; display: flex; align-items: center; overflow: hidden; }
.about-page-hero__img { position: absolute; right: 0; bottom: -50px; width: 75%; height: 110%; object-fit: cover; object-position: left top; pointer-events: none; z-index: 0; }
.about-page-hero-shell { position: relative; z-index: 1; padding-top: calc(var(--nav-height) + 4rem); padding-bottom: 5rem; width: 100%; }
.about-page-hero-copy { max-width: 820px; }
.about-page-hero-title { margin: 0 0 1.5rem; font-family: var(--font-display); font-size: 62px; line-height: 1.08; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; white-space: nowrap; }
.about-page-hero-text { max-width: 680px; margin: 0; font-size: 18px; line-height: 1.75; color: var(--color-text-body); }
.about-story-section { padding: 68px 0 88px; background: #ffffff; position: relative; z-index: 1; }
.about-story-shell { display: grid; grid-template-columns: minmax(0,1fr) minmax(420px,560px); align-items: center; gap: 72px; }
.about-story-copy { max-width: 760px; }
.about-story-eyebrow { margin: 0 0 8px; font-family: var(--font-display); font-size: clamp(1.1rem,1.5vw,1.4rem); font-weight: 400; letter-spacing: 0; text-transform: none; color: #417C61; display: block; }
.about-story-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.about-story-line { width: 48px; height: 3px; margin: 20px 0 28px; border-radius: 999px; background: #57B94B; }
.about-story-text { margin: 0 0 24px; max-width: 760px; font-size: 18px; line-height: 1.75; color: rgba(33,79,63,0.82); }
.about-story-visual-wrap { position: relative; }
.about-story-visual-frame { position: absolute; top: 16px; left: 16px; right: -16px; bottom: -16px; border: 1px solid rgba(207,224,202,0.9); z-index: 0; }
.about-story-visual { position: relative; z-index: 1; width: 100%; height: 565px; overflow: hidden; }
.about-story-visual img { width: 100%; height: 100%; object-fit: cover; }
.about-values-section { padding: 74px 0 104px; background: radial-gradient(circle at left bottom,rgba(220,244,216,0.72),transparent 34%), linear-gradient(180deg,#f5fbf3 0%,#eef8eb 100%); position: relative; z-index: 1; }
.about-values-header { margin-bottom: 28px; }
.about-values-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.about-values-divider { height: 1px; margin-bottom: 54px; background: rgba(213,231,212,1); }
.about-values-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; }
.about-value-card { min-height: 320px; padding: 52px 36px 36px; background: rgba(255,255,255,0.94); box-shadow: 0 16px 36px rgba(122,160,135,0.1); }
.about-value-card-title { margin: 0; font-family: var(--font-display); font-size: 32px; line-height: 1.15; font-weight: 400; color: #2d604d; }
.about-value-card-line { width: 44px; height: 3px; margin: 18px 0 24px; border-radius: 999px; background: #57B94B; }
.about-value-card-text { margin: 0; font-size: 18px; line-height: 1.75; color: rgba(45,96,77,0.72); }
.about-leadership-section { padding: 76px 0 56px; background: #ffffff; position: relative; z-index: 1; }
.about-leadership-header { margin-bottom: 28px; }
.about-leadership-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.about-leadership-divider { height: 1px; margin-bottom: 48px; background: rgba(213,231,212,1); }
.leadership-grid { display: grid; gap: 26px; }
.leader-card { display: flex; align-items: center; gap: 40px; padding: 24px; background: rgba(255,255,255,0.96); box-shadow: 0 16px 36px rgba(122,160,135,0.1); }
.leader-card-photo { width: 32%; min-height: 456px; overflow: hidden; background: #032f1a; }
.leader-card-photo img { width: 100%; height: 100%; object-fit: cover; }
.leader-card-copy { max-width: 760px; padding-right: 28px; }
.leader-card-name { margin: 0; font-family: var(--font-display); font-size: 48px; line-height: 1.0; font-weight: 400; letter-spacing: -0.02em; color: #2d604d; }
.leader-card-role { margin: 10px 0 0; font-family: var(--font-body); font-size: 13px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #009444; }
.leader-card-line { width: 44px; height: 3px; margin: 20px 0 24px; border-radius: 999px; background: #57B94B; }
.leader-card-bio { margin: 0; font-size: 18px; line-height: 1.8; color: rgba(45,96,77,0.74); }
.about-talent-section { padding: 60px 0 60px; background: radial-gradient(circle at left bottom,rgba(220,244,216,0.64),transparent 36%), linear-gradient(180deg,#f5fbf3 0%,#eef8eb 100%); position: relative; z-index: 1; }
.about-talent-shell { display: flex; align-items: center; gap: 72px; }
.about-talent-copy { max-width: 760px; padding-left: 24px; }
.about-talent-title { margin: 0; font-family: var(--font-display); font-size: 54px; line-height: 1.05; font-weight: 400; letter-spacing: -0.02em; color: #214f3f; }
.about-talent-line { width: 48px; height: 3px; margin: 20px 0 28px; border-radius: 999px; background: #57B94B; }
.about-talent-text { margin: 0; max-width: 760px; font-size: 18px; line-height: 1.75; color: rgba(45,96,77,0.82); }
.about-talent-visual-wrap { position: relative; }
.about-talent-visual-frame { position: absolute; top: 16px; left: 16px; right: -16px; bottom: -16px; border: 1px solid rgba(207,224,202,0.9); z-index: 0; }
.about-talent-visual { position: relative; z-index: 1; width: 100%; height: 432px; overflow: hidden; margin-bottom: 16px; }
.about-talent-visual img { width: 100%; height: 100%; object-fit: cover; }
.about-cta-section { position: relative; overflow: hidden; background: linear-gradient(90deg,rgba(0,53,18,0.88) 0%,rgba(0,53,18,0.62) 38%,rgba(0,53,18,0.2) 100%), url('/images/letsStartConversation.jpg') center/cover no-repeat; }
.about-cta-overlay { position: absolute; inset: 0; background: radial-gradient(circle at 78% 38%,rgba(140,197,137,0.18),transparent 28%), linear-gradient(180deg,rgba(0,43,17,0.16) 0%,rgba(0,43,17,0.22) 100%); pointer-events: none; }
.about-cta-copy { position: relative; z-index: 1; padding: 8rem 0; display: flex; flex-direction: column; align-items: flex-start; text-align: left; gap: 1.25rem; }
.about-cta-title { margin: 0; max-width: 640px; font-family: var(--font-display); font-size: clamp(2rem,4vw,3.2rem); line-height: 1.15; font-weight: 500; letter-spacing: -0.02em; color: #fff; }
.about-cta-text { margin: 0; max-width: 560px; font-size: 18px; line-height: 1.75; color: rgba(255,255,255,0.75); }
.about-cta-button { display: inline-flex; align-items: center; gap: 16px; margin-top: 0.5rem; padding: 14px 28px; border-radius: 5px; background: #009444; font-family: var(--font-body); font-size: 15px; font-weight: 600; color: #fff; transition: all 0.2s ease; }
.about-cta-button:hover { transform: translateY(-1px); filter: brightness(1.1); }
@media (max-width: 1024px) {
  .about-story-shell { grid-template-columns: 1fr; }
  .about-values-grid { grid-template-columns: 1fr 1fr; }
  .leader-card { flex-direction: column; align-items: flex-start; }
  .leader-card-photo { width: 100%; min-height: 300px; }
  .about-talent-shell { flex-direction: column; }
  .about-talent-copy { margin-top: 0; }
}
@media (max-width: 680px) {
  .about-values-grid { grid-template-columns: 1fr; }
}
@media (max-width: 1024px) {
  .about-page-hero { position: relative; min-height: auto; overflow: hidden; }
  .about-page-hero-title { font-size: clamp(2.4rem, 6vw, 3rem); white-space: normal; }
  .about-page-hero__img { width: 55%; opacity: 0.25; bottom: 0; }
  .about-story-visual-frame { display: none; }
  .about-story-shell { gap: 2.5rem; }
  .about-story-visual { height: 360px; }
  .about-story-section { padding: 48px 0 60px; }
  .about-values-grid { grid-template-columns: 1fr; }
  .about-value-card { padding: 36px 28px 28px; min-height: auto; }
  .about-value-card-title { font-size: 30px; }
  .about-story-eyebrow { font-size: 20px; }
  .about-values-section { padding: 52px 0 72px; }
  .leader-card-photo { min-height: 280px; }
  .leader-card { gap: 28px; padding: 24px 28px 36px; }
  .leader-card-copy { padding: 0 8px; }
  .about-leadership-section { padding: 52px 0 72px; }
  .about-talent-visual-wrap { width: 100%; }
  .about-talent-visual { height: 360px; }
  .about-talent-visual-frame { display: none; }
  .about-talent-shell { gap: 2.5rem; }
  .about-talent-copy { padding-left: 0; }
  .about-cta-copy { padding: 5rem 0; }
}
@media (max-width: 599px) {
  /* About hero */
  .about-page-hero { min-height: auto; }
  .about-page-hero__img { display: none; }
  .about-page-hero-shell { padding-top: calc(var(--nav-height) + 2rem); padding-bottom: 3rem; }
  .about-page-hero-title { font-size: clamp(1.8rem, 8vw, 2.4rem); white-space: normal; }
  .about-page-hero-text { font-size: 16px; }
  /* About story */
  .about-story-section { padding: 3rem 0; }
  .about-story-shell { gap: 1.5rem; }
  .about-story-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .about-story-text { font-size: 16px; margin-bottom: 0; }
  .about-story-visual-frame { display: none; }
  .about-story-visual { height: 300px; }
  /* About values */
  .about-values-section { padding: 3rem 0; }
  .about-values-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .about-value-card { padding: 32px 24px 28px; min-height: auto; }
  .about-value-card-title { font-size: 26px; }
  /* About leadership */
  .about-leadership-section { padding: 3rem 0; }
  .about-leadership-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .leader-card { padding: 16px 16px 32px; gap: 24px; }
  .leader-card-photo { min-height: 240px; }
  .leader-card-copy { padding-right: 0; }
  .leader-card-name { font-size: clamp(1.6rem, 7vw, 2.2rem); }
  .leader-card-bio { font-size: 16px; }
  /* About talent */
  .about-talent-section { padding: 3rem 0; }
  .about-talent-shell { gap: 1.5rem; }
  .about-talent-text { margin-bottom: 0; }
  .about-talent-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .about-talent-copy { padding-left: 0; }
  .about-talent-visual { height: 280px; }
  .about-talent-visual-frame { display: none; }
  .about-talent-text { font-size: 16px; }
  .about-talent-visual-frame { display: none; }
  .about-talent-visual { height: 280px; }
  /* About CTA */
  .about-cta-copy { padding: 4rem 0; }
  .about-cta-title { font-size: clamp(1.6rem, 7vw, 2.2rem); }
  .about-cta-button { width: 100%; text-align: center; justify-content: center; }
}

/* ── CONTACT PAGE ── */
.contact-page { padding: calc(var(--nav-height) + 4rem) 0 72px; background: radial-gradient(circle at top left, rgba(226,242,229,0.95), transparent 38%), linear-gradient(180deg,#f4fbf2 0%,#ecf8ea 100%); }
.contact-shell { display: grid; gap: 34px; }
.contact-page-intro { display: flex; justify-content: space-between; align-items: start; gap: 40px; }
.contact-page-intro > div { width: 50%; }
.contact-page-intro > p { width: 50%; }
.contact-page-title, .contact-form-title, .contact-detail-title { margin: 0; font-family: var(--font-display); font-weight: 400; color: var(--color-green-dark); }
.contact-page-title { font-size: 54px; line-height: 1.05; letter-spacing: -0.02em; }
.contact-page-line { width: 40px; height: 3px; margin-top: 18px; border-radius: 999px; background: #57B94B; }
.contact-page-summary { margin: 6px 0 0; font-size: 18px; line-height: 1.75; text-align: right; color: var(--color-text-body); }
.contact-card { display: grid; grid-template-columns: 420px minmax(0,1fr); gap: 40px; padding: 38px 28px 52px; border: 1px solid rgba(214,228,216,0.9); border-radius: 12px; background: rgba(255,255,255,0.88); box-shadow: 0 18px 40px rgba(108,154,124,0.1); }
.contact-details { padding-right: 28px; border-right: 1px solid rgba(214,228,216,0.9); }
.contact-logo-mark { width: 100%; max-width: 100%; margin: 10px 0 0; }
.contact-detail-block { padding: 28px 0; border-top: 1px solid rgba(220,229,222,1); }
.contact-detail-title { font-size: 24px; line-height: 1; }
.contact-detail-block a, .contact-detail-block p { margin: 22px 0 0; font-size: 0.98rem; line-height: 1.6; color: rgba(68,109,93,0.82); }
.contact-detail-block p + p { margin-top: 4px; }
.contact-form-column { padding: 14px 16px 0 0; }
.contact-form-title { font-size: 58px; line-height: 0.96; }
.contact-form { display: grid; gap: 0; margin-top: 34px; }
.contact-field { display: flex; flex-direction: column; gap: 8px; padding: 16px 0 14px; border-bottom: 1px solid rgba(220,229,222,1); }
.contact-field span:first-child { font-size: 0.95rem; line-height: 1.4; color: rgba(68,109,93,0.78); }
.contact-field input, .contact-field textarea { width: 100%; padding: 0; border: 0; background: transparent; font: inherit; color: #446d5d; outline: none; }
.contact-field textarea { min-height: 80px; resize: vertical; }
.contact-field--error { border-bottom-color: #dc3545 !important; }
.contact-field__error { display: none; font-size: 0.78rem; color: #dc3545; margin-top: 2px; }
.contact-field--error .contact-field__error { display: block; }
.contact-submit { display: inline-flex; align-items: center; gap: 16px; margin-top: 26px; width: fit-content; padding: 14px 28px; border: 1px solid var(--color-green-accent); border-radius: 5px; background: var(--color-green-accent); font-family: var(--font-body); font-size: 15px; font-weight: 500; letter-spacing: 0.02em; color: #fff; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; }
.contact-submit:hover { background: var(--color-green-bright); border-color: var(--color-green-bright); }
.contact-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.contact-server-error { color: #c0392b; font-size: 14px; margin-top: 0.5rem; }
.contact-toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); background: #1a6b3c; color: #fff; padding: 16px 24px; border-radius: 10px; display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 500; box-shadow: 0 8px 32px rgba(0,0,0,0.18); z-index: 9999; animation: toastIn 0.35s ease-out; min-width: 320px; }
.contact-toast__close { background: none; border: none; color: rgba(255,255,255,0.7); font-size: 22px; cursor: pointer; padding: 0 0 0 12px; line-height: 1; }
.contact-toast__close:hover { color: #fff; }
@keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
.ct-success { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 4rem 2rem; text-align: center; }
.ct-success svg { width: 48px; height: 48px; color: var(--color-green-accent); }
.ct-success p { font-size: 17px; font-weight: 500; color: var(--color-green-dark); }
@media (max-width: 1024px) {
  .contact-page-intro { flex-direction: column; }
  .contact-page-intro > div, .contact-page-intro > p { width: 100%; }
  .contact-page-summary { text-align: left; }
  .contact-card { grid-template-columns: 1fr; }
  .contact-details { padding-right: 0; border-right: none; border-bottom: 1px solid rgba(214,228,216,0.9); padding-bottom: 28px; }
}
@media (max-width: 640px) {
  .contact-form-column { padding: 14px 0 0; }
}
@media (max-width: 1024px) {
  .contact-card { padding: 40px 20px 40px; }
  .contact-form-column { padding-right: 0; }
  .contact-logo-mark { display: none; }
  .contact-detail-block:first-of-type { border-top: none; padding-top: 12px; }
}
@media (max-width: 599px) {
  .contact-page { padding: calc(var(--nav-height) + 2rem) 0 3rem; }
  .contact-page-intro { gap: 1rem; }
  .contact-page-line { margin-top: 22px; }
  .contact-page-title { font-size: clamp(1.8rem, 8vw, 2.4rem); }
  .contact-form-title { font-size: clamp(2rem, 9vw, 2.8rem); }
  .contact-card { padding: 24px 16px 24px; gap: 24px; }
  .contact-submit { width: 100%; text-align: center; justify-content: center; }
}

/* ══════════════════════════════════════════
   LARGE / 4K SCREEN SCALING (2560px+)
   ══════════════════════════════════════════ */

@media (min-width: 2200px) {
  html { font-size: 20px; }
  :root {
    --max-width: 2100px;
    --nav-height: 88px;
    --container-px: clamp(2rem, 4vw, 6rem);
  }
  .nav__link { font-size: 17px; }
  .nav__cta { font-size: 17px; }
  .nav__logo-img { height: 32px; }
  .nav__links { gap: 40px; }
  .section-label { font-size: 16px; }
  .btn { font-size: 18px; padding: 18px 34px; }

  /* Home hero */
  .home-hero { background-size: 38% auto; background-position: 88% 80%; height: 100vh; }
  .home-hero__heading { font-size: 82px; }
  .home-hero__body { font-size: 22px; max-width: 900px; }
  .home-hero__copy { max-width: 1000px; }
  .home-stat__value { font-size: clamp(2.2rem, 3vw, 3.2rem); }
  .home-stat__label { font-size: 16px; }

  /* Home services */
  .home-service-card { padding: 3.5rem; min-height: 420px; }
  .home-service-card__title { font-size: clamp(2.4rem, 3.8vw, 3.6rem); }
  .home-service-card__body { font-size: 22px; max-width: 850px; }
  .home-service-card__sublabel { font-size: 16px; }

  /* Home who */
  .home-who__heading { font-size: clamp(2.4rem, 3.5vw, 3.8rem); }
  .home-who__body { font-size: 22px; max-width: 900px; }
  .home-who__top-label { font-size: 38px; }
  .home-who__link { font-size: 18px; padding: 18px 34px; }

  /* Home industries */
  .home-industries__heading { font-size: clamp(2.4rem, 3.5vw, 3.8rem); }
  .home-industries__subtitle { font-size: 22px; }
  .home-industry-card:nth-child(odd) { height: 580px; }
  .home-industry-card:nth-child(even) { height: 540px; }
  .home-industry-card__name { font-size: clamp(1.2rem, 1.5vw, 1.5rem); }

  /* Home CTA */
  .home-cta__heading { font-size: clamp(2.4rem, 4vw, 3.8rem); }
  .home-cta__body { font-size: 22px; max-width: 800px; }
  .home-cta__inner { padding-top: 10rem; padding-bottom: 10rem; }

  /* BO hero */
  .bo-hero__heading { font-size: 78px; }
  .bo-hero__body { font-size: 22px; max-width: 900px; }
  .bo-hero__copy { max-width: 1000px; }

  /* BO who */
  .bo-who__label { font-size: clamp(1.3rem, 1.5vw, 1.6rem); }
  .bo-who__heading { font-size: clamp(2.4rem, 3.5vw, 64px); }
  .bo-who__body { font-size: 22px; max-width: 900px; }
  .bo-who__col-title { font-size: 32px; }
  .bo-who__col-body { font-size: 20px; }
  .bo-who__photo-overlay span { font-size: clamp(1.8rem, 2.5vw, 2.6rem); }

  /* BO right */
  .bo-right__label { font-size: clamp(1.3rem, 1.5vw, 1.6rem); }
  .bo-right__heading { font-size: clamp(2.4rem, 3.5vw, 64px); }
  .bo-right-card__title { font-size: 38px; }
  .bo-right-card__body { font-size: 20px; max-width: 600px; }
  .bo-right__photo-overlay span { font-size: clamp(1.6rem, 2vw, 2.4rem); }

  /* BO commitment */
  .bo-commitment__label { font-size: clamp(1.3rem, 1.5vw, 1.6rem); }
  .bo-commitment__heading { font-size: clamp(2.4rem, 3.5vw, 64px); }
  .bo-commitment-card__title { font-size: 42px; }
  .bo-commitment-card__body { font-size: 22px; max-width: 750px; }
  .bo-commitment-card { padding: 3.5rem 3rem; min-height: 260px; }

  /* BO process */
  .bo-process__heading { font-size: clamp(2.4rem, 3.5vw, 64px); }
  .bo-process__body p { font-size: 22px; max-width: 900px; }

  /* BO testimonial */
  .bo-testimonial__quote { font-size: 32px; }
  .bo-testimonial__attribution { font-size: 18px; }
  .bo-testimonial__content { padding: 4.5rem 6rem; }

  /* BO FAQ */
  .bo-faqs__heading { font-size: clamp(2.4rem, 3.5vw, 64px); }
  .bo-faq-item__q { font-size: 24px; }
  .bo-faq-item__a { font-size: 20px; max-width: 800px; }
  .bo-faq-item__top { padding: 1.5rem 2rem; }

  /* BO CTA */
  .bo-cta__heading { font-size: clamp(2.4rem, 3.5vw, 3.8rem); }
  .bo-cta__body { font-size: 22px; }
  .bo-cta__inner { max-width: 860px; }

  /* Investors hero */
  .investors-hero { min-height: 45vh; }
  .investors-hero-shell { padding-top: calc(var(--nav-height) + 5rem); padding-bottom: 6rem; }
  .investors-hero-title { font-size: 78px; }
  .investors-hero-subtitle { font-size: 50px; }
  .investors-hero-text { font-size: 22px; max-width: 900px; }
  .investors-hero-copy { max-width: 1100px; }

  /* Investors services */
  .investors-services-title { font-size: 66px; }
  .investors-services-subtitle { font-size: 32px; }
  .investors-service-title { font-size: 38px; }
  .investors-service-text { font-size: 20px; }
  .investors-service-image img { height: 280px; }
  .investors-service-body { padding: 44px 30px 52px; }

  /* Investors approach */
  .investors-approach-title { font-size: 66px; }
  .investors-approach-shell { grid-template-columns: minmax(0,1fr) minmax(400px,580px); }
  .investors-approach-copy { max-width: 1100px; }
  .investors-approach-text { font-size: 22px; max-width: 900px; }
  .investors-approach-visual-text { font-size: 34px; }

  /* Investors advantages */
  .investors-advantages-title { font-size: 66px; }
  .investors-advantages-eyebrow { font-size: 30px; }
  .investors-advantages-layout { grid-template-columns: 460px minmax(0,1fr); }
  .investors-advantages-grid { gap: 22px; }
  .investors-advantage-title { font-size: 38px; }
  .investors-advantage-text { font-size: 20px; max-width: 600px; }
  .investors-advantage-card { min-height: 320px; padding: 48px 34px 44px; }

  /* Investors verticals */
  .investors-verticals-title { font-size: 66px; }
  .investors-verticals-header { max-width: 1200px; }
  .investors-verticals-text { font-size: 22px; max-width: 900px; }
  .investors-vertical-card span:first-child { font-size: 23px; }
  .investors-vertical-card { min-height: 84px; padding: 18px 22px; }

  /* Investors CTA */
  .investors-cta-title { font-size: clamp(2.4rem, 4vw, 3.8rem); }
  .investors-cta-text { font-size: 22px; max-width: 700px; }

  /* About hero */
  .about-page-hero-title { font-size: 78px; }
  .about-page-hero-text { font-size: 22px; max-width: 900px; }
  .about-page-hero-copy { max-width: 1100px; }

  /* About story */
  .about-story-title { font-size: 66px; }
  .about-story-shell { grid-template-columns: minmax(0,1fr) minmax(420px,640px); }
  .about-story-copy { max-width: 850px; }
  .about-story-text { font-size: 22px; max-width: 850px; }
  .about-story-eyebrow { font-size: clamp(1.3rem, 1.5vw, 1.6rem); }

  /* About values */
  .about-values-title { font-size: 66px; }
  .about-value-card-title { font-size: 38px; }
  .about-value-card-text { font-size: 22px; max-width: 600px; }
  .about-value-card { min-height: 380px; padding: 60px 44px 44px; }

  /* About leadership */
  .about-leadership-title { font-size: 66px; }
  .leader-card-name { font-size: 56px; }
  .leader-card-bio { font-size: 22px; }
  .leader-card-role { font-size: 15px; }

  /* About talent */
  .about-talent-title { font-size: 66px; }
  .about-talent-copy { max-width: 900px; }
  .about-talent-text { font-size: 22px; max-width: 900px; }

  /* About CTA */
  .about-cta-title { font-size: clamp(2.4rem, 4vw, 3.8rem); }
  .about-cta-text { font-size: 22px; max-width: 700px; }

  /* Contact */
  .contact-page-title { font-size: 66px; }
  .contact-page-summary { font-size: 22px; }
  .contact-form-title { font-size: 72px; }
  .contact-detail-title { font-size: 30px; }

  /* Footer */
  .footer__logo-img { height: 36px; }
  .footer__nav-link { font-size: 16px; }
  .footer__legal { font-size: 13px; }

  /* Drawer */
  .vertical-drawer { width: 560px; padding: 60px 48px 72px; }
  .vertical-drawer__title { font-size: 38px; }
  .vertical-drawer__list li { font-size: 24px; }
}

/* ── 4K SCREENS (3200px+) ── */
@media (min-width: 3200px) {
  html { font-size: 20px; }
  :root {
    --max-width: 2600px;
    --nav-height: 96px;
    --container-px: clamp(3rem, 3.5vw, 6rem);
  }

  /* Nav */
  .nav__link { font-size: 22px; }
  .nav__cta { font-size: 22px; }
  .nav__logo-img { height: 42px; }
  .nav__links { gap: 56px; }
  .section-label { font-size: 19px; }
  .btn { font-size: 23px; padding: 24px 44px; }

  /* ─── HOME PAGE ─── */

  /* Home hero */
  .home-hero { background-size: 38% auto; background-position: 85% 80%; height: 100vh; }
  .home-hero__heading { font-size: 116px; }
  .home-hero__body { font-size: 24px; max-width: 1500px; margin-top: 36px; line-height: 1.8; }
  .home-hero__copy { max-width: 1800px; min-height: 380px; }
  .home-hero__ctas { margin-top: 52px; gap: 18px; }
  .home-stat__value { font-size: clamp(3rem, 3.5vw, 4.2rem); }
  .home-stat__label { font-size: 20px; letter-spacing: 0.12em; }
  .home-stats-bar { padding: 0 0 3rem; }
  .home-stats-bar__inner { padding-top: 2.5rem; }
  .home-stat { padding: 2.5rem 3rem; gap: 10px; }

  /* Home services */
  .home-services { padding: 9rem 0; }
  .home-services__grid { gap: 2.5rem; }
  .home-service-card { padding: 5.5rem 5rem; min-height: 620px; }
  .home-service-card__title { font-size: clamp(3.2rem, 4vw, 5rem); }
  .home-service-card__body { font-size: 24px; line-height: 1.8; max-width: 1100px; }
  .home-service-card__sublabel { font-size: 17px; }
  .home-service-card__link { font-size: 1.1rem; }
  .home-service-card__divider { width: 100%; height: 1px; margin: 1.5rem 0; }

  /* Home who */
  .home-who { padding: 9rem 0; }
  .home-who__inner { gap: 6rem; }
  .home-who__heading { font-size: clamp(3.2rem, 3.5vw, 5rem); }
  .home-who__body { font-size: 24px; line-height: 1.8; max-width: 1200px; }
  .home-who__top-label { font-size: 48px; }
  .home-who__link { font-size: 20px; padding: 22px 42px; }
  .home-who__accent { width: 50px; height: 4px; }
  .home-who__photo-frame::after { top: -28px; left: 28px; right: -28px; bottom: 28px; }
  .home-who__photo-wrap { height: 720px; aspect-ratio: unset; }
  .home-who__photo-overlay { padding: 2.5rem 2.5rem 3rem; }
  .home-who__photo-overlay span { font-size: clamp(1.8rem, 2.5vw, 2.8rem); }

  /* Home industries */
  .home-industries { padding: 9rem 0 8rem; }
  .home-industries__header { margin-bottom: 4rem; }
  .home-industries__heading { font-size: clamp(3.2rem, 3.5vw, 5rem); }
  .home-industries__subtitle { font-size: 24px; }
  .home-industries__track { gap: 2rem; }
  .home-industry-card:nth-child(odd) { height: 780px; }
  .home-industry-card:nth-child(even) { height: 720px; }
  .home-industry-card__name { font-size: clamp(1.5rem, 1.6vw, 2rem); }

  /* Home CTA */
  .home-cta__heading { font-size: clamp(3.2rem, 4vw, 5rem); max-width: 1400px; }
  .home-cta__body { font-size: 24px; max-width: 1200px; }
  .home-cta__inner { padding-top: 12rem; padding-bottom: 12rem; }

  /* ─── BUSINESS OWNERS PAGE ─── */

  /* BO hero */
  .bo-hero { min-height: 45vh; }
  .bo-hero__inner { padding-top: calc(var(--nav-height) + 4rem); padding-bottom: 5rem; gap: 5rem; }
  .bo-hero__heading { font-size: 116px; }
  .bo-hero__body { font-size: 24px; max-width: 1400px; line-height: 1.8; }
  .bo-hero__copy { max-width: 1800px; }

  /* BO who */
  .bo-who { padding: 9rem 0 8rem; }
  .bo-who__inner { gap: 6rem; }
  .bo-who__label { font-size: clamp(1.5rem, 1.6vw, 1.9rem); }
  .bo-who__heading { font-size: clamp(3.2rem, 3.5vw, 82px); }
  .bo-who__heading::after { height: 4px; width: 3.5rem; }
  .bo-who__body { font-size: 24px; line-height: 1.8; max-width: 1200px; }
  .bo-who__col-title { font-size: 44px; padding-bottom: 32px; }
  .bo-who__col-title::after { height: 4px; }
  .bo-who__col-body { font-size: 22px; line-height: 1.8; max-width: 800px; }
  .bo-who__columns { gap: 4rem; }
  .bo-who__columns > div { padding: 4rem 3.5rem; }
  .bo-who__photo-wrap { height: 720px; aspect-ratio: unset; }
  .bo-who__photo-wrap::before { top: -2rem; left: -2rem; }
  .bo-who__photo-overlay { padding: 2.5rem; }
  .bo-who__photo-overlay span { font-size: clamp(2rem, 2.5vw, 3rem); }

  /* BO right */
  .bo-right { padding: 9rem 0; }
  .bo-right__label { font-size: clamp(1.5rem, 1.6vw, 1.9rem); }
  .bo-right__heading { font-size: clamp(3.2rem, 3.5vw, 82px); }
  .bo-right__layout { grid-template-columns: 0.5fr 1fr; gap: 3rem; min-height: 720px; }
  .bo-right__photo-wrap { min-height: 720px; }
  .bo-right__photo-overlay span { font-size: clamp(1.8rem, 2.2vw, 2.8rem); }
  .bo-right-card { padding: 4.5rem; min-height: 340px; }
  .bo-right-card__title { font-size: 48px; line-height: 1.15; }
  .bo-right-card__body { font-size: 22px; line-height: 1.8; max-width: 700px; }
  .bo-right__cards { gap: 2.5rem; }

  /* BO commitment */
  .bo-commitment { padding: 9rem 0; }
  .bo-commitment__label { font-size: clamp(1.5rem, 1.6vw, 1.9rem); }
  .bo-commitment__heading { font-size: clamp(3.2rem, 3.5vw, 82px); }
  .bo-commitment__heading::after { height: 4px; }
  .bo-commitment__header { margin-bottom: 4rem; }
  .bo-commitment__grid { gap: 2.5rem; }
  .bo-commitment-card { padding: 4.5rem 4rem; min-height: 400px; }
  .bo-commitment-card__title { font-size: 50px; }
  .bo-commitment-card__body { font-size: 24px; line-height: 1.8; max-width: 1100px; }

  /* BO process */
  .bo-process { padding: 9rem 0 5rem; }
  .bo-process__inner { gap: 5rem; }
  .bo-process__heading { font-size: clamp(3.2rem, 3.5vw, 82px); }
  .bo-process__heading::after { height: 4px; }
  .bo-process__body p { font-size: 24px; line-height: 1.8; max-width: 1200px; }
  .bo-process__cta { font-size: 1rem; }
  .bo-process__photo-wrap::before { top: -2rem; left: -2rem; }

  /* BO testimonial */
  .bo-testimonial { padding: 0 0 6rem; }
  .bo-testimonial__content { padding: 6rem 8rem; max-width: 100%; }
  .bo-testimonial__quote { font-size: 36px; max-width: 80rem; }
  .bo-testimonial__quote-icon { font-size: 5rem; }
  .bo-testimonial__attribution { font-size: 20px; }
  .bo-testimonial__divider { margin: 2.5rem 0; }
  .bo-testimonial__dots { gap: 12px; }
  .bo-testimonial__nav { gap: 2rem; }
  .bo-testimonial__arrow--prev { font-size: 1.5rem; }
  .bo-testimonial__arrow--next { font-size: 2.5rem; }
  .bo-testimonial__dot { width: 10px; height: 10px; }

  /* BO FAQ */
  .bo-faqs { padding: 9rem 0; }
  .bo-faqs__heading { font-size: clamp(3.2rem, 3.5vw, 82px); }
  .bo-faqs__heading::after { height: 4px; }
  .bo-faq-item__q { font-size: 26px; }
  .bo-faq-item__a { font-size: 22px; padding: 0 2rem 1.5rem; max-width: 1000px; }
  .bo-faq-item__top { padding: 2rem 2.5rem; }
  .bo-faq-item__icon { font-size: 1.6rem; }
  .bo-faq-item--open .bo-faq-item__body { max-height: 500px; }

  /* BO CTA */
  .bo-cta { padding: 10rem 0; }
  .bo-cta__heading { font-size: clamp(3.2rem, 3.5vw, 5rem); }
  .bo-cta__body { font-size: 24px; max-width: 1200px; }
  .bo-cta__inner { max-width: 1600px; gap: 2rem; }

  /* ─── INVESTORS PAGE ─── */

  /* Investors hero */
  .investors-hero { min-height: 45vh; }
  .investors-hero-shell { padding-top: calc(var(--nav-height) + 5rem); padding-bottom: 6rem; }
  .investors-hero-title { font-size: 100px; }
  .investors-hero-subtitle { font-size: 60px; }
  .investors-hero-text { font-size: 22px; max-width: 1400px; margin-top: 36px; line-height: 1.8; }
  .investors-hero-copy { max-width: 1800px; }

  /* Investors what we do */
  .investors-services-section { padding: 120px 0 160px; }
  .investors-services-header { margin-bottom: 56px; }
  .investors-services-title { font-size: 80px; }
  .investors-services-subtitle { font-size: 36px; }
  .investors-services-grid { gap: 36px; }
  .investors-service-title { font-size: 42px; }
  .investors-service-text { font-size: 22px; line-height: 1.8; max-width: 800px; }
  .investors-service-image img { height: 500px; object-fit: cover; }
  .investors-service-body { padding: 72px 48px 84px; }
  .investors-service-line { width: 54px; height: 4px; }

  /* Investors approach */
  .investors-approach-section { padding: 120px 0 140px; }
  .investors-approach-shell { gap: 60px; grid-template-columns: minmax(0,1fr) minmax(600px,900px); }
  .investors-approach-title { font-size: 80px; }
  .investors-approach-copy { max-width: 1400px; }
  .investors-approach-text { font-size: 22px; line-height: 1.8; max-width: 1200px; }
  .investors-approach-line { width: 56px; height: 4px; }
  .investors-approach-link { font-size: 17px; margin-top: 60px; }
  .investors-approach-visual { min-height: 700px; }
  .investors-approach-visual-text { font-size: 38px; top: 32px; left: 32px; }

  /* Investors advantages */
  .investors-advantages-section { padding: 120px 0 160px; }
  .investors-advantages-title { font-size: 80px; }
  .investors-advantages-eyebrow { font-size: 34px; }
  .investors-advantages-layout { grid-template-columns: 680px minmax(0,1fr); gap: 32px; }
  .investors-advantages-grid { gap: 28px; }
  .investors-advantage-title { font-size: 42px; }
  .investors-advantage-text { font-size: 22px; line-height: 1.8; max-width: 700px; }
  .investors-advantage-card { min-height: 440px; padding: 72px 56px 68px; }
  .investors-advantages-visual { min-height: 820px; }
  .investors-advantages-visual-caption p { font-size: 36px; }

  /* Investors verticals */
  .investors-verticals-section { padding: 120px 0 160px; }
  .investors-verticals-header { margin-bottom: 60px; max-width: 1600px; }
  .investors-verticals-title { font-size: 80px; }
  .investors-verticals-text { font-size: 22px; line-height: 1.8; max-width: 1400px; }
  .investors-verticals-line { width: 56px; height: 4px; }
  .investors-verticals-grid { gap: 22px 28px; }
  .investors-vertical-card span:first-child { font-size: 26px; }
  .investors-vertical-card { min-height: 110px; padding: 28px 34px; }

  /* Investors CTA */
  .investors-cta-title { font-size: clamp(3.2rem, 4vw, 5rem); max-width: 1200px; }
  .investors-cta-text { font-size: 22px; max-width: 1100px; }
  .investors-cta-copy { padding: 12rem 0; }
  .investors-cta-button { font-size: 18px; padding: 20px 38px; }

  /* ─── ABOUT PAGE ─── */

  /* About hero */
  .about-page-hero { min-height: 45vh; }
  .about-page-hero-shell { padding-top: calc(var(--nav-height) + 5rem); padding-bottom: 6rem; }
  .about-page-hero-title { font-size: 100px; }
  .about-page-hero-text { font-size: 22px; max-width: 1400px; line-height: 1.8; }
  .about-page-hero-copy { max-width: 1800px; }

  /* About story */
  .about-story-section { padding: 120px 0 140px; }
  .about-story-shell { gap: 60px; grid-template-columns: minmax(0,1fr) minmax(650px,950px); }
  .about-story-eyebrow { font-size: clamp(1.5rem, 1.6vw, 1.9rem); }
  .about-story-title { font-size: 76px; }
  .about-story-copy { max-width: 1400px; }
  .about-story-text { font-size: 22px; line-height: 1.8; max-width: 1200px; }
  .about-story-line { width: 56px; height: 4px; }
  .about-story-visual { height: 740px; min-width: 500px; }

  /* About values */
  .about-values-section { padding: 120px 0 160px; }
  .about-values-title { font-size: 76px; }
  .about-values-grid { gap: 40px; }
  .about-values-divider { margin-bottom: 72px; }
  .about-value-card { min-height: 500px; padding: 72px 52px 52px; display: flex; flex-direction: column; justify-content: center; }
  .about-value-card-title { font-size: 42px; }
  .about-value-card-text { font-size: 22px; line-height: 1.8; max-width: 800px; }
  .about-value-card-line { width: 52px; height: 4px; }

  /* About leadership */
  .about-leadership-section { padding: 120px 0 160px; }
  .about-leadership-title { font-size: 76px; }
  .about-leadership-divider { margin-bottom: 64px; }
  .leadership-grid { gap: 48px; }
  .leader-card { gap: 60px; padding: 0; padding-right: 56px; align-items: stretch; }
  .leader-card-photo { width: 40%; min-height: 560px; align-self: stretch; flex-shrink: 0; }
  .leader-card-name { font-size: 60px; }
  .leader-card-bio { font-size: 22px; line-height: 1.85; }
  .leader-card-role { font-size: 16px; }
  .leader-card-line { width: 52px; height: 4px; }
  .leader-card-copy { max-width: none; padding-right: 48px; display: flex; flex-direction: column; justify-content: center; }

  /* About talent */
  .about-talent-section { padding: 120px 0 140px; }
  .about-talent-shell { gap: 80px; }
  .about-talent-title { font-size: 76px; }
  .about-talent-copy { max-width: 1400px; }
  .about-talent-text { font-size: 22px; line-height: 1.8; max-width: 1200px; }
  .about-talent-line { width: 56px; height: 4px; }
  .about-talent-visual { height: 680px; min-width: 700px; }

  /* About CTA */
  .about-cta-title { font-size: clamp(3.2rem, 4vw, 5rem); max-width: 1200px; }
  .about-cta-text { font-size: 22px; max-width: 1100px; }
  .about-cta-copy { padding: 12rem 0; }
  .about-cta-button { font-size: 18px; padding: 20px 38px; }

  /* ─── CONTACT PAGE ─── */
  .contact-page { padding: calc(var(--nav-height) + 7rem) 0 140px; }
  .contact-shell { gap: 56px; }
  .contact-page-intro { gap: 60px; }
  .contact-page-title { font-size: 76px; }
  .contact-page-summary { font-size: 22px; line-height: 1.8; max-width: 1400px; }
  .contact-page-line { width: 48px; height: 4px; margin-top: 24px; }
  .contact-card { grid-template-columns: 1fr 1.4fr; gap: 80px; padding: 72px 64px 96px; border-radius: 16px; box-shadow: 0 24px 56px rgba(108,154,124,0.12); }
  .contact-details { padding-right: 48px; }
  .contact-logo-mark { margin: 16px 0 0; max-width: 80%; }
  .contact-form-column { padding: 20px 24px 0 0; }
  .contact-form-title { font-size: 88px; }
  .contact-form { margin-top: 48px; max-width: 1200px; }
  .contact-detail-title { font-size: 34px; }
  .contact-detail-block { padding: 40px 0; }
  .contact-detail-block a, .contact-detail-block p { font-size: 1.15rem; margin-top: 26px; }
  .contact-field { padding: 24px 0 22px; }
  .contact-field span:first-child { font-size: 1.15rem; }
  .contact-field input, .contact-field textarea { font-size: 1.15rem; }
  .contact-field textarea { min-height: 130px; }
  .contact-submit { font-size: 20px; padding: 22px 42px; margin-top: 40px; }

  /* ─── FOOTER ─── */
  .footer__logo-img { height: 38px; }
  .footer__nav-link { font-size: 19px; }
  .footer__nav ul { gap: 1.25rem 4rem; }
  .footer__legal { font-size: 15px; line-height: 1.8; }
  .footer { padding-bottom: 4rem; }
  .footer__top { padding: 3.5rem 0; }
  .footer__divider { margin-bottom: 2.5rem; }

  /* ─── DRAWER ─── */
  .vertical-drawer { width: 780px; padding: 76px 56px 88px; }
  .vertical-drawer__close { font-size: 20px; top: 30px; right: 34px; }
  .vertical-drawer__title { font-size: 42px; }
  .vertical-drawer__eyebrow { font-size: clamp(1.5rem, 1.6vw, 1.9rem); }
  .vertical-drawer__divider { margin-bottom: 40px; }
  .vertical-drawer__list li { font-size: 26px; padding: 18px 0; }
  .vertical-drawer__nav-prev { font-size: 2.5rem; }
  .vertical-drawer__nav-next { font-size: 2.5rem; }
}
`;

// ============================================================
// ALL CONTENT
// ============================================================
const NAV_DATA = {
  logoLight: '/images/logo.svg',
  links: [
    { label: 'For Business Owners', to: '/business-owners' },
    { label: 'For Private Equity', to: '/investors' },
    { label: 'About Us', to: '/about' },
    { label: 'Get In Touch', to: '/contact', cta: true },
  ],
};

const FOOTER_DATA = {
  logo: '/images/logo-footer.svg',
  links: [
    { label: 'For Business Owners', to: '/business-owners' },
    { label: 'For Private Equity', to: '/investors' },
    { label: 'About Us', to: '/about' },
    { label: 'Get In Touch', to: '/contact' },
  ],
  legal: '© 2026 Newflow Partners, LLC. All Rights Reserved.',
  services: 'Private Equity Advisory | Closely-Held Company Advisory',
  finalis: 'Securities are offered through Finalis Securities LLC Member FINRA / SIPC. Newflow Partners, LLC is not a registered broker-dealer, and Finalis Securities LLC and Newflow Partners, LLC are separate, unaffiliated entities. Finalis Securities LLC, Office of Supervisory Jurisdiction is located at 450 Lexington Ave, New York, NY 10017, 800-962-0418.',
  finalisLinks: [
    { label: 'Finalis Privacy Policy', url: 'https://www.finalis.com/privacy-policy/' },
    { label: 'Finalis Business Continuity Plan', url: 'https://www.finalis.com/business-continuity-plan/' },
    { label: 'FINRA BrokerCheck', url: 'https://brokercheck.finra.org/' },
    { label: 'Finalis Form Customer Relationship Summary ("Form CRS")', url: 'https://www.finalis.com/form-crs/' },
  ],
  disclaimer: 'NewflowPartners.com (the Newflow Partners, LLC website) is a website operated by Newflow Partners, LLC. This website is for informational purposes only, is not an offer, solicitation, recommendation, or commitment for any transaction, and is not investment advice.',
};

const HOME_DATA = {
  hero: {
    heading1: 'Your Business Deserves',
    heading2: 'The Right Partner',
    body1: 'We help exceptional business owners navigate private equity partnerships and help leading investors find their next great opportunity.',
    body2: 'Founded by former private equity investors and entrepreneurs, Newflow Partners provides trusted advisory services at no cost to business owners.',
    ctas: [
      { label: 'For Business Owners', to: '/business-owners' },
      { label: 'For Private Equity', to: '/investors' },
    ],
    image: '/images/heroImg.png',
  },
  stats: [
    { value: '$3B+', label: 'PROPRIETARY DEALS SOURCED' },
    { value: '20+', label: 'DEDICATED PROFESSIONALS' },
    { value: '95%+', label: 'CLIENT RETENTION RATE' },
  ],
  services: {
    label: 'Our Company',
    cards: [
      {
        title: 'For Business Owners',
        sublabel: 'EXPLORING YOUR OPTIONS?',
        body: "Whether you're considering a sale, strategic partnership, or are simply curious about what your business could be worth, we can help. Our advisory services are completely free to business owners, and every conversation is confidential.",
        body2: "We've helped thousands of business owners navigate the private equity landscape, and would welcome the opportunity to do the same for you.",
        link: 'LEARN ABOUT HOW WE HELP BUSINESS OWNERS →',
        to: '/business-owners',
      },
      {
        title: 'For Private Equity',
        sublabel: 'PROPRIETARY DEALS FOR PRIVATE EQUITY',
        body: 'We source high-quality, proprietary investment opportunities for private equity firms and their portfolio companies. Founded by former PE deal professionals, we operate as an extension of your deal team from thesis refinement through close.',
        link: 'LEARN ABOUT OUR PE ADVISORY →',
        to: '/investors',
      },
    ],
  },
  whoWeAre: {
    label: 'OUR COMPANY',
    heading: 'Who We Are',
    body: "Newflow Partners was founded by former private equity investors and entrepreneurs who saw a better way to connect great businesses with great partners. We've been on both sides of the table — as investors evaluating hundreds of companies, and as founders building businesses of our own. That experience shapes everything we do.",
    body2: "We believe the best transactions happen when both sides find the right fit. That's why we focus on quality over quantity, building relationships based on trust, transparency, and a deep understanding of what matters to the people we work with.",
    teamLink: 'Meet Our Team →',
    photo: '/images/who-we-are.jpg',
    photoOverlay: 'Connecting Great Businesses With Great Partners',
  },
  industries: {
    heading: 'Industries We Serve',
    subtitle: 'Deep experience sourcing and advising across a range of industries',
    cards: [
      { name: 'Business', name2: 'Services', image: '/images/industry-business-services.jpg' },
      { name: 'Industrials &', name2: 'Manufacturing', image: '/images/industry-industrials.jpg' },
      { name: 'Healthcare', name2: 'Services', image: '/images/industry-healthcare.jpg' },
      { name: 'Technology &', name2: 'Software', image: '/images/industry-software.jpg' },
      { name: 'Aerospace &', name2: 'Defense', image: '/images/industry-aerospace.jpg' },
      { name: 'Consumer &', name2: 'Retail', image: '/images/industry-consumer.jpg' },
      { name: 'Infrastructure', name2: 'Services', image: '/images/industry-infrastructure.jpg' },
      { name: 'Residential &', name2: 'Commercial Services', image: '/images/industry-residential.jpg' },
      { name: 'Financial', name2: 'Services', image: '/images/industry-financial.jpg' },
      { name: 'Education &', name2: 'Training', image: '/images/industry-education.jpg' },
      { name: 'Distribution &', name2: 'Logistics', image: '/images/industry-logistics.jpg' },
      { name: 'Energy &', name2: 'Environmental', image: '/images/industry-energy.jpg' },
    ],
  },
  cta: {
    heading: "Let's Start A Conversation",
    body: "Whether you're a business owner exploring your options or a private equity firm seeking your next opportunity, we'd welcome the chance to connect.",
    button: 'Get In Touch →',
    to: '/contact',
    bgImage: '/images/cta-bg.png',
  },
};

const INVESTORS_DATA = {
  hero: {
    heading1: 'Deal Sourcing For Private Equity,',
    heading2: 'By Former Private Equity Professionals',
    body: "We've built our reputation sourcing high-quality, proprietary investment opportunities for leading private equity firms and their portfolio companies.",
  },
  whatWeDo: {
    heading: 'What We Do',
    subtitle: 'Comprehensive deal sourcing from thesis to close',
    cards: [
      { title: 'Platform Investments', body: "We identify and engage exceptional businesses that align with your investment thesis, creating proprietary opportunities you won't find through your existing channels.", image: '/images/platform-investments.png?v=2' },
      { title: 'Add-On Acquisitions', body: 'For portfolio companies pursuing buy-and-build strategies, we provide systematic, highly targeted outreach to accelerate your acquisition pipeline and execute your growth plans.', image: '/images/addon-acquisitions.png?v=2' },
      { title: 'Market Mapping', body: 'Before committing to a strategy, we assess the viability of the opportunity, mapping the full competitive landscape and validating the pool of actionable targets.', image: '/images/market-mapping.png?v=2' },
    ],
  },
  approach: {
    heading: 'Our Approach',
    body: "We operate as an extension of your deal team. That means we're with you at every stage from understanding your thesis to facilitating the final close.",
    link: 'ACCELERATE YOUR PIPELINE →',
    to: '/contact',
    photo: '/images/OurApproach.jpg',
    photoOverlay: 'Deal Sourcing With Precision',
  },
  whyNewflow: {
    label: 'WHY NEWFLOW?',
    heading: 'What Sets Us Apart',
    curatedTitle: 'Curated Opportunities',
    curatedImage: '/images/WhatSetsUsApart.jpg',
    features: [
      { title: 'Exceptional Talent', body: 'Unlike traditional buyside firms, we are former private equity investors. We understand how you evaluate deals, what matters in diligence, and how to position opportunities effectively.' },
      { title: 'Quality Over Quantity', body: 'Our relentless focus on quality and thoughtfulness enables us to unlock deals where others have failed. Every introduction we make has been thoroughly researched and vetted.' },
      { title: 'True Partnership', body: 'We act as an extension of your deal team understanding your strategy learning your process and adapting our approach as your priorities evolve.' },
      { title: 'Proven Track Record', body: 'Our clients include a significant portion of the largest global mega-cap private equity firms and many across the lower and middle-market.' },
    ],
  },
  industries: {
    heading: 'Deep expertise across industry verticals',
    body: 'We pride ourselves on thorough research and diligence for business owners and businesses we work with both through our firm and across our industry verticals.',
    list: ['Business Services', 'Industrials & Manufacturing', 'Healthcare Services', 'Technology & Software', 'Aerospace & Defense', 'Consumer & Retail', 'Infrastructure Services', 'Residential & Commercial Services', 'Financial Services', 'Education & Training', 'Distribution & Logistics', 'Energy & Environmental'],
  },
  cta: {
    heading: 'Ready to significantly accelerate your proprietary deal pipeline?',
    body: "The best PE deal teams are already leveraging Newflow Partners. We'd welcome the opportunity to learn about your investment strategy and explore how we can work together.",
    button: 'Get In Touch →',
    to: '/contact',
  },
};

const BUSINESS_OWNERS_DATA = {
  hero: {
    heading: 'A Trusted Guide To Navigate Private Equity',
    body: "When it's time to consider a sale or partnership, you deserve a guide who truly understands what you've built and can help you navigate one of the most important decisions of your life.",
  },
  whoWeAre: {
    label: 'Who We Are',
    heading: 'Rooted in Family Business',
    body: "Newflow Partners is a family business, founded by former private equity investment professionals and entrepreneurs. We know what it means to build something from the ground up — and we know that when the time comes to consider a partnership, price is only part of the equation.",
    body2Extra: "The business owners we work with care deeply about their people, their culture, and the legacy they've spent years building. They want to find a partner who shares their values — one who will invest in their team, respect what they've built, and carry it forward the right way.",
    bodyHighlight: "That's what we help you find. Not just a buyer. The right partner.",
    photo: '/images/businessOwners/img1.png',
    photoOverlay: 'Guidance, Refined',
    columns: [
      { title: "We're On Your Team", body: "Unlike investment banks, we don't charge sellers a fee. We're compensated solely by the buyer, meaning our services are completely free to you." },
      { title: 'Our Incentives Are Aligned', body: 'Our fee is directly tied to the valuation of your business. The greater the price we help you achieve, the higher our compensation.' },
      { title: 'We Understand the Landscape', body: "As former private equity investors, we help you understand which firms are the right size, which have the right strategy, and which partners will be good stewards of what you've built." },
    ],
  },
  rightForYou: {
    label: 'Is This Right For You?',
    heading: 'Business owners work with us when…',
    photo: '/images/boRightPhoto.png',
    photoOverlay: 'Clarity At Every Stage',
    cards: [
      { title: 'Retirement / Succession Planning', body: "After decades of building your business, you're thinking about the next chapter. We can help you find a partner who will honor your legacy and take care of your team." },
      { title: 'Accelerating Growth', body: 'Your business is at an inflection point and you need capital and resources to reach the next level. We connect you with firms that have the expertise to help you scale.' },
      { title: 'Partial Exit', body: 'You\'ve built significant value and want to take some chips off the table while continuing to lead the business.' },
      { title: 'Exploring Your Valuation & Options', body: "There's no pressure to transact. Many business owners simply want to understand their options and business valuation. We can have a confidential conversation with zero obligation." },
    ],
  },
  commitment: {
    label: 'What Can You Expect',
    heading: 'Our Commitment to Every Business Owner',
    cards: [
      { title: '100% Free To You', body: 'We are compensated entirely by the buyer. You will never receive a bill from Newflow Partners for our advisory services.' },
      { title: 'Complete Confidentiality', body: 'Everything we discuss remains confidential unless you explicitly authorize us to share information with potential partners.' },
      { title: 'No Obligation', body: 'Talking to us doesn\'t commit you to anything. Many business owners engage with us simply to better understand their options and the market landscape.' },
      { title: 'Transparent Process', body: "We'll walk you through every step, from initial conversations to due diligence, negotiations, and closing, so you feel informed and confident throughout." },
    ],
  },
  process: {
    heading: 'Your Goals Drive The Process',
    body: [
      'Every business owner has different priorities such as valuation, legacy, continued involvement, employee care, and transition timeline. We listen to what matters most to you and work to find partners who align with those priorities.',
      'We take a thoughtful, tailored approach to ensure the outcome reflects both your financial goals and personal vision. The result is a process that feels clear, aligned, and built for long term success.'
    ],
    cta: { label: 'Start a conversation', to: '/contact' },
    photo: '/images/businessOwners/img3.png',
  },
  testimonials: [
    {
      quote: "I had been getting calls from private equity firms for years but never knew which ones to take seriously. Newflow helped me understand the landscape and introduced me to a partner that turned out to be the perfect fit. They were patient, knowledgeable, and always put my interests first.",
      attribution: 'Former Business Owner · Commercial Services',
    },
    {
      quote: "What I appreciated most about working with Newflow was their transparency. They never pressured me, answered every question I had, and made sure I understood exactly what to expect at each stage. When we finally closed the deal, I felt completely confident in my decision.",
      attribution: 'Former Business Owner · Business Services',
    },
  ],
  faqs: {
    heading: 'Frequently asked questions',
    items: [
      { q: "Why don't you charge sellers a fee?", a: "We're compensated by the buyer, the private equity firm or their portfolio company, for sourcing and facilitating the introduction. This allows us to provide completely free advisory services to business owners while maintaining our role as a trusted intermediary." },
      { q: 'How is this different from hiring an investment banker?', a: "Traditional investment bankers run broad auction processes and charge sellers a percentage of the transaction value, which can be extremely disruptive and costly. We work only with private equity buyers who have already expressed specific interest in your business, at no charge to you. Our approach is more targeted and relationship-focused." },
      { q: "What if I don't want to sell?", a: "That's perfectly fine. Many business owners simply want to understand their options or keep a pulse on the market. There's no obligation to move forward with any transaction." },
      { q: 'How do you maintain confidentiality?', a: "We only share information about your business after you've explicitly authorized us to do so. All initial conversations are confidential, and we work with you to control the flow of information throughout the process." },
      { q: 'Will my employees be taken care of?', a: "Employee retention is often one of the top priorities for business owners, and it's something we discuss extensively with potential partners. Many private equity firms view your team as one of the most valuable assets they're acquiring." },
      { q: 'What happens after a partner is selected?', a: "Our involvement doesn't end at the introduction. We stay engaged through due diligence, term sheet negotiations, and all the way to closing. We're there to make sure the deal reflects what matters most to you — and that you feel confident at every step of the way." },
    ],
  },
  cta: {
    heading: 'Ready to have a conversation?',
    body: "Whether you're actively considering a transaction or simply exploring your options, we'd welcome the opportunity to connect.",
    button: 'Get In Touch →',
    to: '/contact',
  },
};

const ABOUT_DATA = {
  hero: {
    heading: 'Bridging The Gap Between Exceptional Businesses And Private Capital',
    body: 'Newflow Partners was founded by former private equity investors who saw a better way to connect PE firms with exceptional companies and to serve as the trusted advisor for business owners who are navigating one of the most important decisions of their lives.',
  },
  story: {
    label: 'Our Story',
    heading: 'Built By Private Equity For Private Equity',
    body: "We founded Newflow Partners to bridge that gap and be the trusted advisor on both sides of the table. We believe in doing business the right way with transparency, effort and service-oriented quality to create long-term client relationships.",
    photo: '/images/aboutUsBridge.jpg',
  },
  values: {
    heading: 'Our Values',
    cards: [
      { title: 'Quality Over Quantity', body: "Every engagement is thoroughly researched and thoughtfully executed. We'd rather make three perfect introductions than thirty irrelevant ones." },
      { title: 'Respect for Founders', body: "We understand that businesses represent years of sacrifice and hard work. We treat every founder conversation with the seriousness it deserves." },
      { title: 'Long-Term Thinking', body: 'We measure our success by the quality of the partnerships we create, not just the volume of deals we close. Many of our clients become long-term relationships.' },
    ],
  },
  leadership: {
    heading: 'Leadership',
    members: [
      { name: 'Jason Levine', title: 'Managing Partner', bio: "Jason Levine is the Managing Partner of Newflow Partners and leads the firm's private equity advisory practice. Prior to founding Newflow, Jason spent over a decade at leading private equity firms where he was responsible for sourcing, evaluating, and executing platform and add-on investments across a range of industries.", photo: '/images/jasonLevine.jpg' },
      { name: 'Zack Levine', title: 'Partner & General Counsel', bio: "Zack Levine serves as Partner and General Counsel at Newflow Partners. Zack brings extensive experience in corporate and transactional law, having advised on hundreds of M&A transactions throughout his career.", photo: '/images/zackLevine.jpg' },
      { name: 'Brandon Levine', title: 'Head of Business Development', bio: "Brandon Levine is a Partner at Newflow Partners, focused on business development and investor relations. With a background in private equity and entrepreneurship, Brandon brings a unique perspective to the firm's work.", photo: '/images/brandonLevine.jpg' },
    ],
  },
  talent: {
    heading: 'Exceptional Talent',
    body: "Newflow's Leadership is supported by a team of 20+ sector industry experts and research personnel, leveraging backgrounds in management consulting, investment banking & corporate transactional law.",
    photo: '/images/businessOwners/img2.png',
  },
  cta: {
    heading: 'Ready To Significantly Accelerate Your Proprietary Deal Pipeline?',
    button: 'Get In Touch →',
    to: '/contact',
  },
};

const CONTACT_DATA = {
  hero: {
    heading: 'Start A Confidential Conversation',
    subtext: "Whether you're a private equity firm looking to enhance your deal flow or a business owner who's received our outreach, we'd welcome the opportunity to speak with you. All conversations are confidential.",
  },
  card: {
    leftImage: '/images/contactUsLogo.png',
    emailLabel: 'Email',
    email: 'Info@NewflowPartners.com',
    locationLabel: 'Find Us In',
    locations: ['Miami Beach, Florida', 'Mumbai, India'],
    formHeading: 'Contact',
    fields: [
      { id: 'name', label: 'Name', type: 'text', required: true },
      { id: 'email', label: 'Email', type: 'email', required: true },
      { id: 'company', label: 'Company Name', type: 'text', required: false },
      { id: 'message', label: 'Message', type: 'textarea', required: true },
    ],
    submit: 'Send Message →',
  },
};

// ============================================================
// SCROLL TO TOP
// ============================================================
function useCountUp(target, duration = 1500, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function StatItem({ stat }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const numMatch = stat.value.match(/[\d.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;
  const prefix = stat.value.replace(/[\d.]+.*/, '');
  const suffix = stat.value.replace(/^[^0-9]*[\d.]+/, '');
  const count = useCountUp(num, 1500, inView);
  const display = Number.isInteger(num) ? count : count.toFixed(0);
  return (
    <div ref={ref} className="home-stat">
      <span className="home-stat__value">{prefix}{display}{suffix}</span>
      <span className="home-stat__label" dangerouslySetInnerHTML={{__html: stat.label.replace(/\n/g, '<br/>')}} />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageTransition({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power1.out' });
  }, [pathname]);
  return <div ref={ref}>{children}</div>;
}

// ============================================================
// NAV COMPONENT
// ============================================================
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__logo">
          <img src={NAV_DATA.logoLight} alt="Newflow Partners" className="nav__logo-img" />
        </Link>
        <ul className="nav__links">
          {NAV_DATA.links.map((link) =>
            link.cta ? (
              <li key={link.to}><Link to={link.to} className={`nav__cta${location.pathname === link.to ? ' nav__link--active' : ''}`}>{link.label}</Link></li>
            ) : (
              <li key={link.to}>
                <Link to={link.to} className={`nav__link${location.pathname === link.to ? ' nav__link--active' : ''}`}>
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>
        <button className={`nav__hamburger${menuOpen ? ' nav__hamburger--open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
          <span /><span /><span />
        </button>
      </div>
      <div className={`nav__mobile${menuOpen ? ' nav__mobile--open' : ''}`}>
        <ul className="nav__mobile-links">
          {NAV_DATA.links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className={`nav__mobile-link${link.cta ? ' nav__mobile-link--cta' : ''}`}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ============================================================
// FOOTER COMPONENT
// ============================================================
function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <Link to="/" className="footer__logo">
            <img src={FOOTER_DATA.logo} alt="Newflow Partners" className="footer__logo-img" />
          </Link>
          <nav className="footer__nav" aria-label="Footer navigation">
            <ul>
              {FOOTER_DATA.links.map((link) => (
                <li key={link.label}><Link to={link.to} className="footer__nav-link">{link.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer__divider" />
        <div className="footer__bottom">
          <p className="footer__legal footer__legal--services">{FOOTER_DATA.services}</p>
          <p className="footer__legal">{FOOTER_DATA.finalis}</p>
          <p className="footer__legal footer__legal--links">
            {FOOTER_DATA.finalisLinks.map((link, i) => (
              <span key={link.label}>
                {i > 0 && ' | '}
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="footer__legal-link">{link.label}</a>
              </span>
            ))}
          </p>
          <p className="footer__legal">{FOOTER_DATA.disclaimer}</p>
          <p className="footer__legal footer__legal--copy">{FOOTER_DATA.legal}</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function Home() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const heroRef = useRef(null);
  const totalSlides = HOME_DATA.industries.cards.length;

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setVisibleCount(w < 600 ? 1 : w < 960 ? 2 : 4);
      setSlideIndex(0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const totalPages = Math.ceil(totalSlides / visibleCount);
  const maxIndex = totalPages - 1;
  const currentCards = HOME_DATA.industries.cards.slice(slideIndex * visibleCount, slideIndex * visibleCount + visibleCount);

  const goTo = (idx) => {
    setFading(true);
    setTimeout(() => { setSlideIndex(idx); setFading(false); }, 260);
  };

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(Math.min(maxIndex, slideIndex + 1));
      else goTo(Math.max(0, slideIndex - 1));
    }
    touchStartX.current = null;
  };



  return (
    <>
    <Helmet>
      <title>Newflow Partners — Your Business Deserves The Right Partner</title>
      <meta name="description" content="Newflow Partners helps exceptional business owners navigate private equity partnerships and helps leading investors find their next great opportunity." />
      <meta property="og:title" content="Newflow Partners — Your Business Deserves The Right Partner" />
      <meta property="og:description" content="Newflow Partners helps exceptional business owners navigate private equity partnerships and helps leading investors find their next great opportunity." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://newflowpartners.com/" />
      <meta property="og:image" content="https://newflowpartners.com/images/logo-glass-composition.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Newflow Partners — Your Business Deserves The Right Partner" />
      <meta name="twitter:description" content="Newflow Partners helps exceptional business owners navigate private equity partnerships and helps leading investors find their next great opportunity." />
      <link rel="canonical" href="https://newflowpartners.com/" />
    </Helmet>
    <main className="home">
      <section className="home-hero" ref={heroRef}>
        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <h1 className="home-hero__heading">
              <span className="home-hero__heading-line1">{HOME_DATA.hero.heading1}</span><br />
              <span className="home-hero__accent">{HOME_DATA.hero.heading2}</span>
            </h1>
            <p className="home-hero__body">{HOME_DATA.hero.body1}</p>
            <p className="home-hero__body">{HOME_DATA.hero.body2}</p>
            <div className="home-hero__ctas">
              {HOME_DATA.hero.ctas.map((cta) => (
                <Link key={cta.to} to={cta.to} className="btn btn-outline">{cta.label} <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px'}} /></Link>
              ))}
            </div>
          </div>
          <div className="home-hero__image-wrap">
            <img src="/images/heroImage_cut.png" alt="hero" className="home-hero__image" />
          </div>
        </div>
        <div className="home-stats-bar">
          <div className="container home-stats-bar__inner">
            {HOME_DATA.stats.map((stat) => (
              <StatItem key={stat.value} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      <section className="home-services">
        <div className="container">
          <div className="home-services__grid">
            {HOME_DATA.services.cards.map((card) => (
              <article key={card.title} className="home-service-card">
                <h2 className="home-service-card__title">{card.title}</h2>
                <span className="home-service-card__sublabel">{card.sublabel}</span>
                <div className="home-service-card__divider"></div>
                <div className="home-service-card__body">
                  <p>{card.body}</p>
                  {card.body2 && <p style={{marginTop:'1rem'}}>{card.body2}</p>}
                </div>
                <Link to={card.to} className="home-service-card__link">{card.link}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-who">
        <div className="container">
          <div className="home-who__top">
            <span className="home-who__top-label">{HOME_DATA.whoWeAre.label}</span>
            <div className="home-who__top-divider" />
          </div>
          <div className="home-who__inner">
            <div className="home-who__photo-frame">
              <div className="home-who__photo-wrap">
                <video className="home-who__video" autoPlay muted loop playsInline src="/images/who-we-are-bg.mp4" />
                <div className="home-who__photo-overlay"><span>Connecting Great Businesses<br/>With Great Partners</span></div>
              </div>
            </div>
            <div className="home-who__copy">
              <h2 className="home-who__heading">{HOME_DATA.whoWeAre.heading}</h2>
              <span className="home-who__accent" />
              <p className="home-who__body">{HOME_DATA.whoWeAre.body}</p>
              <p className="home-who__body" style={{marginTop:'1rem'}}>{HOME_DATA.whoWeAre.body2}</p>
              <Link to="/about" className="home-who__link">Meet Our Team <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px'}} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-industries">
        <div className="container">
          <div className="home-industries__header">
            <h2 className="home-industries__heading">{HOME_DATA.industries.heading}</h2>
            <p className="home-industries__subtitle">{HOME_DATA.industries.subtitle}</p>
          </div>
          <div className="home-industries__slider" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className={`home-industries__track${fading ? ' is-fading' : ''}`}>
              {currentCards.map((card, i) => (
                <div key={card.name} className={`home-industry-card ${i % 2 === 1 ? 'home-industry-card--even' : ''}`}>
                  <img src={card.image} alt={card.name} className="home-industry-card__img" />
                  <div className="home-industry-card__overlay">
                    <span className="home-industry-card__name">{card.name}<br />{card.name2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="home-industries__footer">
            <div className="home-industries__footer-line">
              <div className="home-industries__footer-progress" style={{ width: `${((slideIndex + 1) / totalPages) * 100}%` }} />
            </div>
            <div className="home-industries__nav-btns">
              <button className={`home-industries__nav-btn home-industries__nav-btn--prev${slideIndex === maxIndex ? ' active' : ''}`} onClick={() => goTo(Math.max(0, slideIndex - 1))} disabled={slideIndex === 0} aria-label="Previous">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="home-industries__nav-btn home-industries__nav-btn--next" onClick={() => setSlideIndex(i => Math.min(maxIndex, i + 1))} disabled={slideIndex === maxIndex} aria-label="Next">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta" style={{ backgroundImage: `url(${HOME_DATA.cta.bgImage})` }}>
        <div className="container home-cta__inner">
          <h2 className="home-cta__heading">{HOME_DATA.cta.heading}</h2>
          <p className="home-cta__body">Whether you're a business owner exploring your options or a private equity firm seeking your next opportunity, we'd welcome the chance to connect.</p>
          <Link to={HOME_DATA.cta.to} className="btn btn-green">Get In Touch <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px',filter:'brightness(0) invert(1)'}} /></Link>
        </div>
      </section>
    </main>
    </>
  );
}

// ============================================================
// INVESTORS PAGE
// ============================================================
function Investors() {
  const [drawerIndex, setDrawerIndex] = useState(null);
  const { hero, services, approach, advantages, verticals, cta } = {
    hero: { title: ['Deal Sourcing For Private Equity,', 'By Former Private Equity Professionals'], text: "We've built our reputation sourcing high-quality, proprietary investment opportunities for leading private equity firms and their portfolio companies from the first outreach through close." },
    services: { title: 'What We Do', subtitle: 'Comprehensive Deal Sourcing From Thesis To Close', items: [ { title: 'Platform Investments', text: "We identify and engage exceptional businesses that align with your investment thesis, creating proprietary opportunities you won't find through your existing channels.", image: '/images/platform-investments.png?v=2' }, { title: 'Add-On Acquisitions', text: 'For portfolio companies pursuing buy-and-build strategies, we provide systematic, highly targeted outreach to accelerate your acquisition pipeline and execute your growth plans.', image: '/images/addon-acquisitions.png?v=2' }, { title: 'Market Mapping', text: 'Before committing to a strategy, we assess the viability of the opportunity, mapping the full competitive landscape and validating the pool of actionable targets.', image: '/images/market-mapping.png?v=2' } ] },
    approach: { title: 'Our Approach', text: "We operate as an extension of your deal team. That means we're with you at every stage from understanding your thesis to facilitating the final close. We're embedded in your process, learning your strategy, adapting as your priorities evolve, and delivering introductions that are truly worth your time.", ctaLabel: 'Accelerate Your Pipeline', ctaTo: '/contact', image: '/images/approach-investors.png', imageAlt: 'Deal sourcing with precision' },
    advantages: { eyebrow: 'Why Newflow?', title: 'What Sets Us Apart', image: '/images/WhatSetsUsApart.jpg', imageAlt: 'Curated opportunities', caption: ['Curated', 'Opportunities'], items: [ { title: 'Exceptional Talent', text: 'Unlike traditional buyside firms, we are former private equity investors. We understand how you evaluate deals, what matters in diligence, and how to position opportunities effectively.' }, { title: 'Quality Over Quantity', text: 'Our relentless focus on quality and thoughtfulness enables us to unlock deals where others have failed. Every introduction we make has been thoroughly researched and vetted.' }, { title: 'True Partnership', text: 'We act as an extension of your deal team understanding your strategy learning your process and adapting our approach as your priorities evolve' }, { title: 'Proven Track Record', text: 'Our clients include a significant portion of the largest global mega-cap private equity firms and many across the lower and middle-market.' } ] },
    verticals: { title: ['Deep Expertise Across', 'Twelve Industry Verticals'], text: 'Our team has sourced and evaluated deals across a broad range of industries, giving us the context to act quickly and add value from day one.', items: [
      { name: 'Business Services', subs: ['Accounting, tax & advisory','Technical staffing & workforce solutions','Background screening & compliance','Economic consulting & expert witness','Employee benefits consulting','Corporate outsourced business process','Lab safety testing & inspection'] },
      { name: 'Industrials & Manufacturing', subs: ['Pipe, valve & flow control distribution','Electrical power & utility services','Condensate pumps & HVAC accessories manufacturing','Heavy equipment wear parts manufacturing','Industrial container & packaging'] },
      { name: 'Healthcare Services', subs: ['Healthcare valuation & advisory','Multi-site pain management provider','Veterinary clinic networks','Home health & personal care services','Anatomical sciences & bioskills education','Specialty liquid pharmaceuticals manufacturing','Life sciences & specialty chemical ingredients'] },
      { name: 'Technology & Software', subs: ['Field service management software','AI-enabled logistics roll-up','IT infrastructure & data center services','IT managed services provider','Digital marketing','Vertical software','Government-focused software'] },
      { name: 'Aerospace & Defense', subs: ['Engineered aerospace & defense components','Precision machining for defense & aviation','Specialty chemicals for A&D'] },
      { name: 'Consumer & Retail', subs: ['Vitamins, minerals & supplements (VMS)','Hispanic foods manufacturer','Branded pet products platforms','Multi-brand restaurant concepts','Franchise platform roll-up'] },
      { name: 'Infrastructure Services', subs: ['Pipeline construction & infrastructure services','Road safety & traffic management','Electrical utility construction & maintenance','Environmental & infrastructure platforms','Railroad railcar maintenance & repair'] },
      { name: 'Residential & Commercial Services', subs: ['Elevator installation, modernization & maintenance','Electrical systems installation & service','Fire protection & life safety services','Residential HVAC, plumbing & electrical','Commercial landscaping'] },
      { name: 'Financial Services', subs: ['Advisory to financial institutions','Employee benefits consulting & brokerage','Insurance claims & risk services','Financial institution strategic consulting','Insurance claims administration'] },
      { name: 'Education & Training', subs: ['Early childhood education','Youth enrichment activities','Bioskills & anatomical sciences training','Food safety testing & compliance training'] },
      { name: 'Distribution & Logistics', subs: ['Electrical & industrial components distribution','Industrial & electrical component distribution','Automotive aftermarket parts distribution','AI-enabled logistics optimization','Flow control distribution','Automotive drivetrain components distribution'] },
      { name: 'Energy & Environmental', subs: ['Fuel systems & petroleum equipment','Environmental consulting & sustainability','Environmental remediation services','Pipeline construction & infrastructure','Manufacturers of oilfield tools'] },
    ]},
    cta: { title: ['Ready To Significantly Accelerate', 'Your Proprietary Deal Pipeline?'], description: "The best PE deal teams are already leveraging Newflow Partners. We'd welcome the opportunity to learn about your investment strategy and explore how we can work together.", buttonLabel: 'Get In Touch', buttonTo: '/contact' }
  };
  return (
    <>
    <Helmet>
      <title>Deal Sourcing For Private Equity — Newflow Partners</title>
      <meta name="description" content="Newflow Partners sources high-quality, proprietary investment opportunities for leading private equity firms — from first outreach through close." />
      <meta property="og:title" content="Deal Sourcing For Private Equity — Newflow Partners" />
      <meta property="og:description" content="Newflow Partners sources high-quality, proprietary investment opportunities for leading private equity firms — from first outreach through close." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://newflowpartners.com/investors" />
      <meta property="og:image" content="https://newflowpartners.com/images/logo-glass-composition.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Deal Sourcing For Private Equity — Newflow Partners" />
      <meta name="twitter:description" content="Newflow Partners sources high-quality, proprietary investment opportunities for leading private equity firms — from first outreach through close." />
      <link rel="canonical" href="https://newflowpartners.com/investors" />
    </Helmet>
      <section className="investors-hero">
        <img src="/images/investor-hero.png" alt="" className="investors-hero__img" />
        <div className="container investors-hero-shell">
          <div className="investors-hero-copy">
            <h1 className="investors-hero-title">{INVESTORS_DATA.hero.heading1}</h1>
            <p className="investors-hero-subtitle">{INVESTORS_DATA.hero.heading2}</p>
            <p className="investors-hero-text">{INVESTORS_DATA.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="investors-services-section">
        <div className="container">
          <div className="investors-services-header">
            <h2 className="investors-services-title">{services.title}</h2>
            <p className="investors-services-subtitle">{services.subtitle}</p>
          </div>
          <div className="investors-services-divider" />
          <div className="investors-services-grid">
            {services.items.map((s) => (
              <article className="investors-service-card" key={s.title}>
                <div className="investors-service-image"><img src={s.image} alt={s.title} /></div>
                <div className="investors-service-body">
                  <h3 className="investors-service-title">{s.title}</h3>
                  <div className="investors-service-line" />
                  <p className="investors-service-text">{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="investors-approach-section">
        <div className="container investors-approach-shell">
          <div className="investors-approach-copy">
            <h2 className="investors-approach-title">{approach.title}</h2>
            <div className="investors-approach-line" />
            <p className="investors-approach-text">{approach.text}</p>
            <Link className="investors-approach-link" to={approach.ctaTo}>
              <span>{approach.ctaLabel}</span>
              <img src="/images/buttonArrow.svg" alt="" aria-hidden="true" style={{width:'14px'}} />
            </Link>
          </div>
          <div className="investors-approach-visual-wrap">
            <div className="investors-approach-visual-frame" />
            <div className="investors-approach-visual">
              <img src={approach.image} alt={approach.imageAlt} className="investors-approach-img--desktop" />
              <img src="/images/approach-tablet.png" alt={approach.imageAlt} className="investors-approach-img--tablet" />
              <div className="investors-approach-visual-text">
                <span>Deal Sourcing</span>
                <span>With Precision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="investors-advantages-section">
        <div className="container">
          <div className="investors-advantages-header">
            <p className="investors-advantages-eyebrow">{advantages.eyebrow}</p>
            <h2 className="investors-advantages-title">{advantages.title}</h2>
          </div>
          <div className="investors-advantages-divider" />
          <div className="investors-advantages-layout">
            <div className="investors-advantages-visual">
              <img src={advantages.image} alt={advantages.imageAlt} />
              <div className="investors-advantages-visual-caption">
                <p>{advantages.caption[0]}<br />{advantages.caption[1]}</p>
              </div>
            </div>
            <div className="investors-advantages-grid">
              {advantages.items.map((item) => (
                <article className="investors-advantage-card" key={item.title}>
                  <h3 className="investors-advantage-title">{item.title}</h3>
                  <p className="investors-advantage-text">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="investors-verticals-section">
        <div className="container">
          <div className="investors-verticals-header">
            <h2 className="investors-verticals-title">{verticals.title[0]}<br />{verticals.title[1]}</h2>
            <div className="investors-verticals-line" />
            <p className="investors-verticals-text">{verticals.text}</p>
          </div>
          <div className="investors-verticals-grid">
            {verticals.items.map((item, index) => (
              <article className="investors-vertical-card" key={item.name} onClick={() => setDrawerIndex(index)}>
                <span>{item.name}</span>
                <span className="investors-vertical-arrow"><img src="/images/buttonArrow.svg" alt="" /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta" style={{ backgroundImage: `url('/images/cta-bg.png')` }}>
        <div className="container home-cta__inner">
          <h2 className="home-cta__heading">{cta.title[0]}<br />{cta.title[1]}</h2>
          <p className="home-cta__body">The best PE deal teams are already leveraging Newflow Partners. We'd welcome the opportunity to learn about your investment strategy and explore how we can work together.</p>
          <Link to={cta.buttonTo} className="btn btn-green">Get In Touch <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px',filter:'brightness(0) invert(1)'}} /></Link>
        </div>
      </section>

      {/* Vertical Drawer */}
      {drawerIndex !== null && (() => {
        const items = verticals.items;
        const item = items[drawerIndex];
        const prev = () => setDrawerIndex((drawerIndex - 1 + items.length) % items.length);
        const next = () => setDrawerIndex((drawerIndex + 1) % items.length);
        return (
          <div className="vertical-drawer-overlay" onClick={() => setDrawerIndex(null)}>
            <div className="vertical-drawer" onClick={e => e.stopPropagation()}>
              <button className="vertical-drawer__close" onClick={() => setDrawerIndex(null)}>✕</button>
              <p className="vertical-drawer__eyebrow">Representative Engagement Experience</p>
              <h3 className="vertical-drawer__title">{item.name}</h3>
              <div className="vertical-drawer__divider" />
              <ul className="vertical-drawer__list">
                {item.subs.map(sub => <li key={sub}>{sub}</li>)}
              </ul>
              <div className="vertical-drawer__nav">
                <button className="vertical-drawer__nav-prev" onClick={prev}>←</button>
                <button className="vertical-drawer__nav-next" onClick={next}>→</button>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

// ============================================================
// FAQ GRID — one open at a time, two columns
// ============================================================
function BOFaqGrid({ items }) {
  const [activeCol, setActiveCol] = useState(null); // 0 = left, 1 = right
  const [leftOpen, setLeftOpen] = useState(null);
  const [rightOpen, setRightOpen] = useState(null);

  const toggleLeft = (i) => {
    if (activeCol === 1) { setRightOpen(null); }
    setActiveCol(0);
    setLeftOpen(leftOpen === i ? null : i);
  };
  const toggleRight = (i) => {
    if (activeCol === 0) { setLeftOpen(null); }
    setActiveCol(1);
    setRightOpen(rightOpen === i ? null : i);
  };

  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <div className="bo-faqs__grid">
      <div className="bo-faqs__col">
        {left.map((item, i) => (
          <FAQItem key={item.q} item={item} isOpen={leftOpen === i} onToggle={() => toggleLeft(i)} />
        ))}
      </div>
      <div className="bo-faqs__col">
        {right.map((item, i) => (
          <FAQItem key={item.q} item={item} isOpen={rightOpen === i} onToggle={() => toggleRight(i)} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TESTIMONIAL SLIDER
// ============================================================
function BOTestimonialSection() {
  const [idx, setIdx] = useState(0);
  const quoteRef = useRef(null);
  const testimonials = BUSINESS_OWNERS_DATA.testimonials;
  const total = testimonials.length;

  const animateChange = (newIdx) => {
    const el = quoteRef.current;
    if (!el) { setIdx(newIdx); return; }
    gsap.to(el, { opacity: 0, y: 12, duration: 0.2, ease: 'power2.in', onComplete: () => {
      setIdx(newIdx);
      gsap.fromTo(el, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' });
    }});
  };

  const prev = () => animateChange((idx - 1 + total) % total);
  const next = () => animateChange((idx + 1) % total);
  const t = testimonials[idx];

  return (
    <section className="bo-testimonial">
      <div className="container bo-testimonial__inner">
        <div className="bo-testimonial__content">
          <div ref={quoteRef}>
            <span className="bo-testimonial__quote-icon">"</span>
            <blockquote className="bo-testimonial__quote">{'\u201C'}{t.quote}{'\u201D'}</blockquote>
          </div>
          <div className="bo-testimonial__divider" />
          <cite className="bo-testimonial__attribution">{t.attribution}</cite>
          <div className="bo-testimonial__nav">
            <button className="bo-testimonial__arrow bo-testimonial__arrow--prev" onClick={prev}>←</button>
            <button className="bo-testimonial__arrow bo-testimonial__arrow--next" onClick={next}>→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// BUSINESS OWNERS PAGE
// ============================================================
function BusinessOwners() {
  return (
    <>
    <Helmet>
      <title>Sell Your Business With Confidence — Newflow Partners</title>
      <meta name="description" content="Newflow Partners guides exceptional business owners through private equity partnerships — helping you find the right partner, on your terms." />
      <meta property="og:title" content="Sell Your Business With Confidence — Newflow Partners" />
      <meta property="og:description" content="Newflow Partners guides exceptional business owners through private equity partnerships — helping you find the right partner, on your terms." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://newflowpartners.com/business-owners" />
      <meta property="og:image" content="https://newflowpartners.com/images/logo-glass-composition.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Sell Your Business With Confidence — Newflow Partners" />
      <meta name="twitter:description" content="Newflow Partners guides exceptional business owners through private equity partnerships — helping you find the right partner, on your terms." />
      <link rel="canonical" href="https://newflowpartners.com/business-owners" />
    </Helmet>
    <main className="bo-page">
      <section className="bo-hero">
        <img className="bo-hero__img" src="/images/boHeroRight.png" alt="" aria-hidden="true" />
        <div className="container bo-hero__inner">
          <div className="bo-hero__copy">
            <h1 className="bo-hero__heading">A Trusted Guide To<br />Navigate Private Equity</h1>
            <p className="bo-hero__body">{BUSINESS_OWNERS_DATA.hero.body}</p>
          </div>
        </div>
      </section>

      <section className="bo-who">
        <div className="container bo-who__inner">
          <div className="bo-who__copy">
            <span className="bo-who__label">{BUSINESS_OWNERS_DATA.whoWeAre.label}</span>
            <h2 className="bo-who__heading">{BUSINESS_OWNERS_DATA.whoWeAre.heading}</h2>
            <p className="bo-who__body">{BUSINESS_OWNERS_DATA.whoWeAre.body}</p>
            <p className="bo-who__body">{BUSINESS_OWNERS_DATA.whoWeAre.body2Extra}</p>
            <p className="bo-who__body bo-who__body--emphasis">{BUSINESS_OWNERS_DATA.whoWeAre.bodyHighlight}</p>
          </div>
          <div className="bo-who__photo-wrap">
            <video className="bo-who__photo" autoPlay muted loop playsInline>
              <source src="/images/boWhoVideo.mp4" type="video/mp4" />
            </video>
            <div className="bo-who__photo-overlay"><span>{BUSINESS_OWNERS_DATA.whoWeAre.photoOverlay}</span></div>
          </div>
        </div>
        <div className="container">
          <div className="bo-who__divider" />
          <div className="bo-who__columns">
            {BUSINESS_OWNERS_DATA.whoWeAre.columns.map((col) => (
              <div key={col.title}>
                <h3 className="bo-who__col-title">{col.title}</h3>
                <p className="bo-who__col-body">{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bo-right">
        <div className="container bo-right__inner">
          <div className="bo-right__header">
            <span className="bo-right__label">{BUSINESS_OWNERS_DATA.rightForYou.label}</span>
            <h2 className="bo-right__heading">Business Owners <span>Work With Us When…</span></h2>
            <div className="bo-right__divider" />
          </div>
          <div className="bo-right__layout">
            <div className="bo-right__photo-wrap">
              <img src={BUSINESS_OWNERS_DATA.rightForYou.photo} alt="Clarity At Every Stage" className="bo-right__photo" />
              <div className="bo-right__photo-overlay"><span>Clarity At<br />Every Stage</span></div>
            </div>
            <div className="bo-right__cards">
              {BUSINESS_OWNERS_DATA.rightForYou.cards.map((card) => (
                <div key={card.title} className="bo-right-card">
                  <h3 className="bo-right-card__title">{card.title}</h3>
                  <p className="bo-right-card__body">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bo-commitment">
        <div className="container">
          <div className="bo-commitment__header">
            <span className="bo-commitment__label">{BUSINESS_OWNERS_DATA.commitment.label}</span>
            <h2 className="bo-commitment__heading">Our Commitment To Every Business Owner</h2>
          </div>
          <div className="bo-commitment__grid">
            {BUSINESS_OWNERS_DATA.commitment.cards.map((card) => (
              <div key={card.title} className="bo-commitment-card">
                <h3 className="bo-commitment-card__title">{card.title}</h3>
                <p className="bo-commitment-card__body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bo-process">
        <div className="container bo-process__inner">
          <div className="bo-process__photo-wrap">
            <img src={BUSINESS_OWNERS_DATA.process.photo} alt="Your Goals Drive The Process" className="bo-process__photo" />
          </div>
          <div className="bo-process__copy">
            <h2 className="bo-process__heading">{BUSINESS_OWNERS_DATA.process.heading}</h2>
            <div className="bo-process__body">
              {BUSINESS_OWNERS_DATA.process.body.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            <Link to={BUSINESS_OWNERS_DATA.process.cta.to} className="btn btn-outline" style={{marginTop:'1.5rem', width:'fit-content'}}>{BUSINESS_OWNERS_DATA.process.cta.label} <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px'}} /></Link>
          </div>
        </div>
      </section>

      {/* Testimonials removed per client feedback */}

      <section className="bo-faqs">
        <div className="container">
          <h2 className="bo-faqs__heading">{BUSINESS_OWNERS_DATA.faqs.heading}</h2>
          <BOFaqGrid items={BUSINESS_OWNERS_DATA.faqs.items} />
        </div>
      </section>

      <section className="bo-cta">
        <div className="container">
          <div className="bo-cta__inner">
            <h2 className="bo-cta__heading">{BUSINESS_OWNERS_DATA.cta.heading}</h2>
            <p className="bo-cta__body">{BUSINESS_OWNERS_DATA.cta.body}</p>
            <Link to={BUSINESS_OWNERS_DATA.cta.to} className="btn btn-green">Get In Touch <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px',filter:'brightness(0) invert(1)'}} /></Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function About() {
  const leadership = [
    { name: 'Jason Levine', role: 'Managing Partner', image: '/images/jasonLevine.jpg', bio: 'Jason founded and serves as Managing Partner at Newflow Partners. Prior to founding Newflow, Jason served as Global Head of Business Development at L Catterton, the largest consumer-focused private equity firm, where he sourced investments in Cholula (acquired by McCormick), Nutrafol (acquired by Unilever), The Honest Company (Nasdaq: HNST), Tonal, Canidae Pet Food, Everlane, ThirdLove, and Norwegian Cruise Lines (NYSE: NCLH). Prior to L Catterton, Jason was a deal professional at New Mountain Capital and Summit Partners. He holds a B.A. in Financial Economics and Entrepreneurship, cum laude, from Vanderbilt University. Jason is a Registered Representative of Finalis Securities LLC Member FINRA/SIPC.' },
    { name: 'Zack Levine', role: 'Partner & General Counsel', image: '/images/zackLevine.jpg', bio: 'Zack serves as Partner & General Counsel at Newflow Partners. Prior to joining Newflow Partners, Zack worked as an attorney at Davis Polk & Wardwell, where he represented companies, private equity firms, hedge funds, banks and other strategic parties in a wide range of corporate transactions. Prior to Davis Polk, Zack worked as an associate at New Markets Advisors, a leading boutique management consulting firm focused on innovation and growth strategies. Zack holds a B.A., summa cum laude, from Duke University and a J.D. from the University of Chicago Law School, where he was a member of the law review.' },
    { name: 'Brandon Levine', role: 'Head of Business Development', image: '/images/brandonLevine.jpg', bio: 'Brandon services as a Partner at Newflow Partners where he leads numerous client engagements across a variety of industry verticals. Prior to Newflow, Brandon was a growth equity investor at Norwest Venture Partners, a leading venture and growth equity firm with more than $15 billion in capital. Brandon holds a B.S. from University of Michigan, where he majored in Computer and Information Sciences and Data Network Analytics.' },
  ];
  const values = [
    { title: 'Quality Over Quantity', text: "Every engagement is thoroughly researched and thoughtfully executed. We'd rather make three perfect introductions than thirty irrelevant ones." },
    { title: 'Respect For Founders', text: 'We understand that businesses represent years of sacrifice and hard work. We treat every founder conversation with the seriousness it deserves.' },
    { title: 'Long-Term Thinking', text: 'We measure our success by the quality of the partnerships we create, not just the volume of deals we close. Many of our clients and contacts become long-term relationships.' },
  ];
  return (
    <>
    <Helmet>
      <title>About Newflow Partners — Former Private Equity Professionals</title>
      <meta name="description" content="Newflow Partners was founded by former private equity investors who understand both sides of the deal. Learn about our team and our approach." />
      <meta property="og:title" content="About Newflow Partners — Former Private Equity Professionals" />
      <meta property="og:description" content="Newflow Partners was founded by former private equity investors who understand both sides of the deal. Learn about our team and our approach." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://newflowpartners.com/about" />
      <meta property="og:image" content="https://newflowpartners.com/images/logo-glass-composition.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="About Newflow Partners — Former Private Equity Professionals" />
      <meta name="twitter:description" content="Newflow Partners was founded by former private equity investors who understand both sides of the deal. Learn about our team and our approach." />
      <link rel="canonical" href="https://newflowpartners.com/about" />
    </Helmet>
      <section className="about-page-hero">
        <img src="/images/about-hero.png" alt="" className="about-page-hero__img" aria-hidden="true" />
        <div className="container about-page-hero-shell">
          <div className="about-page-hero-copy">
            <h1 className="about-page-hero-title">Bridging The Gap Between<br />Exceptional Businesses<br />And Private Capital</h1>
            <p className="about-page-hero-text">Newflow Partners was founded by former private equity investors who saw a better way to connect PE firms with exceptional companies and to serve as the trusted advisor for business owners navigating the most important decision of their lives.</p>
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="container about-story-shell">
          <div className="about-story-copy">
            <p className="about-story-eyebrow">Our Story</p>
            <h2 className="about-story-title">Built By Private Equity For<br />Private Equity</h2>
            <div className="about-story-line" />
            <p className="about-story-text">After years working at leading private equity firms, we understood both sides of the challenge intimately: the difficulty investors face sourcing quality, proprietary deal flow and the overwhelming experience business owners face when navigating the complex world of private equity for the first time.</p>
            <p className="about-story-text">We founded Newflow Partners to bridge that gap to be the trusted advisor on both sides of the table. We believe in doing business the right way: with transparency, discretion, and an unwavering focus on quality over short-term gains.</p>
          </div>
          <div className="about-story-visual-wrap">
            <div className="about-story-visual-frame" />
            <div className="about-story-visual">
              <img src="/images/aboutUsSection2.jpg" alt="Newflow Partners story" />
            </div>
          </div>
        </div>
      </section>

      <section className="about-values-section">
        <div className="container">
          <div className="about-values-header">
            <h2 className="about-values-title">Our Values</h2>
          </div>
          <div className="about-values-divider" />
          <div className="about-values-grid">
            {values.map((v) => (
              <article className="about-value-card" key={v.title}>
                <h3 className="about-value-card-title">{v.title}</h3>
                <div className="about-value-card-line" />
                <p className="about-value-card-text">{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-leadership-section" id="team">
        <div className="container">
          <div className="about-leadership-header">
            <h2 className="about-leadership-title">Leadership</h2>
          </div>
          <div className="about-leadership-divider" />
          <div className="leadership-grid">
            {leadership.map((leader) => (
              <article className="leader-card" key={leader.name}>
                <div className="leader-card-photo">
                  <img src={leader.image} alt={leader.name} />
                </div>
                <div className="leader-card-copy">
                  <h3 className="leader-card-name">{leader.name}</h3>
                  <p className="leader-card-role">{leader.role}</p>
                  <div className="leader-card-line" />
                  <p className="leader-card-bio">{leader.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-talent-section">
        <div className="container about-talent-shell">
          <div className="about-talent-copy">
            <h2 className="about-talent-title">Exceptional Talent</h2>
            <div className="about-talent-line" />
            <p className="about-talent-text">Newflow's Leadership is supported by a team of 20+ sector industry experts and research personnel, leveraging backgrounds in management consulting, investment banking & corporate transactional law. Each member brings deep domain knowledge and a proven track record of executing high-value transactions, ensuring that every introduction and engagement is backed by rigorous analysis and strategic insight.</p>
          </div>
          <div className="about-talent-visual-wrap">
            <div className="about-talent-visual-frame" />
            <div className="about-talent-visual">
              <img src="/images/aboutUsBridge.jpg" alt="Exceptional talent at Newflow Partners" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta" style={{ backgroundImage: `url('/images/cta-bg.png')` }}>
        <div className="container home-cta__inner">
          <h2 className="home-cta__heading">Ready To Significantly Accelerate<br />Your Proprietary Deal Pipeline?</h2>
          <p className="home-cta__body">The best PE deal teams are already leveraging Newflow Partners. We'd welcome the opportunity to learn about your investment strategy and explore how we can work together.</p>
          <Link to="/contact" className="btn btn-green">Get In Touch <img src="/images/buttonArrow.svg" alt="" style={{width:'16px',height:'14px',filter:'brightness(0) invert(1)'}} /></Link>
        </div>
      </section>
    </>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newErrors = {};
    if (!fd.get('name')?.trim()) newErrors.name = 'Name is required.';
    if (!fd.get('email')?.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.get('email').trim())) newErrors.email = 'Please enter a valid email.';
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    setSending(true);
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fd.get('name'),
          email: fd.get('email'),
          company: fd.get('company'),
          message: fd.get('message'),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
      setToastKey(k => k + 1);
      if (formRef.current) formRef.current.reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setServerError(err.message || 'Failed to send. Please email us directly at Info@NewflowPartners.com');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
    <Helmet>
      <title>Contact Newflow Partners — Start A Confidential Conversation</title>
      <meta name="description" content="Ready to explore your options? Reach out to Newflow Partners and start a confidential conversation about your business or investment goals." />
      <meta property="og:title" content="Contact Newflow Partners — Start A Confidential Conversation" />
      <meta property="og:description" content="Ready to explore your options? Reach out to Newflow Partners and start a confidential conversation about your business or investment goals." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://newflowpartners.com/contact" />
      <meta property="og:image" content="https://newflowpartners.com/images/logo-glass-composition.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Contact Newflow Partners — Start A Confidential Conversation" />
      <meta name="twitter:description" content="Ready to explore your options? Reach out to Newflow Partners and start a confidential conversation about your business or investment goals." />
      <link rel="canonical" href="https://newflowpartners.com/contact" />
    </Helmet>
    <main className="contact-page">
      <div className="container contact-shell">
        <div className="contact-page-intro">
          <div>
            <h1 className="contact-page-title">
              Start A Confidential<br />Conversation
            </h1>
            <div className="contact-page-line" />
          </div>
          <p className="contact-page-summary">
            Whether you're a private equity firm looking to enhance your deal flow or a business owner who's received our outreach, we'd welcome the opportunity to speak with you. All conversations are confidential.
          </p>
        </div>

        <div className="contact-card">
          <aside className="contact-details">
            <img className="contact-logo-mark" src="/images/contactUsLogo.png" alt="Newflow Partners" />
            <div className="contact-detail-block">
              <h2 className="contact-detail-title">Email</h2>
              <a href="mailto:Info@NewflowPartners.com">Info@NewflowPartners.com</a>
            </div>
            <div className="contact-detail-block">
              <h2 className="contact-detail-title">Find Us In:</h2>
              <p>Miami Beach, Florida</p>
              <p>Mumbai, India</p>
            </div>
          </aside>

          <div className="contact-form-column">
            <h2 className="contact-form-title">Contact</h2>
            <div className="contact-page-line" />
              <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <label className={`contact-field${errors.name ? ' contact-field--error' : ''}`}>
                  <span>Name</span>
                  <input type="text" name="name" onChange={() => errors.name && setErrors(p => ({...p, name: ''}))} />
                  {errors.name && <span className="contact-field__error">{errors.name}</span>}
                </label>
                <label className={`contact-field${errors.email ? ' contact-field--error' : ''}`}>
                  <span>Email</span>
                  <input type="email" name="email" onChange={() => errors.email && setErrors(p => ({...p, email: ''}))} />
                  {errors.email && <span className="contact-field__error">{errors.email}</span>}
                </label>
                <label className="contact-field">
                  <span>Company Name</span>
                  <input type="text" name="company" />
                </label>
                <label className="contact-field contact-field-message">
                  <span>Message</span>
                  <textarea name="message" rows="3" />
                </label>
                {serverError && <p className="contact-server-error">{serverError}</p>}
                <button className="contact-submit" type="submit" disabled={sending}>
                  {sending ? 'Sending...' : 'Send Message'}
                  {!sending && <img src="/images/buttonArrowWhite.svg" alt="" aria-hidden="true" style={{width:'16px',height:'14px'}} />}
                </button>
              </form>
          </div>
          {submitted && (
            <div className="contact-toast" key={toastKey}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:22,height:22,flexShrink:0}}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span>Thank you! We'll be in touch shortly.</span>
              <button className="contact-toast__close" onClick={() => setSubmitted(false)} aria-label="Close">&times;</button>
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  useSmoothScroll();
  return (
    <>
      <style>{STYLES}</style>
      <BrowserRouter>
        <ScrollToTop />
        <Nav />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/investors" element={<Investors />} />
            <Route path="/business-owners" element={<BusinessOwners />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </PageTransition>
        <Footer />
      </BrowserRouter>
    </>
  );
}
