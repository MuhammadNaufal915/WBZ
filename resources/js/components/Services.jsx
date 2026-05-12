import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Globe, Camera, Megaphone, Layout, Sparkles } from 'lucide-react';
import '../styles/services.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: '01',
    icon: Palette,
    title: 'Brand Identity',
    desc: 'We craft visual identities that communicate your brand\'s essence — logos, color systems, typography, and brand guidelines that make a lasting impression.',
  },
  {
    num: '02',
    icon: Globe,
    title: 'Web Design',
    desc: 'Beautiful, fast, and functional websites designed to convert. From landing pages to full digital experiences built for performance.',
  },
  {
    num: '03',
    icon: Camera,
    title: 'Photography',
    desc: 'Professional product and brand photography that captures your story. Every image crafted to elevate your visual presence.',
  },
  {
    num: '04',
    icon: Megaphone,
    title: 'Social Media',
    desc: 'Strategic content creation and management that grows your audience, builds community, and drives real engagement across platforms.',
  },
  {
    num: '05',
    icon: Layout,
    title: 'Print & Collateral',
    desc: 'From business cards to packaging — print materials that carry your brand identity into the physical world with precision and style.',
  },
  {
    num: '06',
    icon: Sparkles,
    title: 'Creative Strategy',
    desc: 'Data-informed creative direction that aligns your visual language with business goals for measurable, meaningful impact.',
  },
];

export default function Services() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: (i % 3) * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray('.services .reveal').forEach((el) => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" className="services" ref={sectionRef} aria-label="Our services">
      <div className="container">
        <header className="services__header">
          <div>
            <div className="services__label reveal">What We Do</div>
            <h2 className="services__heading reveal">
              Our<br />Services
            </h2>
          </div>
          <p className="services__sub reveal">
            End-to-end creative solutions tailored to your brand's unique vision and goals.
          </p>
        </header>
      </div>

      <div className="container" style={{ maxWidth: '100%', padding: 0 }}>
        <div className="services__grid">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <article key={svc.num} className="service-card">
                <span className="service-card__num">{svc.num}</span>
                <div className="service-card__icon" aria-hidden="true">
                  <Icon size={20} />
                </div>
                <h3 className="service-card__title">{svc.title}</h3>
                <p className="service-card__desc">{svc.desc}</p>
                <div className="service-card__arrow">
                  Learn more
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
