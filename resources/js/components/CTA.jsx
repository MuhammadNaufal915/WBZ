import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Mail } from 'lucide-react';
import '../styles/cta.css';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.cta .reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className="cta" ref={sectionRef} aria-label="Contact us">
      <div className="cta__watermark" aria-hidden="true">LET'S TALK</div>
      <div className="container">
        <div className="cta__inner">
          <div className="cta__label reveal">Get In Touch</div>
          <h2 className="cta__heading reveal">
            Let's Work
            <span>Together</span>
          </h2>
          <p className="cta__sub reveal">
            Have a project in mind? We'd love to hear about it. Let's create
            something extraordinary together.
          </p>
          <div className="cta__actions reveal">
            <a
              href="mailto:hello@wbzcreative.com"
              id="cta-email-btn"
              className="btn btn-primary btn-large"
            >
              <Mail size={18} />
              Start a Project
            </a>
            <a
              href="https://wa.me/62xxxxxxxxxx"
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-btn"
              className="btn btn-outline btn-large"
            >
              WhatsApp Us
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
