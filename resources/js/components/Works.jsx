import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import '../styles/works.css';

gsap.registerPlugin(ScrollTrigger);

export default function Works() {
  const sectionRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/content/works')
      .then(r => setData(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      gsap.from('.work-card', {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.works__grid',
          start: 'top 85%',
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [data]);

  if (!data) return <section id="works" className="works section" />;

  return (
    <section id="works" className="works section" ref={sectionRef} aria-label="Our Works">
      <div className="container">
        <div className="works__header">
          <div>
            <div className="works__label reveal">Selected Works</div>
            <h2 className="works__heading reveal">Featured Projects</h2>
          </div>
          <div className="reveal">
            <a href="#" className="btn btn-outline works__view-all">
              View All Works
            </a>
          </div>
        </div>

        <div className="works__grid">
          {data.items.map((work, idx) => (
            <Link
              key={work.id || idx}
              to={`/works/${work.id || idx + 1}`}
              className="work-card"
              aria-label={`View ${work.title}`}
            >
              <div className="work-card__inner">
                {/* Image */}
                <img
                  src={work.image || '/images/work-placeholder-1.jpg'}
                  alt={work.title}
                  className="work-card__img"
                  loading="lazy"
                />
                
                {/* Overlay details */}
                <div className="work-card__overlay">
                  <div className="work-card__content">
                    <span className="work-card__tag">{work.category}</span>
                    <h3 className="work-card__title">{work.title}</h3>
                    
                    {/* Tags */}
                    {work.tags && work.tags.length > 0 && (
                      <div className="work-card__tags">
                        {work.tags.map(tag => (
                          <span key={tag} className="work-card__tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="work-card__arrow">
                    <ArrowRight size={24} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
