import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import '../styles/scaling-video.css';

gsap.registerPlugin(ScrollTrigger);

export default function ScalingVideo() {
  const sectionRef  = useRef(null);
  const stickyRef   = useRef(null);
  const containerRef = useRef(null);
  const [data, setData] = useState(null);

  /* ── Fetch video config ── */
  useEffect(() => {
    axios.get('/content/video')
      .then(r => setData(r.data))
      .catch(console.error);
  }, []);

  /* ── GSAP Scroll animation ── */
  useEffect(() => {
    if (!data || !containerRef.current) return;

    const container = containerRef.current;
    const sticky    = stickyRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          onUpdate(self) {
            // Add CSS class for overlay/badge reveals
            if (self.progress > 0.05) {
              sticky.classList.add('is-expanding');
            } else {
              sticky.classList.remove('is-expanding');
            }
            if (self.progress > 0.85) {
              sticky.classList.add('is-fullscreen');
            } else {
              sticky.classList.remove('is-fullscreen');
            }
          },
        },
      });

      tl.to(container, {
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        ease: 'none',
      });
    });

    return () => ctx.revert();
  }, [data]);

  if (!data) return <div className="scaling-video-section" />;

  const isEmbed = data.src && (data.src.includes('youtube') || data.src.includes('youtu.be'));

  return (
    <section
      className="scaling-video-section"
      ref={sectionRef}
      aria-label="WBZ Showreel"
      id="showreel"
    >
      <div className="scaling-video__sticky" ref={stickyRef}>
        <div className="scaling-video__container" ref={containerRef}>

          {/* Label */}
          <div className="scaling-video__label">
            {data.label || 'WBZ Showreel'}
          </div>

          {/* Video or iframe embed */}
          {isEmbed ? (
            <iframe
              src={data.src}
              title={data.label || 'WBZ Showreel'}
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          ) : (
            <video
              className="scaling-video__video"
              src={data.src}
              poster={data.poster || undefined}
              autoPlay
              muted
              loop
              playsInline
              aria-label={data.label || 'WBZ Showreel'}
            />
          )}

          {/* Gradient overlay */}
          <div className="scaling-video__overlay" />
        </div>
      </div>
    </section>
  );
}
