import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/about.css';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate all .reveal elements
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

      // Stats count up
      gsap.utils.toArray('.about__stat-num').forEach((el) => {
        const target = parseInt(el.innerText, 10);
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
  }, []);

  return (
    <section id="about" className="about section" ref={sectionRef} aria-label="About WBZ">
      <div className="container">
        <div className="about__inner">

          {/* Left — text */}
          <div>
            <div className="about__label reveal">About Us</div>
            <h2 className="about__heading reveal">
              We Are <span>WBZ</span><br />Creative
            </h2>

            <div className="about__stats">
              <div className="about__stat reveal">
                <div className="about__stat-num">50+</div>
                <div className="about__stat-label">Projects Done</div>
              </div>
              <div className="about__stat reveal">
                <div className="about__stat-num">30+</div>
                <div className="about__stat-label">Happy Clients</div>
              </div>
              <div className="about__stat reveal">
                <div className="about__stat-num">2+</div>
                <div className="about__stat-label">Years Active</div>
              </div>
            </div>
          </div>

          {/* Right — body */}
          <div className="about__body">
            <p className="reveal">
              WBZ Creative Studio is a full-service creative agency dedicated to building
              brands that resonate, inspire, and endure. We combine strategy, design, and
              storytelling to create identities that truly stand out.
            </p>
            <p className="reveal">
              From bold brand identities to immersive digital experiences, every project
              we touch is crafted with intention, passion, and an unwavering commitment
              to excellence.
            </p>

            {/* Visual card */}
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
