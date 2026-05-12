import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import '../styles/hero.css';

export default function Hero() {
  const labelRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const subRef = useRef(null);
  const actionsRef = useRef(null);
  const scrollRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Label fade in
      tl.to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Headline words stagger
      const words = document.querySelectorAll('.hero__headline-word');
      tl.to(words, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out',
      }, '-=0.4');

      // Tagline + actions
      tl.to([subRef.current, actionsRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      }, '-=0.5');

      // Scroll indicator
      tl.to(scrollRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.3');

      // Stats
      tl.to(statsRef.current, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.5');
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="hero" aria-label="Hero section">
      {/* Background */}
      <div className="hero__bg">
        <div className="hero__gradient" />
        <div className="hero__lines">
          <div className="hero__line" />
          <div className="hero__line" />
          <div className="hero__line" />
        </div>
      </div>

      {/* WBZ watermark */}
      <img
        src="/images/wbz-logo.png"
        alt=""
        className="hero__watermark"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="hero__content">
        {/* Label */}
        <div ref={labelRef} className="hero__label">
          <span className="hero__label-dot" />
          WBZ Creative Studio — Est. 2024
        </div>

        {/* Big Headline */}
        <h1 className="hero__headline">
          <span className="hero__headline-line">
            <span className="hero__headline-word">Where</span>
            &nbsp;
            <span className="hero__headline-word">Ideas</span>
          </span>
          <span className="hero__headline-line">
            <span className="hero__headline-word">Become</span>
          </span>
          <span className="hero__headline-line">
            <span className="hero__headline-word hero__headline-accent">Identity</span>
          </span>
        </h1>

        {/* Sub content */}
        <div className="hero__sub">
          <p ref={subRef} className="hero__tagline">
            We craft bold visual identities, stunning websites, and compelling
            content that transforms your brand into an unforgettable experience.
          </p>
          <div ref={actionsRef} className="hero__actions">
            <a href="#works" className="btn btn-primary" id="hero-view-works">
              View Our Works
              <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-outline" id="hero-contact">
              Let's Talk
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="hero__stats" aria-label="Studio statistics">
        <div className="hero__stat">
          <div className="hero__stat-num">50+</div>
          <div className="hero__stat-label">Projects</div>
        </div>
        <div className="hero__stat">
          <div className="hero__stat-num">30+</div>
          <div className="hero__stat-label">Clients</div>
        </div>
        <div className="hero__stat">
          <div className="hero__stat-num">2+</div>
          <div className="hero__stat-label">Years</div>
        </div>
      </div>
    </section>
  );
}
