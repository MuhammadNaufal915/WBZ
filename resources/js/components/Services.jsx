import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Monitor, Camera, Film, PenTool, TrendingUp, Code, Layers, Box, Globe } from 'lucide-react';
import axios from 'axios';
import '../styles/services.css';

gsap.registerPlugin(ScrollTrigger);

const iconMap = { Palette, Monitor, Camera, Film, PenTool, TrendingUp, Code, Layers, Box, Globe };

export default function Services() {
  const sectionRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/content/services')
      .then(r => setData(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      gsap.from('.services__card', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services__grid',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [data]);

  if (!data) return <section id="services" className="services section" />;

  return (
    <section id="services" className="services section" ref={sectionRef} aria-label="Our Services">
      <div className="container">
        <div className="services__header">
          <div className="services__label reveal">Expertise</div>
          <h2 className="services__heading reveal">What We Do</h2>
          <p className="services__desc reveal">
            We offer a comprehensive suite of creative services designed to elevate
            your brand and captivate your audience across all touchpoints.
          </p>
        </div>

        <div className="services__grid">
          {data.items.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Palette;
            return (
              <div key={service.id || index} className="service-card group">
                <div className="service-card__icon">
                  <IconComponent size={28} strokeWidth={1.5} />
                </div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>
                <div className="service-card__arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
