import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import '../styles/works.css';

gsap.registerPlugin(ScrollTrigger);

const works = [
  {
    id: 1,
    title: 'Nexus Brand Identity',
    tag: 'Branding',
    bg: '#1a1a1a',
    accent: '#FF5500',
  },
  {
    id: 2,
    title: 'Pulse Digital Campaign',
    tag: 'Social Media',
    bg: '#111111',
    accent: '#FF7733',
  },
  {
    id: 3,
    title: 'Aura Web Experience',
    tag: 'Web Design',
    bg: '#161616',
    accent: '#FF5500',
  },
  {
    id: 4,
    title: 'Vertex Packaging',
    tag: 'Print',
    bg: '#131313',
    accent: '#FF6622',
  },
  {
    id: 5,
    title: 'Luna Photography',
    tag: 'Photography',
    bg: '#181818',
    accent: '#FF5500',
  },
  {
    id: 6,
    title: 'Stride Strategy',
    tag: 'Strategy',
    bg: '#141414',
    accent: '#FF7733',
  },
];

function WorkPlaceholder({ bg, accent, title }) {
  return (
    <div
      className="work-placeholder"
      style={{ background: bg }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 3vw, 2.5rem)',
          color: accent,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          opacity: 0.5,
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        WBZ
      </span>
    </div>
  );
}

export default function Works() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.works .reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('.work-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="works" className="works" ref={sectionRef} aria-label="Featured works">
      <div className="container">
        <header className="works__header">
          <div>
            <div className="works__label reveal">Portfolio</div>
            <h2 className="works__heading reveal">
              Featured<br />Works
            </h2>
          </div>
          <a href="#contact" className="btn btn-outline reveal" id="works-view-all">
            View All Projects
            <ArrowUpRight size={16} />
          </a>
        </header>
      </div>

      <div className="container" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="works__grid">
          {works.map((work) => (
            <article key={work.id} className="work-card" tabIndex={0} role="img" aria-label={work.title}>
              <WorkPlaceholder bg={work.bg} accent={work.accent} title={work.title} />
              <div className="work-card__overlay">
                <span className="work-card__tag">{work.tag}</span>
                <h3 className="work-card__title">{work.title}</h3>
              </div>
              <div className="work-card__arrow" aria-hidden="true">
                <ArrowUpRight size={18} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
