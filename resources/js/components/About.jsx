import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/content/about')
      .then(r => setData(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.about .reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      gsap.utils.toArray('.about__stat-num').forEach((el) => {
        const text = el.innerText;
        const target = parseInt(text, 10);
        if(isNaN(target)) return;

        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            ease: 'power2.out',
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            },
            onUpdate() {
              el.innerText = Math.round(this.targets()[0].innerText) + '+';
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  if (!data) return <section id="about" className="about section" />;

  return (
    <section id="about" className="about section" ref={sectionRef} aria-label="About WBZ">
      <div className="container">
        <div className="about__inner">
          <div>
            <div className="about__label reveal">About Us</div>
            <h2 className="about__heading reveal">
              {data.title.split(' ').map((word, i) => (
                <React.Fragment key={i}>
                  {word === 'WBZ' ? <span>WBZ</span> : word}
                  {i < data.title.split(' ').length - 1 ? ' ' : ''}
                </React.Fragment>
              ))}
            </h2>

            <div className="about__stats">
              {data.stats.map((stat, i) => (
                <div key={i} className="about__stat reveal">
                  <div className="about__stat-num">{stat.number}</div>
                  <div className="about__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about__body">
            {data.description.split('\n').map((para, i) => (
              <p key={i} className="reveal">{para}</p>
            ))}

            <div className="about__visual reveal" style={{ marginTop: '2rem' }}>
              <img
                src="/images/wbz-logo.png"
                alt="WBZ Creative Studio"
                className="about__visual-img"
                style={{ objectFit: 'contain', background: '#FF5500' }}
              />
              <div className="about__visual-badge">
                <div className="about__visual-badge-dot" />
                <span className="about__visual-badge-text">Available for Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
